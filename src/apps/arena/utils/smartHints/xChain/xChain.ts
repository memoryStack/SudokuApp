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

import { N_CHOOSE_K } from '@resources/constants'

import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { BoardIterators } from '../../classes/boardIterators'
import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../cellTransformers'
import { getCellsSharingHousesWithCells, getNoteHostCellsInHouse } from '../../util'
import { MINIMUM_LINKS_IN_CHAIN, LINK_TYPES } from './xChain.constants'
import { XChainRawHint } from './types'

type Link = {
    start: number
    end: number
    type: LINK_TYPES
    isLast: boolean
}

type NoteChain = Link[]

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

type ChainTerminals = {
    first: Link
    last: Link
}

type VisitedCells = { [noteValue: NoteValue]: boolean }

// type Link = {
//     note: NoteValue
//     chain: NoteChain
// }

type ValidSubChainInfo = {
    chain: NoteChain
    removableNotesHostCells: Cell[]
}

type CellLinksParticipants = {
    [cellNum: number]: number[]
}

export const getCandidateAllStrongLinks = (note: NoteValue, notes: Notes, possibleNotes: Notes) => {
    const result: NoteAllStrongLinks = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (isValidStrongLink) {
            // TODO: use lodash util here
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
            // TODO: use lodash util here
            if (!result[house.type]) result[house.type] = {}
            const weakLinksGroups = getWeakLinkPairs(noteUserFilledHostCells)
            if (!_isEmpty(weakLinksGroups)) result[house.type][house.num] = weakLinksGroups
        }
    })

    return result
}

