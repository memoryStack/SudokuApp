import _isEmpty from '@lodash/isEmpty'
import _map from '@lodash/map'
import _at from '@lodash/at'
import _cloneDeep from '@lodash/cloneDeep'
import _reverse from '@lodash/reverse'
import _forEach from '@lodash/forEach'
import _flatten from '@lodash/flatten'
import _values from '@lodash/values'
import _keys from '@lodash/keys'
import _find from '@lodash/find'
import _get from '@lodash/get'
import _every from '@lodash/every'
import _unique from '@lodash/unique'
import _findIndex from '@lodash/findIndex'
import _slice from '@lodash/slice'
import _isNil from '@lodash/isNil'
import _concat from '@lodash/concat'

import { N_CHOOSE_K } from '@resources/constants'

import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { BoardIterators } from '../../../classes/boardIterators'
import { convertBoardCellToNum } from '../../../cellTransformers'
import {
    areSameCells, getCellsSharingHousesWithCells, getNoteHostCellsInHouse, isCellExists,
} from '../../../util'
import { MINIMUM_LINKS_IN_CHAIN, LINK_TYPES } from './xChain.constants'
import { XChainRawHint } from './types'
import {
    CellNumber, exploreChain, NewLinkPossibleCells, OnChainExplorationComplete,
} from '../chainExplorer'
import { getChainCells, getChainEdgeLinks, getRemovableNotesHostCellsByChain } from '../chainUtils'

import type {
    Link, Chain, AnalyzedChainResult,
} from '../chainExplorer'

// TODO: these types mostly will be common among all the chain hints
type LinkCells = [Cell, Cell]

type NoteAllStrongLinks = {
    [houseType: HouseType]: {
        // TODO: figure out a way to show a tuple here instead of Cell[]
        // because strong links will have two entries only
        [houseNum: HouseNum]: LinkCells
    }
}

type NoteAllWeakLinks = {
    [houseType: HouseType]: {
        // TODO: figure out a way to show a tuple here instead of Cell[]
        // because strong links will have two entries only
        [houseNum: HouseNum]: LinkCells[]
    }
}

type VisitedCells = { [cellNumber: CellNumber]: boolean }

type CellLinksParticipants = {
    [cellNumber: CellNumber]: CellNumber[]
}

export const getCandidateAllStrongLinks = (
    note: NoteValue,
    notes: Notes,
    possibleNotes: Notes,
) => {
    const result: LinkCells[] = []

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (isValidStrongLink) {
            result.push(noteUserFilledHostCells as LinkCells)
        }
    })

    return result
}

// TODO: check if N_C_K can fail or not here
const getWeakLinkPairs = (hostCells: Cell[]) => {
    const combinations = N_CHOOSE_K[hostCells.length][2]
    return _map(combinations, (combination: number[]) => _at(hostCells, _reverse(_cloneDeep(combination))))
}

export const getNoteWeakLinks = (note: NoteValue, notes: Notes, possibleNotes: Notes) => {
    const result: LinkCells[] = []

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (!isValidStrongLink && noteUserFilledHostCells.length > 1) {
            const weakLinksGroups = getWeakLinkPairs(noteUserFilledHostCells)
            result.push(...weakLinksGroups)
        }
    })

    return result
}

const addCellsPairsLinks = (linksCellsPairs: LinkCells[], result: CellLinksParticipants) => {
    _forEach(linksCellsPairs, ([cellA, cellB]: LinkCells) => {
        const cellANum = convertBoardCellToNum(cellA)
        const cellBNum = convertBoardCellToNum(cellB)
        if (!result[cellANum]) result[cellANum] = [cellBNum]
        else result[cellANum].push(cellBNum)
        if (!result[cellBNum]) result[cellBNum] = [cellANum]
        else result[cellBNum].push(cellANum)
    })
}

export const removeRedundantLinks = (links: CellLinksParticipants) => {
    const linksStartCell = _keys(links)

    _forEach(linksStartCell, (linkStartCell: NoteValue) => {
        links[linkStartCell] = _unique(links[linkStartCell])
    })
}

const getNoteStrongLinkCellsParticipants = (noteStrongLinks: LinkCells[]) => {
    const result: CellLinksParticipants = {}

    _forEach(noteStrongLinks, (strongLinksCellsPairs: LinkCells) => {
        addCellsPairsLinks([strongLinksCellsPairs], result)
    })
    removeRedundantLinks(result)

    return result
}

