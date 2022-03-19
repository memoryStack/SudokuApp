import { getHouseCells } from '../../houseCells'
import { areSameColCells, areSameRowCells, isCellEmpty } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { getUIHighlightData } from './uiHighlightData'

const getEmptyCellsInHouse = (houseNum, houseType, mainNumbers) => {
    const result = []
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const row = houseType === HOUSE_TYPE.ROW ? houseNum : cellNo
        const col = houseType === HOUSE_TYPE.COL ? houseNum : cellNo
        if (isCellEmpty({ row, col }, mainNumbers)) result.push({ row, col })
    }
    return result
}

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

const getCrossHouseType = houseType => (houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW)

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

const areXWingCells = (firstHouseCells, secondHouseCells) => {
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
        if (firstHouseCells && secondHouseCells && areXWingCells(firstHouseCells, secondHouseCells)) {
            result.push({
                cells: [firstHouseCells, secondHouseCells],
                candidate: parseInt(candidate, 10),
                type: houseType,
            })
        }
    })
    return result
}

export const getAllXWings = (mainNumbers, notesData) => {
    const result = []
    const searchableHouses = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]
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
