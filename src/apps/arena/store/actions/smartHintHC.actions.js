import { EVENTS } from '../../../../constants/events'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { emit } from '../../../../utils/GlobalEventBus'
import { consoleLog } from '../../../../utils/util'
import cloneDeep from 'lodash/src/utils/cloneDeep'
import { cellHasTryOutInput } from '../../smartHintHC/helpers'
import { getSmartHint } from '../../utils/smartHint'
import { NO_HINTS_FOUND_POPUP_TEXT } from '../../utils/smartHints/constants'
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
import { getMainNumbers, getNotesInfo } from '../selectors/board.selectors'
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
    setHints,
    resetState,
    setTryOutSelectedCell,
    updateBoardDataOnTryOutNumberInput,
    updateBoardDataOnTryOutErase,
} = smartHintHCActions

const getNoHintsFoundMsg = id => {
    return `no ${NO_HINTS_FOUND_POPUP_TEXT[id]} found. try other hints or try filling some more guesses.`
}

export const showHints = async hintId => {
    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    consoleLog('@@@@@@ notes', JSON.stringify(notesInfo))
    consoleLog('@@@@@@ mainNumbers', JSON.stringify(mainNumbers))

    return getSmartHint(mainNumbers, notesInfo, hintId)
        .then(hints => {
            consoleLog('@@@@ hintInfo', JSON.stringify(hints))
            if (hints) {
                invokeDispatch(setHints({
                    mainNumbers: hints[0].hasTryOut ? cloneDeep(mainNumbers) : null,
                    notesInfo: hints[0].hasTryOut ? cloneDeep(notesInfo) : null,
                    hints,
                }))
                return true
            } else {
                emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                    msg: getNoHintsFoundMsg(hintId),
                    visibleTime: 5000,
                })
                return false
            }
        })
        .catch(error => {
            // TODO: make the popup scrollable for very long systraces
            consoleLog(error)
            if (__DEV__) {
                emit(EVENTS.LOCAL.SHOW_SNACK_BAR, {
                    msg: JSON.stringify(error.stack),
                    visibleTime: 10000,
                })
            }
            return false
        })
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
    const notesInfo = getTryOutNotes(getStoreState())
    return (
        isCellEmpty(selectedCell, mainNumbers) &&
        isCellNoteVisible(number, notesInfo[selectedCell.row][selectedCell.col])
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
    const notesInfo = getTryOutNotes(getStoreState())
    focusedCells.forEach(cell => {
        if (areSameCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: getCellVisibleNotes(notesInfo[cell.row][cell.col]),
            })
        } else {
            // TODO: can make it better
            if (
                isCellNoteVisible(inputNumber, notesInfo[cell.row][cell.col]) &&
                areCommonHouseCells(cell, selectedCell)
            ) {
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

    const mainNumbersStateAfterErase = cloneDeep(tryOutMainNumbers)
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