const getNoteWeakLinkCellsParticipants = (noteWeakLinks: LinkCells[]) => {
    const result: CellLinksParticipants = {}

    _forEach(noteWeakLinks, (weakLink: LinkCells) => {
        addCellsPairsLinks([weakLink], result)
    })
    removeRedundantLinks(result)

    return result
}

export const getTrimWeakLinksFromEdges = (_chain: Chain) => {
    let chain = _cloneDeep(_chain)

    const { first: firstEntry, last: lastEntry } = getChainEdgeLinks(chain)

    if (firstEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 1)
    if (lastEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 0, chain.length - 1)

    return markEdgeLinksAsLastForValidChain(chain)
}

const switchAllStrongLinksChainLinks = (chain: Chain): Chain => _map(chain, (link: Link, index: number) => {
    if (index % 2) {
        return {
            ...link,
            type: LINK_TYPES.WEAK,
        }
    }
    return link
})

const switchMixedLinksChainLinks = (chain: Chain): Chain => {
    const firstWeakLinkIndex = _findIndex(chain, (link: Link) => link.type === LINK_TYPES.WEAK)
    return _map(chain, (link: Link, index: number) => {
        const gap = Math.abs(firstWeakLinkIndex - index)
        if (gap % 2 === 0) {
            return {
                ...link,
                type: LINK_TYPES.WEAK,
            }
        }
        return link
    })
}

export const alternateChainLinks = (chain: Chain) => {
    if (chainHasAllStrongLinks(chain)) return switchAllStrongLinksChainLinks(chain)
    return switchMixedLinksChainLinks(chain)
}

const markEdgeLinksAsLastForValidChain = (_chain: Chain) => {
    if (_isEmpty(_chain)) return _chain

    const chain: Chain = _cloneDeep(_chain)
    const { first, last } = getChainEdgeLinks(chain)
    first.isTerminal = true
    last.isTerminal = true
    return chain
}

const chainHasStrongEdgeLinks = (chain: Chain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.STRONG && last.type === LINK_TYPES.STRONG
}

const chainHasAnyWeakEdgeLink = (chain: Chain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.WEAK || last.type === LINK_TYPES.WEAK
}

export const getAllValidSubChains = (note: NoteValue, chain: Chain, notes: Notes) => {
    const result: AnalyzedChainResult[] = []

    let subChainLen = MINIMUM_LINKS_IN_CHAIN
    let subChainsCount = chain.length - subChainLen + 1
    while (subChainsCount > 0) {
        for (let i = 0; i <= chain.length - subChainLen; i++) {
            const subChain = _slice(chain, i, i + subChainLen)
            if (!chainHasStrongEdgeLinks(subChain)) continue
            const chainWithLinksSwitched = alternateChainLinks(subChain)
            if (chainHasAnyWeakEdgeLink(chainWithLinksSwitched)) continue

            const removableNotesHostCells = getRemovableNotesHostCellsByChain(note, chainWithLinksSwitched, notes)
            if (!_isEmpty(removableNotesHostCells)) {
                result.push({
                    chain: markEdgeLinksAsLastForValidChain(chainWithLinksSwitched),
                    removableNotesHostCells,
                })
            }
        }
        subChainLen += 2 // chain length will always be odd
        subChainsCount = chain.length - subChainLen + 1
    }

    return result
}

// TODO: change it's contract
export const getChosenChainFromValidSubChains = (subChains: AnalyzedChainResult[]): AnalyzedChainResult | [] => {
    if (_isEmpty(subChains)) return []

    const orderedSubChains = subChains.sort((subChainA, subChainB) => {
        if (subChainA.chain.length !== subChainB.chain.length) {
            return subChainA.chain.length - subChainB.chain.length
        }
        return subChainB.removableNotesHostCells.length - subChainA.removableNotesHostCells.length
    })

    return _get(orderedSubChains, '[0]')
}

const chainHasAllStrongLinks = (chain: Chain): boolean => _every(chain, (link: Link) => link.type === LINK_TYPES.STRONG)

