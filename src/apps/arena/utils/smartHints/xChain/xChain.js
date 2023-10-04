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

// TODO: add aliases for these files
import { NotesRecord } from 'src/apps/arena/RecordUtilities/boardNotes'
import { N_CHOOSE_K } from '@resources/constants'
import { BoardIterators } from '../../classes/boardIterators'
import { convertBoardCellNumToCell, convertBoardCellToNum } from '../../cellTransformers'
import { getCellsSharingHousesWithCells } from '../../util'

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

// TODO: this will be a general util for all the Chains
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

// TODO: rename it, getNoteStrongLinksCellsParticipantsForQueries ?? how's this ?
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

// TODO: add strong links as well here because these can also be used as weak links
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

// TODO: use lodash array utils here like _head etc
export const getTrimWeakLinksFromEdges = _chain => {
    let chain = _cloneDeep(_chain)

    const firstEntry = _get(chain, [0], {})
    if (firstEntry.type === LINK_TYPES.WEAK) {
        chain = chain.slice(1)
        if (chain.length) chain[0].isLast = true
    }

    const lastEntry = _get(chain, [chain.length - 1], {})
    if (lastEntry.type === LINK_TYPES.WEAK) {
        chain = chain.slice(0, chain.length - 1)
        if (chain.length) chain[chain.length - 1].isLast = true
    }

    return chain
}

const getAllValidSubChains = chain => {
    // TODO: find how many notes each combination removes

    // return [
    //     {
    //         removableNotesCount: number,
    //         chain: array,
    //     },
    //     {
    //         removableNotesCount: number,
    //         chain: array,
    //     },
    // ]

}

// this function will always get odd number of links chain
// TODO: rename it to something like alternateLinksInChain
export const switchAllStrongLinksChainLinks = chain => _map(chain, (link, index) => {
    if (index % 2) {
        return {
            ...link,
            type: LINK_TYPES.WEAK,
        }
    }
    return link
})

