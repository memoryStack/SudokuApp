import { getHouseCells } from '../../houseCells'
import { getCellHouseInfo } from '../../util'

export const isValidHiddenSingle = ({ type, cell, candidate }, _, possibleNotes) => {
    const { num: houseNum, type: houseType } = getCellHouseInfo(type, cell)
    const houseCells = getHouseCells(houseType, houseNum)

    let candidatePossibleNotes = 0
    houseCells.forEach(({ row, col }) => {
        if (possibleNotes[row][col][candidate - 1].show) candidatePossibleNotes++
    })
    return candidatePossibleNotes === 1
}