export const analyzeChain = (note: NoteValue, _chain: Chain, notes: Notes): ReturnType<OnChainExplorationComplete> => {
    const chain = getTrimWeakLinksFromEdges(_cloneDeep(_chain))
    if (chain.length < MINIMUM_LINKS_IN_CHAIN) return { foundChain: false, chainResult: null }

    const validSubChains = getAllValidSubChains(note, chain, notes)
    const chosenChain = getChosenChainFromValidSubChains(validSubChains)
    const foundChain = !_isEmpty(chosenChain)

    return {
        foundChain,
        chainResult: foundChain ? (chosenChain as AnalyzedChainResult) : null,
    }
}

const getNewLinksOptions = (
    strongLinkParticipantCells: CellLinksParticipants,
    weakLinkParticipantCells: CellLinksParticipants,
    chainSourceCellNum: CellNumber,
    chainSinkCellNum: CellNumber,
) => (chain: Chain, exploringFromChainEnd: boolean) => {
    const { last } = getChainEdgeLinks(chain)
    const newLinkConnectingCellInChain = last.end

    if (newLinkConnectingCellInChain === chainSinkCellNum) {
        return { newLinkPossibleCells: [] }
    }

    const newStrongLinkCells = strongLinkParticipantCells[newLinkConnectingCellInChain] || []
    const newWeakLinkCells = weakLinkParticipantCells[newLinkConnectingCellInChain] || []

    let result: NewLinkPossibleCells[] = _map(newStrongLinkCells, (newStrongLinkNode: number) => ({
        node: newStrongLinkNode,
        type: LINK_TYPES.STRONG,
    }))

    if (chain.length % 2) {
        const newWeakLinks = _map(newWeakLinkCells, (newWeakLinkNode: number) => ({
            node: newWeakLinkNode,
            type: LINK_TYPES.WEAK,
        }))
        result = _concat(result, newWeakLinks)
    }

    return {
        newLinkPossibleCells: result,
    }
}

const isNodeAvailableToAddInChain = (
    visitedCells: VisitedCells,
    removableNotesHostCells: Cell[],
) => {
    const removableCells: {[cellNumber: number]: boolean} = {}
    _forEach(removableNotesHostCells, (cell: Cell) => {
        removableCells[convertBoardCellToNum(cell)] = true
    })
    return (node: number) => !visitedCells[node] && !removableCells[node]
}

const onAddingNewNodeInChain = (visitedCells: VisitedCells) => (node: number) => {
    visitedCells[node] = true
}

const onNodeExplorationFail = (visitedCells: VisitedCells) => (node: number) => {
    visitedCells[node] = false
}

const onChainExplorationComplete = (
    note: NoteValue,
    notes: Notes,
    removableNotesHostCells: Cell[],
    firstLinkEndPoint: CellNumber,
    lastLinkEndPoint: CellNumber,
    endCell: CellNumber,
) => (chain: Chain) => {
    const { first, last } = getChainEdgeLinks(chain)
    if (last.end === endCell && (chain.length % 2 === 0)) {
        const finalChain = _cloneDeep(chain)
        finalChain.push({
            start: last.end,
            end: lastLinkEndPoint,
            type: LINK_TYPES.STRONG,
            isTerminal: true,
        })

        finalChain[0] = {
            ...finalChain[0],
            start: firstLinkEndPoint,
        }

        return {
            foundChain: true,
            chainResult: {
                chain: finalChain,
                removableNotesHostCells,
            },
        }
    }
    return { foundChain: false, chainResult: null }
}

export const getStrongLinksList = (strongLinks: NoteAllStrongLinks) => {
    const result: LinkCells[] = []

    const houses = Object.keys(strongLinks)

    houses.forEach(houseType => {
        const houseTypeStrongLinks = Object.values(strongLinks[houseType])
        result.push(...houseTypeStrongLinks)
    })

    return result
}

export const linksPairsHaveSufficientCells = (firstLink: LinkCells, secondLink: LinkCells) => {
    const cells = {}
    const allCells = [...firstLink, ...secondLink]
    allCells.forEach(cell => {
        cells[convertBoardCellToNum(cell)] = true
    })
    return Object.keys(cells).length === 4
}

