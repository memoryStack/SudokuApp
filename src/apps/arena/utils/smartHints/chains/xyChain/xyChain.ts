import _filter from '@lodash/filter'
import _forEach from '@lodash/forEach'
import _isNil from '@lodash/isNil'
import _last from '@lodash/last'
import _map from '@lodash/map'
import _difference from '@lodash/difference'
import _head from '@lodash/head'
import _isEmpty from '@lodash/isEmpty'
import _cloneDeep from '@lodash/cloneDeep'
import _sortBy from '@lodash/sortBy'

import { NotesRecord } from '../../../../RecordUtilities/boardNotes'

import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../../cellTransformers'
import { BoardIterators } from '../../../classes/boardIterators'
import {
    areCommonHouseCells,
    areSameCells,
    getCellsSharingHousesWithCells,
    getCommonNoteInCells,
} from '../../../util'

import { AnalyzedChainResult, CellNumber, exploreChain } from '../chainExplorer'
import { HOUSE_TYPE } from '../../constants'
import { filterNakedGroupEligibleCellsInHouse } from '../../nakedGroup/nakedGroup'
import { NOTES_COUNT_IN_ELIGIBLE_CELLS } from '../remotePairs/remotePairs.constants'
import { cellHasAllPossibleNotes } from '../../validityTest/validity.helpers'
import { LINK_TYPES } from '../xChain/xChain.constants'
import type { Chain } from '../chainExplorer'

import { XYChainRawHint } from './types'
import { getRemovableNotesHostCellsByChain } from '../chainUtils'

type CellsLinks = {
    [cellNumber: string]: {
        [connectingNote: NoteValue]: CellNumber[]
    }
}

type VisitedCells = { [cellNumber: string]: boolean }

type MainNumbersFilledInCells = {
    [cellNumber: CellNumber]: {
        filledNumber: MainNumber,
        parent: CellNumber
    }
    lastNode: CellNumber
}

// COPY: as it is copy from remotepairs implementation
export const getAllValidCellsWithPairs = (mainNumbers: MainNumbers, notes: Notes, possibleNotes: Notes) => {
    const result: Cell[] = []

    BoardIterators.forEachHouseNum(num => {
        const validCells = filterNakedGroupEligibleCellsInHouse(
            { type: HOUSE_TYPE.ROW, num },
            NOTES_COUNT_IN_ELIGIBLE_CELLS,
            mainNumbers,
            notes,
        ).filter(cell => cellHasAllPossibleNotes(cell, notes, possibleNotes))
        result.push(...validCells)
    })
    return result
}

export const getNotesVSHostCellsMap = (cells: Cell[], notes: Notes) => {
    const result: { [note: NoteValue]: CellNumber[] } = {}

    _forEach(cells, (cell: Cell) => {
        const cellNotes = NotesRecord.getCellVisibleNotesList(notes, cell)
        _forEach(cellNotes, (cellNote: NoteValue) => {
            if (_isNil(result[cellNote])) result[cellNote] = []
            result[cellNote].push(convertBoardCellToNum(cell))
        })
    })

    return result
}

export const generateLinkBetweenCells = (_cells: Cell[], notes: Notes) => {
    const result: CellsLinks = {}

    const doneCells: {[cellNumber: string]: boolean} = {}

    const cells = _map(_cells, (cell: Cell) => convertBoardCellToNum(cell))
    _forEach(cells, (startCell: CellNumber) => {
        const eligibleCells = _filter(cells, (cell: CellNumber) => !doneCells[cell] && (startCell !== cell))
            .filter((cell: CellNumber) => areCommonHouseCells(convertBoardCellNumToCell(startCell), convertBoardCellNumToCell(cell)))

        _forEach(eligibleCells, (cell: CellNumber) => {
            const cellsCommonNotes = getCommonNoteInCells(convertBoardCellNumToCell(cell), convertBoardCellNumToCell(startCell), notes)
            _forEach(cellsCommonNotes, (cellsCommonNote: NoteValue) => {
                if (_isNil(result[startCell])) result[startCell] = {}
                if (_isNil(result[cell])) result[cell] = {}
                if (_isNil(result[startCell][cellsCommonNote])) result[startCell][cellsCommonNote] = []
                if (_isNil(result[cell][cellsCommonNote])) result[cell][cellsCommonNote] = []

                result[startCell][cellsCommonNote].push(cell)
                result[cell][cellsCommonNote].push(startCell)
            })
        })
        doneCells[startCell] = true
    })

    return result
}

