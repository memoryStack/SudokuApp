import _cloneDeep from 'lodash/src/utils/cloneDeep'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { EVENTS } from '../../../../constants/events'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { emit } from '../../../../utils/GlobalEventBus'

import { cellHasTryOutInput } from '../../smartHintHC/helpers'
import { getTransformedRawHints } from '../../utils/smartHints'
import {
    areCommonHouseCells,
    areSameCells,
    duplicacyPresent,
    getCellAxesValues,
    getCellVisibleNotes,
    isCellEmpty,
    isCellNoteVisible,
} from '../../utils/util'
import { smartHintHCActions } from '../reducers/smartHintHC.reducers'
import { getNotesInfo } from '../selectors/board.selectors'
import {
    getTryOutCellsRestrictedNumberInputs,
    getTryOutCellsRestrictedNumberInputsMsg,
    getTryOutMainNumbers,
    getTryOutNotes,
    getTryOutSelectedCell,
} from '../selectors/smartHintHC.selectors'

const {
    removeHints,
    setNextHint,
    setPrevHint,
    resetState,
    setHints,
    setTryOutSelectedCell,
    updateBoardDataOnTryOutNumberInput,
    updateBoardDataOnTryOutErase,
} = smartHintHCActions

export const showHintAction = (hintId, rawHints, mainNumbers, notes) => {
    const hints = getTransformedRawHints(hintId, rawHints, mainNumbers, notes)
    invokeDispatch(
        setHints({
            mainNumbers: hints[0].hasTryOut ? _cloneDeep(mainNumbers) : null,
            notes: hints[0].hasTryOut ? _cloneDeep(notes) : null,
            hints,
        }),
    )
}

export const clearHints = () => {
    invokeDispatch(removeHints())
}

export const showNextHint = () => {
    invokeDispatch(setNextHint())
}

export const showPrevHint = () => {
    invokeDispatch(setPrevHint())
}

export const resetStoreState = () => {
    const newState = {
        show: false,
        currentHintNum: -1,
        hints: [],
    }
    invokeDispatch(resetState(newState))
}

/* Try Out actions */

export const updateTryOutSelectedCell = cell => {
    invokeDispatch(setTryOutSelectedCell(cell))
}

export const inputTryOutNumber = (number, focusedCells, snackBarCustomStyles) => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    if (_isEmpty(selectedCell)) {
        showSnackBar({
            msg: `please select some cell before filling number`,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    if (!isValidInputNumberClick(number)) {
        showSnackBar({
            msg: `try filling cell which is empty and has ${number} as a candidate there`,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    if (isRestrictedInputClick(number)) {
        showSnackBar({
            msg: getTryOutCellsRestrictedNumberInputsMsg(getStoreState()),
            customStyles: snackBarCustomStyles,
        })
        return
    }

    const removalbeNotesHostCellsData = getRemovalbeNotesHostCells(number, focusedCells)
    invokeDispatch(updateBoardDataOnTryOutNumberInput({ removalbeNotesHostCellsData, number }))
}

const isValidInputNumberClick = number => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    const mainNumbers = getTryOutMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    return (
        isCellEmpty(selectedCell, mainNumbers) && isCellNoteVisible(number, notes[selectedCell.row][selectedCell.col])
    )
}

const isRestrictedInputClick = inputNumber => {
    const cellsRestrictedNumberInputs = getTryOutCellsRestrictedNumberInputs(getStoreState())
    const selectedCell = getTryOutSelectedCell(getStoreState())
    const selectedCellAxesValue = getCellAxesValues(selectedCell)
    return (cellsRestrictedNumberInputs[selectedCellAxesValue] || []).includes(inputNumber)
}

const showSnackBar = ({ msg, customStyles = {} }) => {
    emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
        msg,
        visibleTime: 4000,
        customStyles,
    })
}

const getRemovalbeNotesHostCells = (inputNumber, focusedCells) => {
    const result = []

    const selectedCell = getTryOutSelectedCell(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    focusedCells.forEach(cell => {
        if (areSameCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: getCellVisibleNotes(notes[cell.row][cell.col]),
            })
        } else {
            // TODO: can make it better
            if (isCellNoteVisible(inputNumber, notes[cell.row][cell.col]) && areCommonHouseCells(cell, selectedCell)) {
                result.push({
                    cell,
                    notes: [inputNumber],
                })
            }
        }
    })

    return result
}

export const eraseTryOutNumber = (focusedCells, snackBarCustomStyles) => {
    if (!cellHasTryOutInput()) {
        showSnackBar({
            msg: 'you can only erase from cells which were filled after this hint is displayed',
            customStyles: snackBarCustomStyles,
        })
        return
    }

    const notesToEnterHostCellsData = getNotesToEnterHostCells(focusedCells)
    invokeDispatch(updateBoardDataOnTryOutErase(notesToEnterHostCellsData))
}

const getNotesToEnterHostCells = focusedCells => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const actualNotesInfo = getNotesInfo(getStoreState())

    const numberToBeErased = tryOutMainNumbers[selectedCell.row][selectedCell.col].value

    // TODO: make it efficient

    const mainNumbersStateAfterErase = _cloneDeep(tryOutMainNumbers)
    mainNumbersStateAfterErase[selectedCell.row][selectedCell.col].value = 0

    const result = []
    focusedCells.forEach(cell => {
        if (areSameCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: getCellVisibleNotes(actualNotesInfo[cell.row][cell.col]).filter(note => {
                    return shouldSpawnNoteInCell(note, cell, mainNumbersStateAfterErase)
                }),
            })
        } else if (
            isCellEmpty(cell, tryOutMainNumbers) &&
            shouldSpawnNoteInCell(numberToBeErased, cell, mainNumbersStateAfterErase)
        ) {
            result.push({
                cell,
                notes: [numberToBeErased],
            })
        }
    })

    return result
}

const shouldSpawnNoteInCell = (note, cell, mainNumbersStateAfterErase) => {
    const actualNotesInfo = getNotesInfo(getStoreState())
    const tryOutNotesInfo = getTryOutNotes(getStoreState())
    return (
        isCellNoteVisible(note, actualNotesInfo[cell.row][cell.col]) &&
        !isCellNoteVisible(note, tryOutNotesInfo[cell.row][cell.col]) &&
        !duplicacyPresent(note, mainNumbersStateAfterErase, cell)
    )
}