const getHostCellsWithNoteInCellsCommonHouse = (note: NoteValue, cellA: Cell, cellB: Cell, notes: Notes) => getCellsSharingHousesWithCells(cellA, cellB)
    .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell)).filter(cell => !isCellExists(cell, [cellA, cellB]))

const weakLinksParticipantsCellsHandler = (note: NoteValue, notes: Notes, possibleNotes: Notes) => {
    let weakLinksParticipantCells: CellLinksParticipants = {}
    return () => {
        if (_isEmpty(weakLinksParticipantCells)) {
            const weakLinks = getNoteWeakLinks(note, notes, possibleNotes)
            weakLinksParticipantCells = getNoteWeakLinkCellsParticipants(weakLinks)
        }
        return weakLinksParticipantCells
    }
}

const getNoteChain = (
    note: NoteValue,
    notes: Notes,
    possibleNotes: Notes,
): AnalyzedChainResult | null => {
    const strongLinksList = getCandidateAllStrongLinks(note, notes, possibleNotes)
    const strongLinkParticipantCells = getNoteStrongLinkCellsParticipants(strongLinksList)

    const getWeakLinksParticipantCells = weakLinksParticipantsCellsHandler(note, notes, possibleNotes)

    const visitedCells: VisitedCells = {}

    for (let i = 0; i < strongLinksList.length; i++) {
        for (let j = 1; j < strongLinksList.length; j++) {
            const firstLink = strongLinksList[i]
            const secondLink = strongLinksList[j]
            if (linksPairsHaveSufficientCells(firstLink, secondLink)) {
                for (let k = 0; k < firstLink.length; k++) {
                    for (let l = 0; l < secondLink.length; l++) {
                        const firstLinkCell = firstLink[k]
                        const secondLinkCell = secondLink[l]
                        const sourceCell = firstLink[1 - k]
                        const endCell = secondLink[1 - l]

                        const firstLinkCellNum = convertBoardCellToNum(firstLinkCell)
                        const secondLinkCellNum = convertBoardCellToNum(secondLinkCell)
                        const sourceCellNum = convertBoardCellToNum(sourceCell)
                        const endCellNum = convertBoardCellToNum(endCell)

                        const removableNotesHostCells = getHostCellsWithNoteInCellsCommonHouse(note, firstLinkCell, secondLinkCell, notes)
                            .filter(cell => !(areSameCells(cell, sourceCell) || areSameCells(cell, endCell)))
                        if (!_isEmpty(removableNotesHostCells)) {
                            const _chain = [{
                                start: sourceCellNum,
                                end: sourceCellNum,
                                type: LINK_TYPES.STRONG,
                                isTerminal: false,
                            }]

                            visitedCells[sourceCellNum] = true
                            visitedCells[firstLinkCellNum] = true
                            visitedCells[secondLinkCellNum] = true

                            const weakLinkParticipantCells = getWeakLinksParticipantCells()

                            const exploredChainResult = exploreChain(
                                _chain,
                                getNewLinksOptions(strongLinkParticipantCells, weakLinkParticipantCells, sourceCellNum, endCellNum),
                                isNodeAvailableToAddInChain(visitedCells, removableNotesHostCells),
                                onAddingNewNodeInChain(visitedCells),
                                onChainExplorationComplete(note, notes, removableNotesHostCells, firstLinkCellNum, secondLinkCellNum, endCellNum),
                                onNodeExplorationFail(visitedCells),
                            )

                            if (!_isNil(exploredChainResult)) {
                                return exploredChainResult
                            }

                            visitedCells[sourceCellNum] = false
                            visitedCells[firstLinkCellNum] = false
                            visitedCells[secondLinkCellNum] = false
                        }
                    }
                }
            }
        }
    }

    return null
}

export const getRawXChainHints = (
    _: MainNumbers,
    notes: Notes,
    possibleNotes: Notes,
): XChainRawHint[] | [] => {
    let result = {} as XChainRawHint

    // TODO: add early break support for these iterators
    BoardIterators.forCellEachNote(note => {
        if (!_isEmpty(result)) return
        const chain = getNoteChain(note, notes, possibleNotes)
        if (!_isNil(chain)) {
            result = {
                note,
                removableNotesHostCells: chain!.removableNotesHostCells,
                chain: getChainCells(chain!.chain),
            }
        }
    })

    return !_isEmpty(result) ? [result] : []
}
