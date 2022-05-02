import { consoleLog, getBlockAndBoxNum } from '../../../../../utils/util'
import { getHouseCells } from '../../houseCells'
import { areSameColCells, areSameRowCells, isCellEmpty, isCellExists, isCellNoteVisible } from '../../util'
import { HINTS_IDS, HOUSE_TYPE } from '../constants'
import { isHintValid } from '../validityTest'
import { LEG_TYPES } from './constants'
import { getUIHighlightData } from './uiHighlightData'
import { getCrossHouseType, categorizeLegs, categorizeFinnedLegCells, getFinnedXWingRemovableNotesHostCells } from './utils'

const getEmptyCellsInHouse = (houseNum, houseType, mainNumbers) => {
    return getHouseCells(houseType, houseNum)
    .filter((cell) => {
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

// FIXME: this func is wrong
export const isFinnedXWingRemovesNotes = ({ houseType, legs }, notesData) => {
    return getFinnedXWingRemovableNotesHostCells({ houseType, legs })
    .some(cell => {
        const cellNotes = notesData[cell.row][cell.col]
        return isCellNoteVisible(legs[0].candidate, cellNotes)
    })
}

const removableNotesInCrossHouse = ({ houseType, legs }, notesData) => {
    // TODO: re-implement for finned and sashimi as well along with perfect X-Wings    
    const { otherLeg } = categorizeLegs(...legs)

    if (otherLeg.type === LEG_TYPES.PERFECT) return isPerfectXWingRemovesNotes({ houseType, legs }, notesData)
    if (otherLeg.type === LEG_TYPES.FINNED) return isFinnedXWingRemovesNotes({houseType, legs}, notesData)
    if (otherLeg.type === LEG_TYPES.SAHIMI) {}

    return false
}

// change it's name to perfectXWingLegs
export const areXWingCells = (perfectLegHostCells, otherLegHostCells) => {
    return perfectLegHostCells.every((perfectLegCell) => {
        return otherLegHostCells.some((otherLegCell) => {
            const cellsPair = [perfectLegCell, otherLegCell]
            return areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        })
    })
}

export const areFinnedXWingLegs = (perfectLegHostCells, finnedLegHostCells) => {
    if (!areXWingCells(perfectLegHostCells, finnedLegHostCells)) return false

    const { perfect: perfectCells, finns } = categorizeFinnedLegCells(perfectLegHostCells, finnedLegHostCells)
    return finns.every(finnCell => {
        return perfectCells.some(perfectCell => {
            return getBlockAndBoxNum(finnCell).blockNum === getBlockAndBoxNum(perfectCell).blockNum
        })
    })
}

// TODO: this func must have test-cases
// these legs belong to same candidate and from same houseType
const areValidXWingLegs = (legA, legB) => {
    if (legA.type !== LEG_TYPES.PERFECT && legB.type !== LEG_TYPES.PERFECT) return false

    const { perfectLeg, otherLeg } = categorizeLegs(legA, legB)

    if (otherLeg.type === LEG_TYPES.PERFECT) return areXWingCells(perfectLeg.cells, otherLeg.cells)
    if (otherLeg.type === LEG_TYPES.FINNED) return areFinnedXWingLegs(perfectLeg.cells, otherLeg.cells)

    return true
    // instead of cells. pass legs here
    // TODO: re-implement validity checker
    // const xWing = {
    //     cells: [perfectLeg.cells, otherLeg.cells],
    //     candidate: perfectLeg.candidate,
    //     type: perfectLeg.house.type,
    // }    

    // TODO: "isHintValid" has to be updated as well for finned and sashimi X-Wings
    // return areXWingCells(perfectLeg.cells, otherLeg.cells) // && (isHintValid({ type: HINTS_IDS.X_WING, data: xWing }) || true)
}

const isPerfectLeg = (candidateHostCells) => {
    return candidateHostCells.length === 2
}

export const isFinnedLeg = (hostCells) => {
    if (hostCells.length > 4 || hostCells.length <= 2) return false

    const groupHostCellsByBlock = {}
    hostCells.forEach((cell) => {
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

const getXWingLegType = (candidateHostCells) => {
    if (candidateHostCells.length < 2) return LEG_TYPES.INVALID

    if (isPerfectLeg(candidateHostCells)) return LEG_TYPES.PERFECT
    if (isFinnedLeg(candidateHostCells)) return LEG_TYPES.FINNED

    return LEG_TYPES.INVALID
}

// covering only perfect legs right now
export const getHouseXWingLegs = (house, mainNumbers, notesData) => {
    const result = []

    const candidatesHostCells = getAllCandidatesOccurencesInHouse(
        house.num,
        house.type,
        notesData,
        mainNumbers,
    )

    for (let note=1;note<=9;note++) {
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

const getXWingType = (legAType, legBType) => {
    if (legAType !==  LEG_TYPES.PERFECT) return legAType
    if (legBType !==  LEG_TYPES.PERFECT) return legBType
    return LEG_TYPES.PERFECT
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []
    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]

    const candidateXWingLegs = {}
    searchableHouses.forEach((houseType) => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const house = { type: houseType, num: houseNum }
            const housePossibleXWingLegs = getHouseXWingLegs(house, mainNumbers, notesData)
            housePossibleXWingLegs.forEach((xWingLeg) => {
                addCandidateXWingLeg({ ...xWingLeg }, houseType, candidateXWingLegs)
            })
        }
    })

    for (const candidate in candidateXWingLegs) {
        for (const houseType in candidateXWingLegs[candidate]) {
            const candidateXWingLegsInHouses = candidateXWingLegs[candidate]?.[houseType] || []
            for (let i=0;i<candidateXWingLegsInHouses.length;i++) {
                for (let j=i+1;j<candidateXWingLegsInHouses.length;j++) {
                    const firstLeg = candidateXWingLegsInHouses[i]
                    const secondLeg = candidateXWingLegsInHouses[j]
                    if (areValidXWingLegs(firstLeg, secondLeg)) {
                        result.push({
                            houseType,
                            type: getXWingType(firstLeg.type, secondLeg.type),
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

    return getUIHighlightData (xWings, notesData)
}
