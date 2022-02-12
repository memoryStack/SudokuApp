import { N_CHOOSE_K } from '../../../../../resources/constants'
import { consoleLog, getRowAndCol } from '../../../../../utils/util'
import { HOUSE_TYPE } from '../../smartHint'
import { areSameCells, isCellEmpty } from '../../util'

const getRowHouseCells = houseNum => {
    const result = []
    for (let col = 0; col < 9; col++) {
        result.push({ row: houseNum, col })
    }
    return result
}

const getColHouseCells = houseNum => {
    const result = []
    for (let row = 0; row < 9; row++) {
        result.push({ row, col: houseNum })
    }
    return result
}

const getBlockHouseCells = houseNum => {
    const result = []
    for (let box = 0; box < 9; box++) {
        result.push(getRowAndCol(houseNum, box))
    }
    return result
}

const getHouseCells = (houseType, houseNum) => {
    if (houseType === HOUSE_TYPE.ROW) return getRowHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.COL) return getColHouseCells(houseNum)
    if (houseType === HOUSE_TYPE.BLOCK) return getBlockHouseCells(houseNum)
    throw 'invalid house type'
}

const isValidCandidate = (candidateOccurencesCount, groupCandidatesCount) => {
    if (groupCandidatesCount === 2) return candidateOccurencesCount === groupCandidatesCount
    if (groupCandidatesCount === 3)
        return candidateOccurencesCount >= 2 && candidateOccurencesCount <= groupCandidatesCount
}

export const validCandidatesInHouseAndTheirLocations = (
    houseType,
    houseNum,
    groupCandidatesCount,
    mainNumbers,
    notesData,
) => {
    const houseCells = getHouseCells(houseType, houseNum)
    const candidatesHostCells = {}
    houseCells.forEach(cell => {
        if (isCellEmpty(cell, mainNumbers)) {
            const cellNotes = notesData[cell.row][cell.col]
            cellNotes.forEach(note => {
                if (note.show) {
                    const noteValue = note.noteValue
                    if (!candidatesHostCells[noteValue]) candidatesHostCells[noteValue] = []
                    candidatesHostCells[noteValue].push(cell)
                }
            })
        }
    })

    const result = []
    for (let candidate = 1; candidate <= 9; candidate++) {
        const candidateOccurencesCount = (candidatesHostCells[candidate] || []).length
        if (isValidCandidate(candidateOccurencesCount, groupCandidatesCount)) {
            result.push({
                candidate,
                hostCells: candidatesHostCells[candidate],
            })
        }
    }
    return result
}

// const getCellNum = (cell) => {
//     return cell.row * 9 + cell.col
// }

const isCellExists = (cell, store) => store.some(storedCell => areSameCells(storedCell, cell))

const findHiddenGroupsFromValidCandidates = (validCandidates, groupCandidatesCount, houseType, houseNum) => {
    // TODO: put some thought into this condition here
    if (validCandidates.length > 6)
        throw `to many valid candidates in house for hidden ${groupCandidatesCount}. unicorn is here ??`

    const result = []
    const N = validCandidates.length
    const K = groupCandidatesCount
    N_CHOOSE_K[N][K].forEach(selection => {
        const groupCandidates = []
        const groupCells = []
        selection.forEach(idx => {
            const candidateHostCells = validCandidates[idx].hostCells
            groupCandidates.push(validCandidates[idx].candidate)
            candidateHostCells.forEach(cell => {
                if (!isCellExists(cell, groupCells)) groupCells.push(cell)
            })
        })

        if (groupCells.length === groupCandidatesCount) {
            result.push({
                house: { type: houseType, num: houseNum },
                groupCandidates,
                groupCells,
            })
        }
    })
    return result
}

// right now it's producing the naked group as well. fix it.
const getAllHiddenGroups = (groupCandidatesCount, notesData, mainNumbers) => {
    const result = []
    const houseIterationOrder = [HOUSE_TYPE.BLOCK, HOUSE_TYPE.ROW, HOUSE_TYPE.COL]
    houseIterationOrder.forEach(houseType => {
        for (let houseNum = 0; houseNum < 9; houseNum++) {
            const validCandidatesWithLocations = validCandidatesInHouseAndTheirLocations(
                houseType,
                houseNum,
                groupCandidatesCount,
                mainNumbers,
                notesData,
            )

            if (validCandidatesWithLocations.length >= 2) {
                result.push(
                    ...findHiddenGroupsFromValidCandidates(
                        validCandidatesWithLocations,
                        groupCandidatesCount,
                        houseType,
                        houseNum,
                    ),
                )
            }
        }
    })

    return result
}

export { getAllHiddenGroups }
