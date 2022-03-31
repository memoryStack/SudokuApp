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
