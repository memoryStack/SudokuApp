import _cloneDeep from '@lodash/cloneDeep'
import _isEmpty from '@lodash/isEmpty'
import _isNil from '@lodash/isNil'

import { EVENTS } from '../../../../constants/events'
import { getStoreState } from '../../../../redux/dispatch.helpers'
import { emit } from '../../../../utils/GlobalEventBus'
import { MainNumbersRecord } from '../../RecordUtilities/boardMainNumbers'
import { NotesRecord } from '../../RecordUtilities/boardNotes'

import { cellHasTryOutInput } from '../../smartHintHC/helpers'
import {
    areCommonHouseCells,
    areSameCells,
    isMainNumberPresentInAnyHouseOfCell,
    getCellAxesValues,
} from '../../utils/util'
import { getNotesInfo } from '../selectors/board.selectors'
import {
    getTryOutCellsRestrictedNumberInputs,
    getTryOutCellsRestrictedNumberInputsMsg,
    getTryOutMainNumbers,
    getTryOutNotes,
    getTryOutSelectedCell,
} from '../selectors/smartHintHC.selectors'

/* Try Out actions */
export const inputTryOutNumber = (number, focusedCells, snackBarCustomStyles) => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    if (_isEmpty(selectedCell)) {
        showSnackBar({
            msg: 'please select some cell before filling number',
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    if (!isValidInputNumberClick(number)) {
        showSnackBar({
            msg: `try filling cell which is empty and has ${number} as a candidate there`,
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    if (isRestrictedInputClick(number)) {
        showSnackBar({
            msg: getTryOutCellsRestrictedNumberInputsMsg(getStoreState()),
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    return {
        inputNumber: number,
        removableNotes: getRemovalbeNotesHostCells(number, focusedCells),
    }
}

const isValidInputNumberClick = number => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    const mainNumbers = getTryOutMainNumbers(getStoreState())
    const notes = getTryOutNotes(getStoreState())
    return !MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && NotesRecord.isNotePresentInCell(notes, number, selectedCell)
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
                notes: NotesRecord.getCellVisibleNotesList(notes, cell),
            })
        } else if (NotesRecord.isNotePresentInCell(notes, inputNumber, cell) && areCommonHouseCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: [inputNumber],
            })
        }
    })

    return result
}

export const eraseTryOutNumber = (focusedCells, snackBarCustomStyles) => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    if (_isNil(selectedCell)) return []

    if (!cellHasTryOutInput(selectedCell)) {
        showSnackBar({
            msg: 'you can only erase from cells which were filled after this hint is displayed',
            customStyles: snackBarCustomStyles,
        })
        return []
    }

    return getNotesToEnterHostCells(focusedCells)
}

const getNotesToEnterHostCells = focusedCells => {
    const selectedCell = getTryOutSelectedCell(getStoreState())
    const tryOutMainNumbers = getTryOutMainNumbers(getStoreState())
    const actualNotesInfo = getNotesInfo(getStoreState())

    const numberToBeErased = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, selectedCell)

    // TODO: make it efficient

    const mainNumbersStateAfterErase = _cloneDeep(tryOutMainNumbers)
    mainNumbersStateAfterErase[selectedCell.row][selectedCell.col].value = 0

    const result = []
    focusedCells.forEach(cell => {
        if (areSameCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: NotesRecord.getCellVisibleNotesList(actualNotesInfo, cell).filter(note => shouldSpawnNoteInCell(note, cell, mainNumbersStateAfterErase)),
            })
        } else if (
            !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
            && shouldSpawnNoteInCell(numberToBeErased, cell, mainNumbersStateAfterErase)
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
        NotesRecord.isNotePresentInCell(actualNotesInfo, note, cell)
        && !NotesRecord.isNotePresentInCell(tryOutNotesInfo, note, cell)
        && !isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbersStateAfterErase)
    )
}
