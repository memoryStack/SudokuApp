import { getHouseCells } from '../../houseCells'
import { areSameColCells, areSameRowCells, isCellEmpty } from '../../util'
import { HOUSE_TYPE } from '../constants'
import { getUIHighlightData } from './uiHighlightData'

// houseType will be row or col only for the current use case
const getEmptyCellsInHouse = (houseNum, houseType, mainNumbers) => {
    const result = []
    for (let cellNo = 0; cellNo < 9; cellNo++) {
        const row = houseType === HOUSE_TYPE.ROW ? houseNum : cellNo
        const col = houseType === HOUSE_TYPE.COL ? houseNum : cellNo
        if (isCellEmpty({ row, col }, mainNumbers)) result.push({ row, col })
    }
    return result
}

// TODO: should we test helper funcs like this as well in TDD ??
const getCandidatesOccurencesInHouse = (houseNum, houseType, notesData, mainNumbers) => {
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
    for (let candidate = 1; candidate <= 9; candidate++) {
        if (candidatesOccurences[candidate] && candidatesOccurences[candidate].length !== 2)
            delete candidatesOccurences[candidate]
    }
}

// we will receive two houses cells and checking if these 4 cells make a X-Wing or not
const areHostCells = (firstHouseCells, secondHouseCells) => {
    for (let i = 0; i < firstHouseCells.length; i++) {
        // TODO: better naming
        const cellsArray = [firstHouseCells[i], secondHouseCells[i]]
        if (!(areSameRowCells(cellsArray) || areSameColCells(cellsArray))) return false
    }
    return true
}

// TODO: change the name.
// this func checks if the X-Wing will remove some notes in the cross-house type or not
const removesSomeNotes = ({ cells, candidate, type: houseType }, notesData) => {
    const firstHouseCells = cells[0]

    // get cross houses cells
    let result = true
    firstHouseCells.forEach(({ row, col }) => {
        const crossHouseType = houseType === HOUSE_TYPE.ROW ? HOUSE_TYPE.COL : HOUSE_TYPE.ROW
        const houseNum = crossHouseType === HOUSE_TYPE.ROW ? row : col
        const crossHouseCells = getHouseCells(crossHouseType, houseNum)

        let candidateInstancesCount = 0
        crossHouseCells.forEach(({ row, col }) => {
            if (notesData[row][col][candidate - 1].show) candidateInstancesCount++
        })

        if (candidateInstancesCount < 3) result = false
    })

    return result
}

// naming
const xxx_findCandidate = (candidatesInFirstHouse, candidatesInSecondHouse, houseType) => {
    const result = []
    Object.keys(candidatesInFirstHouse).forEach(candidate => {
        const firstHouseCells = candidatesInFirstHouse[candidate]
        const secondHouseCells = candidatesInSecondHouse[candidate]
        if (firstHouseCells && secondHouseCells && areHostCells(firstHouseCells, secondHouseCells)) {
            // also check if these host cells make an impact or not ??
            result.push({
                cells: [firstHouseCells, secondHouseCells],
                candidate: parseInt(candidate, 10),
                type: houseType,
            })
        }
    })
    return result
}

export const getXWing = (mainNumbers, notesData) => {
    const houseTypes = [HOUSE_TYPE.COL, HOUSE_TYPE.ROW]
    const result = []

    houseTypes.forEach(houseType => {
        for (let firstHouseNum = 0; firstHouseNum < 9; firstHouseNum++) {
            for (let secondHouseNum = firstHouseNum + 1; secondHouseNum < 9; secondHouseNum++) {
                const candidatesInFirstHouse = getCandidatesOccurencesInHouse(
                    firstHouseNum,
                    houseType,
                    notesData,
                    mainNumbers,
                )
                deleteInvalidCandidates(candidatesInFirstHouse)

                const candidatesInSecondHouse = getCandidatesOccurencesInHouse(
                    secondHouseNum,
                    houseType,
                    notesData,
                    mainNumbers,
                )
                deleteInvalidCandidates(candidatesInSecondHouse)

                let xWingsInHouses = xxx_findCandidate(
                    candidatesInFirstHouse,
                    candidatesInSecondHouse,
                    houseType,
                ).filter(xWing => {
                    return removesSomeNotes(xWing, notesData)
                })
                result.push(...xWingsInHouses)
            }
        }
    })

    return result
}

export const getXWingHintData = (mainNumbers, notesData) => {
    const xWings = getXWing(mainNumbers, notesData)
    return getUIHighlightData(xWings, notesData)
}
