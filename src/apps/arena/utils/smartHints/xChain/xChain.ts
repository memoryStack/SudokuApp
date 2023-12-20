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
import _includes from '@lodash/includes'
import _get from '@lodash/get'
import _every from '@lodash/every'
import _unique from '@lodash/unique'
import _findIndex from '@lodash/findIndex'
import _head from '@lodash/head'
import _last from '@lodash/last'
import _slice from '@lodash/slice'
import _isNil from '@lodash/isNil'
import _concat from '@lodash/concat'

import { N_CHOOSE_K } from '@resources/constants'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { BoardIterators } from '../../classes/boardIterators'
import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../cellTransformers'
import { getCellsSharingHousesWithCells, getNoteHostCellsInHouse } from '../../util'
import { MINIMUM_LINKS_IN_CHAIN, LINK_TYPES } from './xChain.constants'
import { XChainRawHint } from './types'
import {
    CellNumber, exploreChain, NewLinkPossibleCells, OnChainExplorationComplete,
} from '../chainExplorer'

import type {
    Link, ChainTerminals, Chain, AnalyzedChainResult,
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
    const result: NoteAllStrongLinks = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (isValidStrongLink) {
            if (_isNil(result[house.type])) result[house.type] = {}
            result[house.type][house.num] = noteUserFilledHostCells as LinkCells
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
    const result: NoteAllWeakLinks = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (!isValidStrongLink && noteUserFilledHostCells.length > 1) {
            if (_isNil(result[house.type])) result[house.type] = {}
            const weakLinksGroups = getWeakLinkPairs(noteUserFilledHostCells)
            if (!_isEmpty(weakLinksGroups)) result[house.type][house.num] = weakLinksGroups
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

const getNoteStrongLinkCellsParticipants = (noteStrongLinks: NoteAllStrongLinks) => {
    const result: CellLinksParticipants = {}

    const strongLinkHostHousesType: HouseType[] = _keys(noteStrongLinks)
    _forEach(strongLinkHostHousesType, (houseType: HouseType) => {
        const strongLinksCellsPairs = _values(noteStrongLinks[houseType])
        addCellsPairsLinks(strongLinksCellsPairs, result)
    })
    removeRedundantLinks(result)

    return result
}

const getNoteWeakLinkCellsParticipants = (noteWeakLinks: NoteAllWeakLinks) => {
    const result: CellLinksParticipants = {}

    const weakLinkHostHousesType: HouseType[] = _keys(noteWeakLinks)
    _forEach(weakLinkHostHousesType, (houseType: HouseType) => {
        const weakLinksCellsPairs = _flatten(_values(noteWeakLinks[houseType]))
        addCellsPairsLinks(weakLinksCellsPairs, result)
    })
    removeRedundantLinks(result)

    return result
}

const getChainEdgeLinks = (chain: Chain): ChainTerminals => ({
    first: _head(chain) as typeof chain[0],
    last: _last(chain) as typeof chain[0],
})

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

export const getCellsFromChain = (chain: Chain) => {
    const result = _map(chain, (link: Link) => link.start)
    result.push(getChainEdgeLinks(chain).last.end)
    return result
}

// TODO: how to use this for all the chains
export const getRemovableNotesHostCellsByChain = (note: NoteValue, chain: Chain, notes: Notes) => {
    const chainCells = getCellsFromChain(chain)
    const { first, last } = getChainEdgeLinks(chain)
    const chainFirstCell = convertBoardCellNumToCell(first.start)
    const chainLastCell = convertBoardCellNumToCell(last.end)
    return getCellsSharingHousesWithCells(chainFirstCell, chainLastCell)
        .filter(cell => !_includes(chainCells, convertBoardCellToNum(cell)))
        .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell))
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
) => (chain : Chain, exploringFromChainEnd: boolean) => {
    const { first, last } = getChainEdgeLinks(chain)
    const newLinkConnectingCellInChain = exploringFromChainEnd ? last.end : first.start
    const newStrongLinkCells = strongLinkParticipantCells[newLinkConnectingCellInChain] || []
    const newWeakLinkCells = weakLinkParticipantCells[newLinkConnectingCellInChain] || []

    let result: NewLinkPossibleCells[] = _map(newStrongLinkCells, (newStrongLinkNode: number) => ({
        node: newStrongLinkNode,
        type: LINK_TYPES.STRONG,
    }))

    const newLinkConnectingLinkInChain = exploringFromChainEnd ? last : first
    if (newLinkConnectingLinkInChain.type === LINK_TYPES.STRONG) {
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

const isNodeAvailableToAddInChain = (visitedCells: VisitedCells) => (node: number) => !visitedCells[node]

const onAddingNewNodeInChain = (visitedCells: VisitedCells) => (node: number) => {
    visitedCells[node] = true
}

const onNodeExplorationFail = (visitedCells: VisitedCells) => (node: number) => {
    visitedCells[node] = false
}

const onChainExplorationComplete = (note: NoteValue, notes: Notes) => (chain: Chain) => analyzeChain(note, chain, notes)

const getNoteChain = (
    note: NoteValue,
    strongLinks: NoteAllStrongLinks,
    weakLinks: NoteAllWeakLinks,
    notes: Notes,
): AnalyzedChainResult | null => {
    const strongLinkParticipantCells = getNoteStrongLinkCellsParticipants(strongLinks)
    const weakLinkParticipantCells = getNoteWeakLinkCellsParticipants(weakLinks)

    const visitedCells: VisitedCells = {}

    const pickedStrongLinks = {} as VisitedCells
    const getUnvisitedStrongLink = () => {
        const strongLinkCellsNums = _keys(strongLinkParticipantCells)

        for (let i = 0; i < strongLinkCellsNums.length; i++) {
            const cellA = strongLinkCellsNums[i]
            const cellB = _find(strongLinkParticipantCells[cellA], (cell: number) => !pickedStrongLinks[cellA] && !pickedStrongLinks[cell])
            if (cellB) { return [parseInt(cellA, 10), parseInt(cellB, 10)] }
        }

        return []
    }

    const foundChain = false
    while (!foundChain) {
        // capture this DS is test-cases for the ease of understanding
        // unvisitedLink -> ['81', '12']
        const unvisitedLink = getUnvisitedStrongLink()
        if (_isEmpty(unvisitedLink)) return null

        pickedStrongLinks[unvisitedLink[0]] = true
        pickedStrongLinks[unvisitedLink[1]] = true

        // link in chain
        const _chain = [{
            start: unvisitedLink[0],
            end: unvisitedLink[1],
            type: LINK_TYPES.STRONG,
            isTerminal: false,
        }]

        visitedCells[unvisitedLink[0]] = true
        visitedCells[unvisitedLink[1]] = true

        const exploredChainResult = exploreChain(
            _chain,
            getNewLinksOptions(strongLinkParticipantCells, weakLinkParticipantCells),
            isNodeAvailableToAddInChain(visitedCells),
            onAddingNewNodeInChain(visitedCells),
            onChainExplorationComplete(note, notes),
            onNodeExplorationFail(visitedCells),
        )

        if (!_isNil(exploredChainResult)) {
            return exploredChainResult
        }
    }

    return null
}

const getChainCellsFromChain = (chain: Chain) => {
    const result: Cell[] = []

    _forEach(chain, ({ start: startCellNum, end: endCellNum, isTerminal }: Link, indx: number) => {
        result.push(convertBoardCellNumToCell(startCellNum))
        if (indx && isTerminal) {
            result.push(convertBoardCellNumToCell(endCellNum))
        }
    })

    return result
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

        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        const weakLinks = getNoteWeakLinks(note, notes, possibleNotes)
        const chain = getNoteChain(note, strongLinks, weakLinks, notes)

        if (!_isNil(chain)) {
            result = {
                note,
                removableNotesHostCells: chain!.removableNotesHostCells,
                chain: getChainCellsFromChain(chain!.chain),
            }
        }
    })

    return !_isEmpty(result) ? [result] : []
}
