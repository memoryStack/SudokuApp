import { getHouseCells } from '../../houseCells'
import { areSameColCells, areSameRowCells, getHousePossibleNotes, isCellEmpty } from '../../util'
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

const findAllXWingsInHousesPair = (candidatesInFirstHouse, candidatesInSecondHouse, houseType) => {
    const result = []
    Object.keys(candidatesInFirstHouse).forEach(candidate => {
        const firstHouseCells = candidatesInFirstHouse[candidate]
        const secondHouseCells = candidatesInSecondHouse[candidate]
        const candidateNum = parseInt(candidate, 10)
        const xWing = {
            cells: [firstHouseCells, secondHouseCells],
            candidate: candidateNum,
            type: houseType,
        }
        if (
            firstHouseCells &&
            secondHouseCells &&
            areXWingCells(firstHouseCells, secondHouseCells) &&
            isHintValid({ type: HINTS_IDS.X_WING, data: xWing })
        ) {
            result.push(xWing)
        }
    })
    return result
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
        result.push({ candidate: note,cells: candidatesHostCells[note] })
    }

    return result
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []
    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]

    // const housesXWingLegs = {
    //     [HOUSE_TYPE.COL]: [],
    //     [HOUSE_TYPE.ROW]: [],
    // }
    // searchableHouses.forEach((houseType) => {
    //     for (let houseNum = 0; houseNum < 9; houseNum++) {

    //         const housePossibleXWingLegs = [] // return an array


    //     }
    // })

    searchableHouses.forEach(houseType => {
        for (let firstHouseNum = 0; firstHouseNum < 9; firstHouseNum++) {
            for (let secondHouseNum = firstHouseNum + 1; secondHouseNum < 9; secondHouseNum++) {
                const candidatesInFirstHouse = getAllCandidatesOccurencesInHouse(
                    firstHouseNum,
                    houseType,
                    notesData,
                    mainNumbers,
                )
                deleteInvalidCandidates(candidatesInFirstHouse)

                const candidatesInSecondHouse = getAllCandidatesOccurencesInHouse(
                    secondHouseNum,
                    houseType,
                    notesData,
                    mainNumbers,
                )
                deleteInvalidCandidates(candidatesInSecondHouse)

                const xWingsInHouses = findAllXWingsInHousesPair(
                    candidatesInFirstHouse,
                    candidatesInSecondHouse,
                    houseType,
                )

                result.push(...xWingsInHouses)
            }
        }
    })

    return result
}

export const getXWingHints = (mainNumbers, notesData) => {
    const xWings = getAllXWings(mainNumbers, notesData).filter(xWing => {
        return removableNotesInCrossHouse(xWing, notesData)
    })

    return getUIHighlightData(xWings, notesData)
}
