import { getHouseCells } from '../../houseCells'
import { areSameColCells, areSameRowCells, isCellEmpty } from '../../util'
import { HINTS_IDS, HOUSE_TYPE } from '../constants'
import { isHintValid } from '../validityTest'
import { getUIHighlightData } from './uiHighlightData'

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

// filtering if the candidate is valid for being a XWing leg or not
// TODO: this will be changed for finding out sashimi and finned X-Wings
const deleteInvalidCandidates = candidatesOccurences => {
    const HOUSE_OCCURENCES_FOR_VALID_CANDIDATE = 2
    for (let candidate = 1; candidate <= 9; candidate++) {
        if (
            candidatesOccurences[candidate] &&
            candidatesOccurences[candidate].length !== HOUSE_OCCURENCES_FOR_VALID_CANDIDATE
        )
            delete candidatesOccurences[candidate]
    }
}

export const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

const removableNotesInCrossHouse = ({ cells, candidate, type: houseType }, notesData) => {
    // TODO: change this variable name. too long
    const MIN_CROSS_HOUSE_OCCURENCES_IN_NOTES_REMOVING_XWING = 3

    const anyCellOfEachHouse = cells[0]
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

export const areXWingCells = (firstHouseCells, secondHouseCells) => {
    for (let i = 0; i < firstHouseCells.length; i++) {
        const cellsPair = [firstHouseCells[i], secondHouseCells[i]]
        const sameLevelVerticallyOrHorizontally = areSameRowCells(cellsPair) || areSameColCells(cellsPair)
        if (!sameLevelVerticallyOrHorizontally) return false
    }
    return true
}

// these legs belong to same candidate and from same houseType
const areValidXWingLegs = (legA, legB) => {
    const xWing = {
        cells: [legA.cells, legB.cells],
        candidate: legA.candidate,
        type: legA.house.type,
    }    
    return areXWingCells(legA.cells, legB.cells) && isHintValid({ type: HINTS_IDS.X_WING, data: xWing })
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
    deleteInvalidCandidates(candidatesHostCells)

    for (let note=1;note<=9;note++) {
        if (!candidatesHostCells[note]) continue
        result.push({ candidate: note, cells: candidatesHostCells[note] })
    }

    return result
}

const addCandidateXWingLeg = ({ candidate, house, cells }, candidateXWingLegs) => {
    if (!candidateXWingLegs[candidate]) candidateXWingLegs[candidate] = {}
    if (!candidateXWingLegs[candidate][house.type]) candidateXWingLegs[candidate][house.type] = []
    candidateXWingLegs[candidate][house.type].push({ candidate, house, cells })
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []
    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]

    // for each note, in each house type
    const candidateXWingLegs = {}
    searchableHouses.forEach((houseType) => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const house = { type: houseType, num: houseNum }
            const housePossibleXWingLegs = getHouseXWingLegs(house, mainNumbers, notesData)
            housePossibleXWingLegs.forEach((xWingLeg) => {
                addCandidateXWingLeg({ ...xWingLeg, house }, candidateXWingLegs)
            })
        }
    })

    for (const candidate in candidateXWingLegs) {
        searchableHouses.forEach((houseType) => {
            const candidateXWingLegsInHouses = candidateXWingLegs[candidate][houseType]
            for (let i=0;i<candidateXWingLegsInHouses.length;i++) {
                for (let j=i+1;j<candidateXWingLegsInHouses.length;j++) {
                    const firsLeg = candidateXWingLegsInHouses[i]
                    const secondLeg = candidateXWingLegsInHouses[j]
                    if (areValidXWingLegs(firsLeg, secondLeg)) {
                        result.push({
                            cells: [firsLeg.cells, secondLeg.cells],
                            candidate: firsLeg.candidate,
                            type: firsLeg.house.type,
                        })
                    }
                }
            }
        })
    }

    return result
}

export const getXWingHints = (mainNumbers, notesData) => {
    const xWings = getAllXWings(mainNumbers, notesData).filter(xWing => {
        return removableNotesInCrossHouse(xWing, notesData)
    })

    return getUIHighlightData(xWings, notesData)
}
