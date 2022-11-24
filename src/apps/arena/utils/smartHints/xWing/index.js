import _cloneDeep from 'lodash/src/utils/cloneDeep'
import _get from 'lodash/src/utils/get'
import _every from 'lodash/src/utils/every'

import { NUMBERS_IN_HOUSE } from '../../../constants'

import { getHouseCells } from '../../houseCells'
import {
    areSameBlockCells,
    areSameColCells,
    areSameRowCells,
    forEachHouse,
    isCellEmpty,
    isCellNoteVisible,
    getBlockAndBoxNum,
} from '../../util'

import { HINTS_IDS, HOUSE_TYPE } from '../constants'
import { isHintValid } from '../validityTest'

import { LEG_TYPES, XWING_TYPES } from './constants'
import { getUIHighlightData } from './uiHighlightData'
import {
    getCrossHouseType,
    categorizeLegs,
    categorizeFinnedLegCells,
    getFinnedXWingRemovableNotesHostCells,
    addCellInXWingLeg,
    categorizeSashimiXWingPerfectLegCells,
    getSashimiCell,
    getXWingCandidate,
    isPerfectLegType,
} from './utils'

const getCrossHouseCells = (cell, houseType) => {
    const crossHouseType = getCrossHouseType(houseType)
    const crossHouseNum = crossHouseType === HOUSE_TYPE.ROW ? cell.row : cell.col
    return getHouseCells({
        type: crossHouseType,
        num: crossHouseNum,
    })
}

const isPerfectXWingRemovesNotes = (xWing, notesData) => {
    const MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVER_XWING = 3

    return xWing.legs[0].cells.some(mainHouseCell => {
        let candidateInstancesCount = 0
        getCrossHouseCells(mainHouseCell, xWing.houseType).forEach(({ row, col }) => {
            if (notesData[row][col][getXWingCandidate(xWing) - 1].show) candidateInstancesCount++
        })
        return candidateInstancesCount >= MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVER_XWING
    })
}

export const isFinnedXWingRemovesNotes = ({ houseType, legs }, notesData) => {
    return getFinnedXWingRemovableNotesHostCells({ houseType, legs }, notesData).some(cell => {
        return isCellNoteVisible(legs[0].candidate, notesData[cell.row][cell.col])
    })
}

const removableNotesPresentInCrossHouse = ({ houseType, legs }, notesData) => {
    const { otherLeg } = categorizeLegs(...legs)

    if (otherLeg.type === XWING_TYPES.PERFECT) return isPerfectXWingRemovesNotes({ houseType, legs }, notesData)
    return isFinnedXWingRemovesNotes({ houseType, legs }, notesData)
}

// change it's name to perfectXWingLegs
export const isPerfectXWing = (perfectLegHostCells, otherLegHostCells) => {
    return perfectLegHostCells.every(perfectLegCell => {
        return otherLegHostCells.some(otherLegCell => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
    })
}

export const isFinnedXWing = (perfectLegHostCells, finnedLegHostCells) => {
    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLegHostCells, finnedLegHostCells)
    if (perfectCells.length !== 2) return false
    return finns.every(finnCell => {
        return perfectCells.some(perfectCell => {
            return getBlockAndBoxNum(finnCell).blockNum === getBlockAndBoxNum(perfectCell).blockNum
        })
    })
}

