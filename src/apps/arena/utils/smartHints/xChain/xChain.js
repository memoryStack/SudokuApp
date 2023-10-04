import _isNil from '@lodash/isNil'
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

import { N_CHOOSE_K } from '@resources/constants'
import { NotesRecord } from '../../../RecordUtilities/boardNotes'
import { BoardIterators } from '../../classes/boardIterators'
import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../cellTransformers'
import { getCellsSharingHousesWithCells } from '../../util'
import { MINIMUM_LINKS_IN_CHAIN } from './xChain.constants'

const LINK_TYPES = {
    STRONG: 'STRONG',
    WEAK: 'WEAK',
}

export const getNoteHostCellsInHouse = (note, house, notes) => {
    const result = []
    BoardIterators.forHouseEachCell(house, cell => {
        if (NotesRecord.isNotePresentInCell(notes, note, cell)) {
            result.push(cell)
        }
    })
    return result
}

export const getCandidateAllStrongLinks = (note, notes, possibleNotes) => {
    const result = {}

    BoardIterators.forEachHouse(house => {
        const noteUserFilledHostCells = getNoteHostCellsInHouse(note, house, notes)
        const noteAllPossibleHostCells = getNoteHostCellsInHouse(note, house, possibleNotes)
        const isValidStrongLink = noteUserFilledHostCells.length === noteAllPossibleHostCells.length && noteUserFilledHostCells.length === 2
        if (isValidStrongLink) {
            // TODO: use lodash util here
            if (!result[house.type]) result[house.type] = {}
            result[house.type][house.num] = noteUserFilledHostCells
        }
    })

    return result
}

const getWeakLinkPairs = hostCells => {
    const combinations = N_CHOOSE_K[hostCells.length][2]
    return _map(combinations, combination => _at(hostCells, _reverse(_cloneDeep(combination))))
}

export const getNoteWeakLinks = (note, notes, possibleNotes) => {
    const result = {}

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

export const getAllStrongLinks = (notes, possibleNotes) => {
    const result = {}

    BoardIterators.forCellEachNote(note => {
        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        if (!_isEmpty(strongLinks)) {
            result[note] = strongLinks
        }
    })

    return result
}

const addCellsPairsLinks = (linksCellsPairs, result) => {
    _forEach(linksCellsPairs, ([cellA, cellB]) => {
        const cellANum = convertBoardCellToNum(cellA)
        const cellBNum = convertBoardCellToNum(cellB)
        if (!result[cellANum]) result[cellANum] = [cellBNum]
        else result[cellANum].push(cellBNum)
        if (!result[cellBNum]) result[cellBNum] = [cellANum]
        else result[cellBNum].push(cellANum)
    })
}

export const removeRedundantLinks = links => {
    const linksStartCell = _keys(links)

    _forEach(linksStartCell, linkStartCell => {
        links[linkStartCell] = _unique(links[linkStartCell])
    })
}

export const getNoteStrongLinkCellsParticipants = noteStrongLinks => {
    const result = {}

    const strongLinkHostHousesType = _keys(noteStrongLinks)
    _forEach(strongLinkHostHousesType, houseType => {
        const strongLinksCellsPairs = _values(noteStrongLinks[houseType])
        addCellsPairsLinks(strongLinksCellsPairs, result)
    })
    removeRedundantLinks(result)

    return result
}

export const getNoteWeakLinkCellsParticipants = noteWeakLinks => {
    const result = {}

    const weakLinkHostHousesType = _keys(noteWeakLinks)
    _forEach(weakLinkHostHousesType, houseType => {
        const weakLinksCellsPairs = _flatten(_values(noteWeakLinks[houseType]))
        addCellsPairsLinks(weakLinksCellsPairs, result)
    })
    removeRedundantLinks(result)

    return result
}

const getChainEdgeLinks = chain => ({
    first: _head(chain),
    last: _last(chain),
})

export const getTrimWeakLinksFromEdges = _chain => {
    let chain = _cloneDeep(_chain)

    const { first: firstEntry, last: lastEntry } = getChainEdgeLinks(chain)

    if (firstEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 1)
    if (lastEntry.type === LINK_TYPES.WEAK) chain = _slice(chain, 0, chain.length - 1)

    return markEdgeLinksAsLastForValidChain(chain)
}

const switchAllStrongLinksChainLinks = chain => _map(chain, (link, index) => {
    if (index % 2) {
        return {
            ...link,
            type: LINK_TYPES.WEAK,
        }
    }
    return link
})

const switchMixedLinksChainLinks = chain => {
    const firstWeakLinkIndex = _findIndex(chain, link => link.type === LINK_TYPES.WEAK)
    return _map(chain, (link, index) => {
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

export const alternateChainLinks = chain => {
    if (chainHasAllStrongLinks(chain)) return switchAllStrongLinksChainLinks(chain)
    return switchMixedLinksChainLinks(chain)
}

export const getCellsFromChain = chain => {
    const result = _map(chain, link => link.start)
    result.push(getChainEdgeLinks(chain).last.end)
    return result
}

export const removableNotesCountByChain = (note, chain, notes) => {
    const chainCells = getCellsFromChain(chain)
    const { first, last } = getChainEdgeLinks(chain)
    const chainFirstCell = convertBoardCellNumToCell(first.start)
    const chainLastCell = convertBoardCellNumToCell(last.end)
    return getCellsSharingHousesWithCells(chainFirstCell, chainLastCell)
        .filter(cell => !_includes(chainCells, convertBoardCellToNum(cell)))
        .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell)).length
}

const markEdgeLinksAsLastForValidChain = _chain => {
    if (_isEmpty(_chain)) return _chain

    const chain = _cloneDeep(_chain)
    const { first, last } = getChainEdgeLinks(chain)
    first.isLast = true
    last.isLast = true
    return chain
}

const chainHasStrongEdgeLinks = chain => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.STRONG && last.type === LINK_TYPES.STRONG
}

const chainHasAnyWeakEdgeLink = chain => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.type === LINK_TYPES.WEAK || last.type === LINK_TYPES.WEAK
}

