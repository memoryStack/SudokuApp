import { getStoreState, invokeDispatch } from "../../../../redux/dispatch.helpers"

import { setMainNumbers, setCellMainNumber, eraseCellMainValue } from '../reducers/board.reducers'

export const updateMainNumbers = (mainNumbers) => {
    invokeDispatch(setMainNumbers(mainNumbers))
}

export const updateCellMainNumber = (cell, number) => {
    invokeDispatch(setCellMainNumber({
        cell,
        number,
    }))
}

export const removeMainNumber = (cell) => {
    invokeDispatch(eraseCellMainValue(cell))
}