export const getAlignedCellInPerfectLeg = (perfectLegCells, otherLegCells) => {
    return perfectLegCells.find(perfectLegCell => {
        return otherLegCells.some(otherLegCell => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
    })
}

const arePerfectNonAlignedLegsSashimiFinnedXWing = xWing => {
    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    return (
        isSashimiFinnedXWing({
            houseType: xWing.houseType,
            legs: [perfectLeg, { ...Object.assign({}, otherLeg), type: LEG_TYPES.FINNED }],
        }) ||
        isSashimiFinnedXWing({
            houseType: xWing.houseType,
            legs: [otherLeg, { ...Object.assign({}, perfectLeg), type: LEG_TYPES.FINNED }],
        })
    )
}

const allFinnsShareBlockWithSashimiCell = (sashimiCell, legsCells) => {
    const { perfectLegCells, sashimiFinnedLegCells } = legsCells
    const { finns } = categorizeFinnedLegCells(perfectLegCells, sashimiFinnedLegCells)
    return finns.every(finn => {
        return areSameBlockCells([sashimiCell, finn])
    })
}

const perfectLegAlignsWithFinnedLegForSashimiXWing = (perfectLegCells, finnedLegCells) => {
    const { perfectAligned, sashimiAligned } = categorizeSashimiXWingPerfectLegCells(perfectLegCells, finnedLegCells)
    return perfectAligned && sashimiAligned
}

const isValidSashimiXWingAfterAddingSashimiCell = xWing => {
    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    const sashimiCell = getSashimiCell(xWing)
    const sashimiFinnedLegCells = [...otherLeg.cells]
    addCellInXWingLeg(sashimiCell, sashimiFinnedLegCells, xWing.houseType)

    if (isFinnedLeg(sashimiFinnedLegCells)) {
        return allFinnsShareBlockWithSashimiCell(sashimiCell, {
            perfectLegCells: perfectLeg.cells,
            sashimiFinnedLegCells,
        })
    }

    return false
}

export const isSashimiFinnedXWing = xWing => {
    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    if (isPerfectLegType(otherLeg)) return arePerfectNonAlignedLegsSashimiFinnedXWing(xWing)
    if (!perfectLegAlignsWithFinnedLegForSashimiXWing(perfectLeg.cells, otherLeg.cells)) return false
    return isValidSashimiXWingAfterAddingSashimiCell(xWing)
}

const noLegIsPerfect = xWing => _every(xWing.legs, (leg) => !isPerfectLegType(leg))

export const getXWingType = xWing => {
    if (noLegIsPerfect(xWing)) return XWING_TYPES.INVALID

    const candidateAllNotesNotFilledInLegs = !isHintValid({ type: HINTS_IDS.X_WING, data: xWing })
    if (candidateAllNotesNotFilledInLegs) return XWING_TYPES.INVALID

    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    if (isPerfectLegType(otherLeg) && isPerfectXWing(perfectLeg.cells, otherLeg.cells))
        return XWING_TYPES.PERFECT
    if (otherLeg.type === LEG_TYPES.FINNED && isFinnedXWing(perfectLeg.cells, otherLeg.cells)) return XWING_TYPES.FINNED
    if (isSashimiFinnedXWing(xWing)) return XWING_TYPES.SASHIMI_FINNED

    return XWING_TYPES.INVALID
}

const getEmptyCellsInHouse = (house, mainNumbers) => {
    return getHouseCells(house).filter(cell => {
        return isCellEmpty(cell, mainNumbers)
    })
}

// we can use this func for our purpose below
const getAllCandidatesOccurencesInHouse = (house, notesData, mainNumbers) => {
    const result = {}
    getEmptyCellsInHouse(house, mainNumbers).forEach(cell => {
        const cellNotes = notesData[cell.row][cell.col]
        cellNotes
            .filter(({ show }) => show)
            .forEach(({ noteValue }) => {
                if (!result[noteValue]) result[noteValue] = []
                result[noteValue].push(cell)
            })
    })
    return result
}

const isPerfectLeg = candidateHostCells => {
    return candidateHostCells.length === 2
}

const getHostCellsGroupByBlock = hostCells => {
    const result = {}
    hostCells.forEach(cell => {
        const { blockNum } = getBlockAndBoxNum(cell)
        if (!result[blockNum]) result[blockNum] = []
        result[blockNum].push(cell)
    })
    return result
}

export const isFinnedLeg = hostCells => {
    const invalidOccurrences = hostCells.length > 4 || hostCells.length <= 2
    if (invalidOccurrences) return false

    const hostCellsGroupsByBlock = getHostCellsGroupByBlock(hostCells)
    const groupsCount = Object.keys(hostCellsGroupsByBlock).length
    if (groupsCount > 2) return false
    if (groupsCount === 1 || hostCells.length === 3) return true

    for (const blockNum in hostCellsGroupsByBlock) {
        if (hostCellsGroupsByBlock[blockNum].length === 1) return true
    }

    return false
}

const getXWingLegType = candidateHostCells => {
    if (candidateHostCells.length < 2) return LEG_TYPES.INVALID
    if (isPerfectLeg(candidateHostCells)) return LEG_TYPES.PERFECT
    if (isFinnedLeg(candidateHostCells)) return LEG_TYPES.FINNED

    return LEG_TYPES.INVALID
}

export const getHouseXWingLegs = (house, mainNumbers, notesData) => {
    const result = []

    const candidatesHostCells = getAllCandidatesOccurencesInHouse(house, notesData, mainNumbers)
    for (let note = 1; note <= NUMBERS_IN_HOUSE; note++) {
        if (!candidatesHostCells[note]) continue
        const legType = getXWingLegType(candidatesHostCells[note])
        if ([LEG_TYPES.PERFECT, LEG_TYPES.FINNED].includes(legType)) {
            result.push({ candidate: note, cells: candidatesHostCells[note], type: legType })
        }
    }

    return result
}

const getSashimiLegFromNonAllignedPerfectLegs = xWing => {
    const {
        legs: [legA, legB],
    } = xWing

    const isLegAValidSashimiLeg = isSashimiFinnedXWing({
        ...xWing,
        legs: [{ ...Object.assign({}, legA), type: LEG_TYPES.FINNED }, legB],
    })
    return isLegAValidSashimiLeg ? legA : legB
}

const getValidSashimiXWingSashimiLeg = xWing => {
    const { otherLeg } = categorizeLegs(...xWing.legs)
    if (!isPerfectLegType(otherLeg)) return otherLeg

    return getSashimiLegFromNonAllignedPerfectLegs(xWing)
}

export const transformSashimiXWingLeg = xWing => {
    const { houseType, legs } = xWing
    const firstLeg = _cloneDeep(legs[0])
    const secondLeg = _cloneDeep(legs[1])

    const sashimiLeg = getValidSashimiXWingSashimiLeg({ houseType, legs: [firstLeg, secondLeg] })
    sashimiLeg.type = LEG_TYPES.SASHIMI_FINNED

    const { perfectLeg, otherLeg } = categorizeLegs(firstLeg, secondLeg)
    addCellInXWingLeg(getSashimiCell({ houseType, legs: [perfectLeg, otherLeg] }), sashimiLeg.cells, houseType)

    return [firstLeg, secondLeg]
}

const addCandidateXWingLeg = ({ candidate, cells, type: legType }, houseType, candidateXWingLegs) => {
    if (!candidateXWingLegs[candidate]) candidateXWingLegs[candidate] = {}
    if (!candidateXWingLegs[candidate][houseType]) candidateXWingLegs[candidate][houseType] = []
    candidateXWingLegs[candidate][houseType].push({ candidate, cells, type: legType }) // TODO: we don't need to add candidate here
}

const getAllXWingEligibleCandidates = (mainNumbers, notesData) => {
    const result = {}

    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]
    searchableHouses.forEach(houseType => {
        forEachHouse(houseNum => {
            const house = { type: houseType, num: houseNum }
            getHouseXWingLegs(house, mainNumbers, notesData).forEach(xWingLeg => {
                addCandidateXWingLeg(xWingLeg, houseType, result)
            })
        })
    })
    return result
}