export const getNewLinksOptions = (
    links: CellsLinks,
    numbersFilledInChainCells: MainNumbersFilledInCells,
    chainSourceCellNum: CellNumber,
    chainSinkCellNum: CellNumber,
) => (chain: Chain) => {
    const chainEndTerminalCell = _last(chain).end
    if (chainEndTerminalCell === chainSinkCellNum) {
        return { newLinkPossibleCells: [] }
    }

    const numberFilledInTerminal = numbersFilledInChainCells[chainEndTerminalCell].filledNumber as unknown as NoteValue
    const result = _map(links[chainEndTerminalCell][numberFilledInTerminal], (cellNumber: CellNumber) => ({
        node: cellNumber,
        type: LINK_TYPES.WEAK,
    }))

    return { newLinkPossibleCells: result }
}

const isNodeAvailableToAdd = (visitedCells: VisitedCells) => (node: CellNumber) => !visitedCells[node]

export const onAddingNewNodeInChain = (
    visitedCells: VisitedCells,
    numbersFilledInChainCells: MainNumbersFilledInCells,
    notes: Notes,
) => (node: CellNumber) => {
    visitedCells[node] = true
    numbersFilledInChainCells[node] = {
        filledNumber: _head(_difference(
            NotesRecord.getCellVisibleNotesList(notes, convertBoardCellNumToCell(node)),
            [numbersFilledInChainCells[numbersFilledInChainCells.lastNode].filledNumber],
        )),
        parent: numbersFilledInChainCells.lastNode,
    }

    numbersFilledInChainCells.lastNode = node
}

const onChainExplorationComplete = (
    chainSinkCellNum: CellNumber,
    commonNoteInChainTerminals: NoteValue,
    numbersFilledInChainCells: MainNumbersFilledInCells,
    notes: Notes,
    allChainsConnectingTerminals: AnalyzedChainResult[],
) => (chain: Chain) => {
    if (numbersFilledInChainCells[chainSinkCellNum]?.filledNumber === (commonNoteInChainTerminals as unknown as MainNumber)) {
        // re-format chain
        const _chain = _cloneDeep(chain)
        _chain.shift()
        _chain[0].isTerminal = true
        _chain[_chain.length - 1].isTerminal = true
        // check if chain really removes notes or not
        // TODO: add checks for valid chains like it's length, it should be a naked tripple etc etc
        const removableNotesHostCells = getRemovableNotesHostCellsByChain(
            commonNoteInChainTerminals,
            _chain,
            notes,
        )

        if (!_isEmpty(removableNotesHostCells)) {
            allChainsConnectingTerminals.push({
                chain: _chain,
                removableNotesHostCells,
            })
        }
    }

    return { foundChain: false, chainResult: null }
}

const onNodeExplorationFail = (
    visitedCells: VisitedCells,
    numbersFilledInChainCells: MainNumbersFilledInCells,
) => (node: CellNumber) => {
    visitedCells[node] = false
    numbersFilledInChainCells.lastNode = numbersFilledInChainCells[node].parent
    delete numbersFilledInChainCells[node]
}

export const chainTerminalsRemoveNotes = (
    terminals: Cell[],
    commonNoteInTerminals: NoteValue,
    notes: Notes,
) => getCellsSharingHousesWithCells(terminals[0], terminals[1])
    .some(cell => {
        const isTerminalCell = areSameCells(cell, terminals[0]) || areSameCells(cell, terminals[1])
        return !isTerminalCell && NotesRecord.isNotePresentInCell(notes, commonNoteInTerminals, cell)
    })