export const getAllValidSubChains = (note, chain, notes) => {
    const result = []

    let subChainLen = MINIMUM_LINKS_IN_CHAIN
    let subChainsCount = chain.length - subChainLen + 1
    while (subChainsCount > 0) {
        for (let i = 0; i <= chain.length - subChainLen; i++) {
            const subChain = _slice(chain, i, i + subChainLen)
            if (!chainHasStrongEdgeLinks(subChain)) continue
            const chainWithLinksSwitched = alternateChainLinks(subChain)
            if (chainHasAnyWeakEdgeLink(chainWithLinksSwitched)) continue

            const removableNotesCount = removableNotesCountByChain(note, chainWithLinksSwitched, notes)
            if (removableNotesCount) {
                result.push({
                    chain: markEdgeLinksAsLastForValidChain(chainWithLinksSwitched),
                    removableNotesCount,
                })
            }
        }
        subChainLen += 2 // chain length will always be odd
        subChainsCount = chain.length - subChainLen + 1
    }

    return result
}

export const getChosenChainFromValidSubChains = subChains => {
    if (_isEmpty(subChains)) return []

    const orderedSubChains = subChains.sort((subChainA, subChainB) => {
        if (subChainA.chain.length !== subChainB.chain.length) {
            return subChainA.chain.length - subChainB.chain.length
        }
        return subChainB.removableNotesCount - subChainA.removableNotesCount
    })

    return _get(orderedSubChains, '[0].chain')
}

const chainHasAllStrongLinks = chain => _every(chain, link => link.type === LINK_TYPES.STRONG)

export const analyzeChain = (note, _chain, notes) => {
    const chain = getTrimWeakLinksFromEdges(_cloneDeep(_chain))
    if (chain.length < MINIMUM_LINKS_IN_CHAIN) return { foundChain: false, chain: _chain }

    const validSubChains = getAllValidSubChains(note, chain, notes)
    const chosenChain = getChosenChainFromValidSubChains(validSubChains)
    const foundChain = !_isEmpty(chosenChain)

    return {
        foundChain,
        chain: foundChain ? chosenChain : _chain,
    }
}

const isChainExplorationComplete = chain => {
    const { first, last } = getChainEdgeLinks(chain)
    return first.isLast && last.isLast
}

const getNewLinkPossibleCells = (chain, strongLinkParticipantCells, weakLinkParticipantCells) => {
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

const exploreChain = (note, chain, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells) => {
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

            const chainInfo = exploreChain(note, chainWithNewLink, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells)
            if (chainInfo.foundChain) return chainInfo
            visitedCells[newLinkCell] = false
        }

        if (!chainProgressed) {
            if (isExtendingFromEnd) {
                chainLastLink.isLast = true
                const chainInfo = exploreChain(note, chain, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells)
                if (chainInfo.foundChain) return chainInfo
            } else {
                chainFirstLink.isLast = true
            }
        }
    }

    if (isChainExplorationComplete(chain)) {
        const { foundChain, chain: validChain } = analyzeChain(note, chain, notes)
        return {
            chain: foundChain ? validChain : chain,
            foundChain,
        }
    }

    return {
        chain,
        foundChain: false,
    }
}

const getNoteChain = (note, strongLinks, weakLinks, notes) => {
    let result = []

    const strongLinkParticipantCells = getNoteStrongLinkCellsParticipants(strongLinks)
    const weakLinkParticipantCells = getNoteWeakLinkCellsParticipants(weakLinks)

    const visitedCells = {}

    const pickedStrongLinks = {}
    const getUnvisitedStrongLink = () => {
        const strongLinkCellsNums = _keys(strongLinkParticipantCells)

        for (let i = 0; i < strongLinkCellsNums.length; i++) {
            const cellA = strongLinkCellsNums[i]
            const cellB = _find(strongLinkParticipantCells[cellA], cell => !pickedStrongLinks[cellA] && !pickedStrongLinks[cell])
            if (cellB) { return [parseInt(cellA, 10), parseInt(cellB, 10)] }
        }

        return null
    }

    let foundChain = false
    while (!foundChain) {
        // capture this DS is test-cases for the ease of understanding
        // unvisitedLink -> ['81', '12']
        const unvisitedLink = getUnvisitedStrongLink()
        if (_isNil(unvisitedLink)) return null
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

        const { chain, foundChain: _foundChain } = exploreChain(note, _chain, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells)

        if (_foundChain) {
            foundChain = _foundChain
            result = chain
        }
    }

    return result
}

export const getFirstNoteXChain = (notes, possibleNotes) => {
    let result = {}

    // TODO: add early break support for these iterators
    BoardIterators.forCellEachNote(note => {
        if (!_isEmpty(result)) return

        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        const weakLinks = getNoteWeakLinks(note, notes, possibleNotes)
        const chain = getNoteChain(note, strongLinks, weakLinks, notes)

        if (!_isEmpty(chain)) { result = { chain, note } }
    })

    return result
}

// export const getRawXChainHint = (mainNumbers, notes, possibleNotes) => {
//     const hint = getFirstNoteXChain( notes, possibleNotes)
//     if (_isEmpty(hint)) {}
// }