const transformValidXWingLegs = xWing => {
    const { legs } = xWing
    if (xWing.type === XWING_TYPES.SASHIMI_FINNED) return transformSashimiXWingLeg(xWing)
    return legs
}

const getCandidateValidXWings = (houseType, candidateXWingLegsInHouses) => {
    const result = []
    for (let i = 0; i < candidateXWingLegsInHouses.length; i++) {
        for (let j = i + 1; j < candidateXWingLegsInHouses.length; j++) {
            const firstLeg = candidateXWingLegsInHouses[i]
            const secondLeg = candidateXWingLegsInHouses[j]

            const xWingType = getXWingType({
                houseType,
                legs: [firstLeg, secondLeg],
            })

            if (xWingType !== XWING_TYPES.INVALID) {
                const xWing = {
                    houseType,
                    type: xWingType,
                    legs: [firstLeg, secondLeg],
                }
                result.push({
                    ...xWing,
                    legs: transformValidXWingLegs(xWing),
                })
            }
        }
    }
    return result
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []

    const candidateXWingLegs = getAllXWingEligibleCandidates(mainNumbers, notesData)
    for (const candidate in candidateXWingLegs) {
        for (const houseType in candidateXWingLegs[candidate]) {
            result.push(...getCandidateValidXWings(houseType, _get(candidateXWingLegs, [candidate, houseType], [])))
        }
    }

    return result
}

export const getXWingHints = (mainNumbers, notesData, maxHintsThreshold) => {
    const xWings = getAllXWings(mainNumbers, notesData)
        .filter(xWing => {
            return removableNotesPresentInCrossHouse(xWing, notesData)
            // return removableNotesPresentInCrossHouse(xWing, notesData) && xWing.type === XWING_TYPES.SASHIMI_FINNED
            // return removableNotesPresentInCrossHouse(xWing, notesData) && xWing.type === XWING_TYPES.FINNED
        })
        .slice(0, maxHintsThreshold)

    if (!xWings.length) return null

    return getUIHighlightData(xWings, notesData)
}