// TODO: merge this with switchAllStrongLinksChainLinks
export const switchMixedLinksChainLinks = chain => {
    if (chainHasAllStrongLinks(chain)) return switchAllStrongLinksChainLinks(chain)
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

export const getCellsFromChain = chain => {
    const result = _map(chain, link => link.start)
    result.push(chain[chain.length - 1].end)
    return result
}

export const removableNotesCountByChain = (note, chain, notes) => {
    const chainCells = getCellsFromChain(chain)
    const chainFirstCell = convertBoardCellNumToCell(chain[0].start)
    const chainLastCell = convertBoardCellNumToCell(chain[chain.length - 1].end)
    return getCellsSharingHousesWithCells(chainFirstCell, chainLastCell)
        .filter(cell => !_includes(chainCells, convertBoardCellToNum(cell)))
        .filter(cell => NotesRecord.isNotePresentInCell(notes, note, cell)).length
}

const markEdgeLinksAsLastForValidChain = _chain => {
    const chain = _cloneDeep(_chain)

    chain[0].isLast = true
    chain[chain.length - 1].isLast = true
    return chain
}

// chain is good already and has atleast 3 links in it
export const analyzeChainOfAllStrongLinks = (note, chain, notes) => {
    const result = []

    let subChainLen = 3 // minimum links in chain will be 3
    let subChainsCount = chain.length - subChainLen + 1
    while (subChainsCount > 0) {
        for (let i = 0; i <= chain.length - subChainLen; i++) {
            const subChain = chain.slice(i, i + subChainLen)
            const chainWithAlternateLinks = switchAllStrongLinksChainLinks(subChain)
            const removableNotesCount = removableNotesCountByChain(note, chainWithAlternateLinks, notes)
            if (removableNotesCount) {
                result.push({
                    chain: markEdgeLinksAsLastForValidChain(chainWithAlternateLinks),
                    removableNotesCount,
                })
            }
        }
        subChainLen += 2 // chain length will always be odd
        subChainsCount = chain.length - subChainLen + 1
    }

    return result
}

const chainHasStrongEdgeLinks = chain => chain[0].type === LINK_TYPES.STRONG
    && chain[chain.length - 1].type === LINK_TYPES.STRONG

const chainHasAnyWeakEdgeLink = chain => chain[0].type === LINK_TYPES.WEAK
    || chain[chain.length - 1].type === LINK_TYPES.WEAK

// will behave same as "analyzeChainOfAllStrongLinks"
// TODO: merge this with analyzeChainOfAllStrongLinks
export const analyzeMixedLinksChain = (note, chain, notes) => {
    const result = []

    let subChainLen = 3 // minimum links in chain will be 3
    let subChainsCount = chain.length - subChainLen + 1
    while (subChainsCount > 0) {
        for (let i = 0; i <= chain.length - subChainLen; i++) {
            const subChain = chain.slice(i, i + subChainLen)
            if (!chainHasStrongEdgeLinks(subChain)) continue
            const chainWithLinksSwitched = switchMixedLinksChainLinks(subChain)
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

    // chain must have atleast 3 links to result in a fruitful hint
    // TODO: put this in constants file
    if (chain.length < 3) {
        return { foundChain: false, chain: _chain }
    }

    const allStrongLinks = chainHasAllStrongLinks(chain)

    if (allStrongLinks) {
        const validSubChains = analyzeChainOfAllStrongLinks(note, chain, notes)
        const chosenChain = getChosenChainFromValidSubChains(validSubChains)
        const foundChain = !_isEmpty(chosenChain)

        return {
            foundChain,
            chain: foundChain ? chosenChain : _chain,
        }
    }

    const validSubChains = analyzeMixedLinksChain(note, chain, notes)
    const chosenChain = getChosenChainFromValidSubChains(validSubChains)
    const foundChain = !_isEmpty(chosenChain)

    return {
        foundChain,
        chain: foundChain ? chosenChain : _chain,
    }
}

let cnt = 0

const getExtendChain = (note, chain, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells) => {
    // use lodash util here
    const it = cnt++
    // console.log('@@@@@ chain', it, chain)

    if (!chain[chain.length - 1].isLast) {
        // extend chain from behind
        const { end: rightMostEndCell, type: rightMostLinkType } = chain[chain.length - 1]
        const nextLinkPossibleCells = (
            rightMostLinkType === LINK_TYPES.STRONG
                ? [...strongLinkParticipantCells[rightMostEndCell], ...weakLinkParticipantCells[rightMostEndCell]]
                : strongLinkParticipantCells[rightMostEndCell]
        ) || []

        let chainProgressed = false
        for (let i = 0; i < nextLinkPossibleCells.length; i++) {
            const nextLinkCell = nextLinkPossibleCells[i]
            if (visitedCells[nextLinkCell]) continue

            visitedCells[nextLinkCell] = true
            chainProgressed = true
            const chainInfo = getExtendChain(
                note,
                [
                    ...chain,
                    {
                        start: rightMostEndCell,
                        end: nextLinkCell,
                        type: _includes(strongLinkParticipantCells[rightMostEndCell], nextLinkCell)
                            ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
                        isLast: false,
                    },
                ],
                strongLinkParticipantCells,
                weakLinkParticipantCells,
                notes,
                visitedCells,
            )

            if (chainInfo.foundChain) return chainInfo

            visitedCells[nextLinkCell] = false
        }

        if (!chainProgressed) chain[chain.length - 1].isLast = true
    }

    if (!chain[0].isLast) {
        // extend chain from start
        const { start: leftMostEndCell, type: leftMostLinkType } = chain[0]

        const nextLinkPossibleCells = (
            leftMostLinkType === LINK_TYPES.STRONG
                ? [...strongLinkParticipantCells[leftMostEndCell], ...weakLinkParticipantCells[leftMostEndCell]]
                : strongLinkParticipantCells[leftMostEndCell]
        ) || []

        let chainProgressed = false
        for (let i = 0; i < nextLinkPossibleCells.length; i++) {
            const nextLinkCell = nextLinkPossibleCells[i]
            if (visitedCells[nextLinkCell]) continue

            visitedCells[nextLinkCell] = true
            chainProgressed = true
            const chainInfo = getExtendChain(
                note,
                [
                    {
                        start: nextLinkCell,
                        end: leftMostEndCell,
                        type: _includes(strongLinkParticipantCells[leftMostEndCell], nextLinkCell)
                            ? LINK_TYPES.STRONG : LINK_TYPES.WEAK,
                        isLast: false,
                    },
                    ...chain,
                ],
                strongLinkParticipantCells,
                weakLinkParticipantCells,
                notes,
                visitedCells,
            )

            if (chainInfo?.foundChain) return chainInfo

            visitedCells[nextLinkCell] = false
        }

        if (!chainProgressed) chain[0].isLast = true
    }

    const isChainComplete = () => chain[0].isLast && chain[chain.length - 1].isLast
    if (isChainComplete()) {
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

        const chain = getExtendChain(note, _chain, strongLinkParticipantCells, weakLinkParticipantCells, notes, visitedCells)

        if (chain) {
            foundChain = true
            console.log('@@@@@ final chain', chain)
        }

        // foundChain =
    }

    return null
}

export const getXChainRawHints = (mainNumbers, notes, possibleNotes) => {
    const rawHintData = null // getHintRawData(notesPairsHostCells, notes)

    let foundChain = false
    // TODO: add early break support for these iterators
    BoardIterators.forCellEachNote(note => {
        if (foundChain || note !== 7) return

        const strongLinks = getCandidateAllStrongLinks(note, notes, possibleNotes)
        const weakLinks = getNoteWeakLinks(note, notes, possibleNotes)

        const chain = getNoteChain(note, strongLinks, weakLinks, notes)

        if (chain) foundChain = true
    })

    return _isNil(rawHintData) ? null : [rawHintData]
}
