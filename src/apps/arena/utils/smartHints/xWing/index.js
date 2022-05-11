import { consoleLog, getBlockAndBoxNum } from '../../../../../utils/util'
import { getHouseCells } from '../../houseCells'
import {
    areSameBlockCells,
    areSameCells,
    areSameColCells,
    areSameRowCells,
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
} from './utils'

const getEmptyCellsInHouse = (houseNum, houseType, mainNumbers) => {
    return getHouseCells(houseType, houseNum).filter(cell => {
        return isCellEmpty(cell, mainNumbers)
    })
}

// we can use this func for our purpose below
const getAllCandidatesOccurencesInHouse = (houseNum, houseType, notesData, mainNumbers) => {
    const emptyCellsInHouse = getEmptyCellsInHouse(houseNum, houseType, mainNumbers)
    const result = {}
    emptyCellsInHouse.forEach(cell => {
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
    return getFinnedXWingRemovableNotesHostCells({ houseType, legs }).some(cell => {
        const cellNotes = notesData[cell.row][cell.col]
        return isCellNoteVisible(legs[0].candidate, cellNotes)
    })
}

const removableNotesInCrossHouse = ({ houseType, legs }, notesData) => {
    // TODO: re-implement for finned and sashimi as well along with perfect X-Wings
    const { otherLeg } = categorizeLegs(...legs)

    if (otherLeg.type === LEG_TYPES.PERFECT) return isPerfectXWingRemovesNotes({ houseType, legs }, notesData)
    if (otherLeg.type === LEG_TYPES.FINNED) return isFinnedXWingRemovesNotes({ houseType, legs }, notesData)
    // TODO: re-implement this
    if (otherLeg.type === LEG_TYPES.SAHIMI) return false

    return false
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

// we are calling it after isPerfectXWing func only,
// confirm it once and remove the check. doesn't break tests though
export const isFinnedXWing = (perfectLegHostCells, finnedLegHostCells) => {
    if (!isPerfectXWing(perfectLegHostCells, finnedLegHostCells)) return false

    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLegHostCells, finnedLegHostCells)
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

export const categorizeSashimiPerfectLegCells = (perfectLegCells, otherLegCells) => {
    const result = {}
    perfectLegCells.forEach(perfectLegCell => {
        // TODO: this below loop is repeating again and again
        // extract it
        const isAligned = otherLegCells.some(otherLegCell => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
        if (isAligned) result.perfectAligned = perfectLegCell
        else result.sashimiAligned = perfectLegCell
    })
    return result
}

export const getSashimiCell = (perfectLegSashimiAlignedCell, otherLegCells, xWingHouseType) => {
    if (xWingHouseType === HOUSE_TYPE.ROW) {
        return {
            row: otherLegCells[0].row,
            col: perfectLegSashimiAlignedCell.col,
        }
    } else {
        return {
            row: perfectLegSashimiAlignedCell.row,
            col: otherLegCells[0].col,
        }
    }
}

export const isSashimiFinnedXWing = (perfectLeg, otherLeg, xWingHouseType) => {
    if (otherLeg.type === LEG_TYPES.PERFECT) {
        return (
            isSashimiFinnedXWing(
                perfectLeg,
                { ...Object.assign({}, otherLeg), type: LEG_TYPES.FINNED },
                xWingHouseType,
            ) ||
            isSashimiFinnedXWing(otherLeg, { ...Object.assign({}, perfectLeg), type: LEG_TYPES.FINNED }, xWingHouseType)
        )
    }

    const { perfectAligned, sashimiAligned } = categorizeSashimiPerfectLegCells(perfectLeg.cells, otherLeg.cells)
    if (!perfectAligned || !sashimiAligned) return false

    const sashimiCell = getSashimiCell(sashimiAligned, otherLeg.cells, xWingHouseType)
    // TODO: check if the order of these cells is relevant or not
    const sashimiFinnedLegCells = [...otherLeg.cells, sashimiCell]
    if (isFinnedLeg(sashimiFinnedLegCells)) {
        const finns = sashimiFinnedLegCells.filter(cell => {
            if (areSameCells(cell, sashimiCell)) return false
            if (areSameColCells([cell, perfectAligned]) || areSameRowCells([cell, perfectAligned])) return false
            return true
        })
        return finns.every(finn => {
            return areSameBlockCells([sashimiCell, finn])
        })
    }

    return false
}

// TODO: this func must have test-cases
// these legs belong to same candidate and from same houseType
const getXWingType = (legA, legB, xWingHouseType) => {
    if (legA.type !== LEG_TYPES.PERFECT && legB.type !== LEG_TYPES.PERFECT) return XWING_TYPES.INVALID

    const { perfectLeg, otherLeg } = categorizeLegs(legA, legB)

    if (otherLeg.type === LEG_TYPES.PERFECT && isPerfectXWing(perfectLeg.cells, otherLeg.cells))
        return XWING_TYPES.PERFECT
    if (otherLeg.type === LEG_TYPES.FINNED && isFinnedXWing(perfectLeg.cells, otherLeg.cells)) return XWING_TYPES.FINNED
    if (isSashimiFinnedXWing(perfectLeg, otherLeg, xWingHouseType)) return XWING_TYPES.SASHIMI_FINNED

    return XWING_TYPES.INVALID

    // instead of cells. pass legs here
    // TODO: re-implement validity checker
    // const xWing = {
    //     cells: [perfectLeg.cells, otherLeg.cells],
    //     candidate: perfectLeg.candidate,
    //     type: perfectLeg.house.type,
    // }

    // TODO: "isHintValid" has to be updated as well for finned and sashimi X-Wings
    // return isPerfectXWing(perfectLeg.cells, otherLeg.cells) // && (isHintValid({ type: HINTS_IDS.X_WING, data: xWing }) || true)
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

    const candidatesHostCells = getAllCandidatesOccurencesInHouse(house.num, house.type, notesData, mainNumbers)

    for (let note = 1; note <= 9; note++) {
        if (!candidatesHostCells[note]) continue
        const legType = getXWingLegType(candidatesHostCells[note])
        if ([LEG_TYPES.PERFECT, LEG_TYPES.FINNED].includes(legType)) {
            result.push({ candidate: note, cells: candidatesHostCells[note], type: legType })
        }
    }

    return result
}

const addCandidateXWingLeg = ({ candidate, cells, type: legType }, houseType, candidateXWingLegs) => {
    if (!candidateXWingLegs[candidate]) candidateXWingLegs[candidate] = {}
    if (!candidateXWingLegs[candidate][houseType]) candidateXWingLegs[candidate][houseType] = []
    candidateXWingLegs[candidate][houseType].push({ candidate, cells, type: legType })
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []
    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]

    const candidateXWingLegs = {}
    searchableHouses.forEach(houseType => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const house = { type: houseType, num: houseNum }
            const housePossibleXWingLegs = getHouseXWingLegs(house, mainNumbers, notesData)
            housePossibleXWingLegs.forEach(xWingLeg => {
                addCandidateXWingLeg({ ...xWingLeg }, houseType, candidateXWingLegs)
            })
        }
    })

    for (const candidate in candidateXWingLegs) {
        for (const houseType in candidateXWingLegs[candidate]) {
            const candidateXWingLegsInHouses = candidateXWingLegs[candidate]?.[houseType] || []
            for (let i = 0; i < candidateXWingLegsInHouses.length; i++) {
                for (let j = i + 1; j < candidateXWingLegsInHouses.length; j++) {
                    const firstLeg = candidateXWingLegsInHouses[i]
                    const secondLeg = candidateXWingLegsInHouses[j]
                    const xWingType = getXWingType(firstLeg, secondLeg, houseType)
                    if (xWingType !== XWING_TYPES.INVALID) {
                        result.push({
                            houseType,
                            type: xWingType,
                            legs: [firstLeg, secondLeg],
                        })
                    }
                }
            }
        }
    }

    return result
}

export const getXWingHints = (mainNumbers, notesData) => {
    const xWings = getAllXWings(mainNumbers, notesData).filter(xWing => {
        return removableNotesInCrossHouse(xWing, notesData)
    })

    return getUIHighlightData(xWings, notesData)
}
