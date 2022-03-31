import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'

import {
    setMainNumbers,
    setCellMainNumber,
    eraseCellMainValue,
    setSelectedCell,
    setNotes,
    setNotesBunch,
    eraseNotesBunch,
} from '../reducers/board.reducers'
import { getNotesInfo } from '../selectors/board.selectors'

export const updateMainNumbers = mainNumbers => {
    if (!mainNumbers) return
    invokeDispatch(setMainNumbers(mainNumbers))
}

export const updateCellMainNumber = (cell, number) => {
    invokeDispatch(
        setCellMainNumber({
            cell,
            number,
        }),
    )
}

export const removeMainNumber = cell => {
    invokeDispatch(eraseCellMainValue(cell))
}

export const updateSelectedCell = cell => {
    if (!cell) return
    invokeDispatch(setSelectedCell(cell))
}

export const updateNotes = notes => {
    if (!notes) return
    invokeDispatch(setNotes(notes))
}

export const removeCellNotes = cell => {
    const bunch = []
    const notesInfo = getNotesInfo(getStoreState())
    notesInfo[cell.row][cell.col].forEach(({ noteValue, show }) => {
        if (show) bunch.push({ cell, note: noteValue })
    })
    // TODO: should we shift logic from stateHandlers to here ??
    invokeDispatch(eraseNotesBunch(bunch))
}

export const addCellNote = (cell, number) => {
    const bunch = [{ cell, note: number }]
    invokeDispatch(setNotesBunch(bunch))
}

export const removeCellNote = (cell, number) => {
    const bunch = [{ cell, note: number }]
    invokeDispatch(eraseNotesBunch(bunch))
}

// TODO: tranfrom it for movesData
// TODO: add the removed notes in cells other than currentCell to the undo move
//          right now we are just recording the current cells notes only
export const removeNotesAfterCellFilled = (number, cell) => {
    // TODO: is this notesInfo mutable or not ??
    const notesInfo = getNotesInfo(getStoreState())
    const { row, col } = cell
    let notesErasedByMainValue = []
    // remove notes from current cell
    const bunch = []
    for (let note = 0; note < 9; note++) {
        // taking note's indx
        const { show } = notesInfo[row][col][note]
        if (show) {
            notesErasedByMainValue.push(note + 1)
            notesInfo[row][col][note].show = 0
            bunch.push({ cell, note: note + 1 })
        }
    }
    if (notesErasedByMainValue.length) notesInfo[row][col] = [...notesInfo[row][col]]

    const houses = [
        {
            type: HOUSE_TYPE.ROW,
            num: row,
        },
        {
            type: HOUSE_TYPE.COL,
            num: col,
        },
        {
            type: HOUSE_TYPE.BLOCK,
            num: getBlockAndBoxNum(cell).blockNum,
        },
    ]

    houses.forEach(({ type, num }) => {
        getHouseCells(type, num).forEach(({ row, col }) => {
            const { show } = notesInfo[row][col][number - 1]
            if (show) {
                notesInfo[row][col][number - 1].show = 0
                notesInfo[row][col] = [...notesInfo[row][col]]
                bunch.push({ cell: { row, col }, note: number })
            }
        })
    })

    invokeDispatch(eraseNotesBunch(bunch))

    return notesErasedByMainValue
}