// TODO: remove it if not needed anywhere
export const getAllStrongLinks = (notes: Notes, possibleNotes: Notes) => {
    const result: { [note: NoteValue]: NoteAllStrongLinks } = {}

    BoardIterators.forCellEachNote(note => {
        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        if (!_isEmpty(strongLinks)) {
            result[note] = strongLinks
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

const getChainEdgeLinks = (chain: NoteChain): ChainTerminals => ({
    first: _head(chain) as typeof chain[0],
    last: _last(chain) as typeof chain[0],
})

export const getTrimWeakLinksFromEdges = (_chain: NoteChain) => {
    let chain = _cloneDeep(_chain)

    const { first: firstEntry, last: lastEntry } = getChainEdgeLinks(chain)

    if (firstEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 1)
    if (lastEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 0, chain.length - 1)

    return markEdgeLinksAsLastForValidChain(chain)
}

const switchAllStrongLinksChainLinks = (chain: NoteChain): NoteChain => _map(chain, (link: Link, index: number) => {
    if (index % 2) {
        return {
            ...link,
            type: LINK_TYPES.WEAK,
        }
    }
    return link
})

const switchMixedLinksChainLinks = (chain: NoteChain): NoteChain => {
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

export const alternateChainLinks = (chain: NoteChain) => {
    if (chainHasAllStrongLinks(chain)) return switchAllStrongLinksChainLinks(chain)
    return switchMixedLinksChainLinks(chain)
}

export const getCellsFromChain = (chain: NoteChain) => {
    const result = _map(chain, (link: Link) => link.start)
    result.push(getChainEdgeLinks(chain).last.end)
    return result
}

export const getRemovableNotesHostCellsByChain = (note: NoteValue, chain: NoteChain, notes: Notes) => {
    const chainCells = getCellsFromChain(chain)
    const { first, last } = getChainEdgeLinks(chain)
    const chainFirstCell = convertBoardCellNumToCell(first.start)
    const chainLastCell = convertBoardCellNumToCell(last.end)
    return getCellsSharingHousesWithCells(chainFirstCell, chainLastCell)
        .filter(cell => !_includes(chainCells, convertBoardCellToNum(cell)))
        .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell))
}

const markEdgeLinksAsLastForValidChain = (_chain: NoteChain) => {
    if (_isEmpty(_chain)) return _chain

    const chain: NoteChain = _cloneDeep(_chain)
    const { first, last } = getChainEdgeLinks(chain)
    first.isLast = true
    last.isLast = true
    return chain
}

const chainHasStrongEdgeLinks = (chain: NoteChain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.STRONG && last.type === LINK_TYPES.STRONG
}

const chainHasAnyWeakEdgeLink = (chain: NoteChain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.WEAK || last.type === LINK_TYPES.WEAK
}

export const getAllValidSubChains = (note: NoteValue, chain: NoteChain, notes: Notes) => {
    const result: ValidSubChainInfo[] = []

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
export const getChosenChainFromValidSubChains = (subChains: ValidSubChainInfo[]): ValidSubChainInfo | [] => {
    if (_isEmpty(subChains)) return []

    const orderedSubChains = subChains.sort((subChainA, subChainB) => {
        if (subChainA.chain.length !== subChainB.chain.length) {
            return subChainA.chain.length - subChainB.chain.length
        }
        return subChainB.removableNotesHostCells.length - subChainA.removableNotesHostCells.length
    })

    return _get(orderedSubChains, '[0]')
}

const chainHasAllStrongLinks = (chain: NoteChain): boolean => _every(chain, (link: Link) => link.type === LINK_TYPES.STRONG)

// TODO: chainge it's contract for chain, currently it's chain.chain
export const analyzeChain = (note: NoteValue, _chain: NoteChain, notes: Notes) => {
    const chain = getTrimWeakLinksFromEdges(_cloneDeep(_chain))
    if (chain.length < MINIMUM_LINKS_IN_CHAIN) return { foundChain: false, chain: [] }

    const validSubChains = getAllValidSubChains(note, chain, notes)
    const chosenChain = getChosenChainFromValidSubChains(validSubChains)
    const foundChain = !_isEmpty(chosenChain)

    return {
        foundChain,
        chain: foundChain ? chosenChain : [],
    }
}

const isChainExplorationComplete = (chain: NoteChain) => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.isLast && last.isLast
}

const getNewLinkPossibleCells = (
    chain: NoteChain,
    strongLinkParticipantCells: CellLinksParticipants,
    weakLinkParticipantCells: CellLinksParticipants,
) => {
    const { first, last } = getChainEdgeLinks(chain)
    const newLinkConnectingCellInChain = last.isLast ? first.start : last.end
    const newStrongLinkCells = strongLinkParticipantCells[newLinkConnectingCellInChain] || []
    const newWeakLinkCells = weakLinkParticipantCells[newLinkConnectingCellInChain] || []

    const newLinkConnectingLinkInChain = last.isLast ? first : last
    const newLinkPossibleCells = newLinkConnectingLinkInChain.type === LINK_TYPES.STRONG
        ? [...newStrongLinkCells, ...newWeakLinkCells]
        : newStrongLinkCells

    return {
        connectingCellInChain: newLinkConnectingCellInChain,
        newLinkPossibleCells,
    }
}

const exploreChain = (
    note: NoteValue,
    chain: NoteChain,
    strongLinkParticipantCells: CellLinksParticipants,
    weakLinkParticipantCells: CellLinksParticipants,
    notes: Notes,
    visitedCells: VisitedCells,
): ValidSubChainInfo | null => {
    // first explore links on right side, then explore from left side

    const { first: chainFirstLink, last: chainLastLink } = getChainEdgeLinks(chain)

    if (!isChainExplorationComplete(chain)) {
        const isExtendingFromEnd = !chainLastLink.isLast

        const {
            newLinkPossibleCells,
            connectingCellInChain,
        } = getNewLinkPossibleCells(chain, strongLinkParticipantCells, weakLinkParticipantCells)

        let chainProgressed = false
        for (let i = 0; i < newLinkPossibleCells.length; i++) {
            const newLinkCell = newLinkPossibleCells[i]
            if (visitedCells[newLinkCell]) continue

            visitedCells[newLinkCell] = true
            chainProgressed = true

            const newLinkPositionInChain = isExtendingFromEnd ? chain.length : 0
            const chainWithNewLink = [...chain]
            // no util found for splice in lodash, use this one only for now
            chainWithNewLink.splice(newLinkPositionInChain, 0, {
                start: isExtendingFromEnd ? connectingCellInChain : newLinkCell,
                end: isExtendingFromEnd ? newLinkCell : connectingCellInChain,
                type: _includes(strongLinkParticipantCells[connectingCellInChain], newLinkCell)
                    ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
                isLast: false,
            })

            const chainInfo = exploreChain(
                note,
                chainWithNewLink,
                strongLinkParticipantCells,
                weakLinkParticipantCells,
                notes,
                visitedCells,
            )
            if (!_isNil(chainInfo)) return chainInfo
            visitedCells[newLinkCell] = false
        }

        if (!chainProgressed) {
            if (isExtendingFromEnd) {
                chainLastLink.isLast = true
                const chainInfo = exploreChain(
                    note,
                    chain,
                    strongLinkParticipantCells,
                    weakLinkParticipantCells,
                    notes,
                    visitedCells,
                )
                if (!_isNil(chainInfo)) return chainInfo
            } else {
                chainFirstLink.isLast = true
            }
        }
    }

    if (isChainExplorationComplete(chain)) {
        const { foundChain, chain: validChain } = analyzeChain(note, chain, notes)
        return foundChain ? validChain as ValidSubChainInfo : null
    }

    return null
}

const getNoteChain = (
    note: NoteValue,
    strongLinks: NoteAllStrongLinks,
    weakLinks: NoteAllWeakLinks,
    notes: Notes,
): ValidSubChainInfo | null => {
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

        const _chain = [{
            start: unvisitedLink[0],
            end: unvisitedLink[1],
            type: LINK_TYPES.STRONG,
            isLast: false,
        }]

        visitedCells[unvisitedLink[0]] = true
        visitedCells[unvisitedLink[1]] = true

        const exploredChainResult = exploreChain(
            note,
            _chain,
            strongLinkParticipantCells,
            weakLinkParticipantCells,
            notes,
            visitedCells,
        )

        if (!_isNil(exploredChainResult)) {
            return exploredChainResult
        }
    }

    return null
}

const getChainCellsFromChain = (chain: NoteChain) => {
    const result: Cell[] = []

    _forEach(chain, ({ start: startCellNum, end: endCellNum, isLast }: Link, indx: number) => {
        result.push(convertBoardCellNumToCell(startCellNum))
        if (indx && isLast) {
            result.push(convertBoardCellNumToCell(endCellNum))
        }
    })

    return result
}

export const getRawXChainHints = (mainNumbers: MainNumbers, notes: Notes, possibleNotes: Notes): XChainRawHint[] => {
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
