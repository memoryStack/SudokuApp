import { consoleLog, getBlockAndBoxNum } from '../../../../../utils/util'
import cloneDeep from 'lodash/src/utils/cloneDeep'
import _get from 'lodash/src/utils/get'
import { getHouseCells } from '../../houseCells'
import {
    areSameBlockCells,
    areSameCells,
    areSameColCells,
    areSameRowCells,
    forEachHouse,
    isCellEmpty,
    isCellExists,
    isCellNoteVisible,
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
} from './utils'

const isPerfectXWingRemovesNotes = ({ legs, houseType }, notesData) => {
    const MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVING_XWING = 3

    const anyCellOfEachHouse = legs[0].cells
    const candidate = legs[0].candidate
    return anyCellOfEachHouse
        .map(({ row, col }) => {
            const crossHouseType = getCrossHouseType(houseType)
            const crossHouseNum = crossHouseType === HOUSE_TYPE.ROW ? row : col
            const crossHouseCells = getHouseCells(crossHouseType, crossHouseNum)

            let candidateInstancesCount = 0
            crossHouseCells.forEach(({ row, col }) => {
                if (notesData[row][col][candidate - 1].show) candidateInstancesCount++
            })

            return candidateInstancesCount >= MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVING_XWING
        })
        .some(removableNotesPresent => removableNotesPresent)
}

// FIXME: this func is wrong. why is it wrong ??
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

const arePerfectNonAlignedLegsSashimiFinnedXWing = (xWing) => {
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

const isValidSashimiXWingAfterAddingSashimiCell = (xWing) => {
    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    const sashimiCell = getSashimiCell(xWing)
    const sashimiFinnedLegCells = [...otherLeg.cells]
    addCellInXWingLeg(sashimiCell, sashimiFinnedLegCells, xWing.houseType)

    if (isFinnedLeg(sashimiFinnedLegCells)) {
        return allFinnsShareBlockWithSashimiCell(
            sashimiCell,
            { perfectLegCells: perfectLeg.cells, sashimiFinnedLegCells }
        )
    }

    return false
}

export const isSashimiFinnedXWing = xWing => {
    const { perfectLeg, otherLeg } = categorizeLegs(...xWing.legs)
    if (otherLeg.type === LEG_TYPES.PERFECT) return arePerfectNonAlignedLegsSashimiFinnedXWing(xWing)
    if (!perfectLegAlignsWithFinnedLegForSashimiXWing(perfectLeg.cells, otherLeg.cells)) return false
    return isValidSashimiXWingAfterAddingSashimiCell(xWing)
}

export const getXWingType = (legA, legB, xWingHouseType) => {
    const xWing = {
        houseType: xWingHouseType,
        legs: [legA, legB],
    }

    if (legA.type !== LEG_TYPES.PERFECT && legB.type !== LEG_TYPES.PERFECT) return XWING_TYPES.INVALID

    const { perfectLeg, otherLeg } = categorizeLegs(legA, legB)

    let result = XWING_TYPES.INVALID
    if (otherLeg.type === LEG_TYPES.PERFECT && isPerfectXWing(perfectLeg.cells, otherLeg.cells))
        result = XWING_TYPES.PERFECT
    if (otherLeg.type === LEG_TYPES.FINNED && isFinnedXWing(perfectLeg.cells, otherLeg.cells))
        result = XWING_TYPES.FINNED
    if (isSashimiFinnedXWing(xWing)) result = XWING_TYPES.SASHIMI_FINNED

    if (result !== XWING_TYPES.INVALID && !isHintValid({ type: HINTS_IDS.X_WING, data: xWing }))
        result = XWING_TYPES.INVALID

    return result
}

const getEmptyCellsInHouse = (house, mainNumbers) => {
    return getHouseCells(house.type, house.num).filter(cell => {
        return isCellEmpty(cell, mainNumbers)
    })
}

// we can use this func for our purpose below
const getAllCandidatesOccurencesInHouse = (house, notesData, mainNumbers) => {
    const result = {}
    getEmptyCellsInHouse(house, mainNumbers).forEach(cell => {
        const cellNotes = notesData[cell.row][cell.col]
        cellNotes.filter(({ show }) => show)
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

export const isFinnedLeg = hostCells => {
    if (hostCells.length > 4 || hostCells.length <= 2) return false

    const groupHostCellsByBlock = {}
    hostCells.forEach(cell => {
        const { blockNum } = getBlockAndBoxNum(cell)
        if (!groupHostCellsByBlock[blockNum]) groupHostCellsByBlock[blockNum] = []
        groupHostCellsByBlock[blockNum].push(cell)
    })

    const groupsCount = Object.keys(groupHostCellsByBlock).length
    if (groupsCount > 2) return false
    if (groupsCount === 1) return true

    // 2 blocks distribution. one block must have only 1 hostCell
    for (const blockNum in groupHostCellsByBlock) {
        if (groupHostCellsByBlock[blockNum].length === 1) return true
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
    for (let note = 1; note <= 9; note++) {
        if (!candidatesHostCells[note]) continue
        const legType = getXWingLegType(candidatesHostCells[note])
        if ([LEG_TYPES.PERFECT, LEG_TYPES.FINNED].includes(legType)) {
            result.push({ candidate: note, cells: candidatesHostCells[note], type: legType })
        }
    }

    return result
}

const getSashimiLegFromNonAllignedPerfectLegs = (houseType, legA, legB) => {
    const isLegAValidSashimiLeg = isSashimiFinnedXWing({
        houseType,
        legs: [{ ...Object.assign({}, legA), type: LEG_TYPES.FINNED }, legB],
    })
    return isLegAValidSashimiLeg ? legA : legB
}

const getValidSashimiXWingSashimiLeg = (legA, legB, houseType) => {
    const { otherLeg } = categorizeLegs(legA, legB)
    if (otherLeg.type !== LEG_TYPES.PERFECT) return otherLeg

    return getSashimiLegFromNonAllignedPerfectLegs(houseType, legA, legB)
}

export const transformSashimiXWingLeg = (legA, legB, houseType) => {
    const firstLeg = cloneDeep(legA)
    const secondLeg = cloneDeep(legB)

    const sashimiLeg = getValidSashimiXWingSashimiLeg(firstLeg, secondLeg, houseType)
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
        forEachHouse((houseNum) => {
            const house = { type: houseType, num: houseNum }
            getHouseXWingLegs(house, mainNumbers, notesData)
                .forEach(xWingLeg => {
                    addCandidateXWingLeg(xWingLeg, houseType, result)
                })
        })
    })
    return result
}

const transformValidXWingLegs = (xWingType, { firstLeg, secondLeg }, houseType) => {
    if (xWingType === XWING_TYPES.SASHIMI_FINNED) return transformSashimiXWingLeg(firstLeg, secondLeg, houseType)
    return [firstLeg, secondLeg]
}

const getCandidateValidXWings = (houseType, candidateXWingLegsInHouses) => {
    const result = []
    for (let i = 0; i < candidateXWingLegsInHouses.length; i++) {
        for (let j = i + 1; j < candidateXWingLegsInHouses.length; j++) {
            const firstLeg = candidateXWingLegsInHouses[i]
            const secondLeg = candidateXWingLegsInHouses[j]
            const xWingType = getXWingType(firstLeg, secondLeg, houseType)

            if (xWingType !== XWING_TYPES.INVALID) {
                result.push({
                    houseType,
                    type: xWingType,
                    legs: transformValidXWingLegs(xWingType, { firstLeg, secondLeg }, houseType),
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