export const getPreferredChainFromValidChains = (validChains: AnalyzedChainResult[]): AnalyzedChainResult => {
    const sortedChains = _sortBy(validChains, [
        (chain: AnalyzedChainResult) => chain.chain.length,
        (chain: AnalyzedChainResult) => chain.removableNotesHostCells.length,
    ])

    const shortestChains = sortedChains.filter((chain: AnalyzedChainResult) => chain.chain.length === sortedChains[0].chain.length)

    return _head(_sortBy(shortestChains, [
        (chain: AnalyzedChainResult) => -chain.removableNotesHostCells.length,
    ]))
}

export const getValidXYChainFromCells = (eligibleCells: Cell[], notes: Notes) :AnalyzedChainResult | null => {
    const notesVSHostCells = getNotesVSHostCellsMap(eligibleCells, notes)
    const cellsLinks = generateLinkBetweenCells(eligibleCells, notes)

    const visitedCells: VisitedCells = {}

    // TODO: break these loops early when chain is found
    // use proper names for loop iterators like i, j, k
    for (let note = 1; note <= 9; note++) {
        const noteHostCells = notesVSHostCells[note]
        if (_isNil(noteHostCells)) continue
        for (let i = 0; i < noteHostCells.length - 1; i++) {
            for (let j = i + 1; j < noteHostCells.length; j++) {
                const firstHostCellNum = noteHostCells[i]
                const secondHostCellNum = noteHostCells[j]

                const firstHostCell = convertBoardCellNumToCell(noteHostCells[i])
                const secondHostCell = convertBoardCellNumToCell(noteHostCells[j])

                const commonNotesInCells = getCommonNoteInCells(firstHostCell, secondHostCell, notes)

                for (let k = 0; k < commonNotesInCells.length; k++) {
                    const commonNoteInCells = commonNotesInCells[k]
                    const possibleChainTerminalsRemovesNotes = chainTerminalsRemoveNotes([firstHostCell, secondHostCell], commonNoteInCells, notes)
                    if (possibleChainTerminalsRemovesNotes) {
                        const _chain = [{
                            start: firstHostCellNum,
                            end: firstHostCellNum,
                            type: LINK_TYPES.STRONG,
                            isTerminal: false,
                        }]

                        visitedCells[firstHostCellNum] = true

                        const numberFilledInCurrentCell = _head(_difference(
                            NotesRecord.getCellVisibleNotesList(notes, firstHostCell),
                            [commonNoteInCells],
                        ))

                        const numbersFilledInChainCells: MainNumbersFilledInCells = {
                            [firstHostCellNum]: { filledNumber: numberFilledInCurrentCell, parent: -1 },
                            lastNode: firstHostCellNum,
                        }

                        const chainsConnectingTerminals: AnalyzedChainResult[] = []
                        exploreChain(
                            _chain,
                            getNewLinksOptions(cellsLinks, numbersFilledInChainCells, firstHostCellNum, secondHostCellNum),
                            isNodeAvailableToAdd(visitedCells),
                            onAddingNewNodeInChain(visitedCells, numbersFilledInChainCells, notes),
                            onChainExplorationComplete(secondHostCellNum, commonNoteInCells, numbersFilledInChainCells, notes, chainsConnectingTerminals),
                            onNodeExplorationFail(visitedCells, numbersFilledInChainCells),
                        )

                        if (!_isEmpty(chainsConnectingTerminals)) {
                            return getPreferredChainFromValidChains(chainsConnectingTerminals)
                        }
                    }
                }
            }
        }
    }

    return null
}

export const getRawXYChainHints = (
    mainNumbers: MainNumbers,
    notes: Notes,
    possibleNotes: Notes,
): XYChainRawHint => {
    const eligibleCells = getAllValidCellsWithPairs(mainNumbers, notes, possibleNotes)
    const chain = getValidXYChainFromCells(eligibleCells, notes)
}
