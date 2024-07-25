import _cloneDeep from '@lodash/cloneDeep'
import _isEmpty from '@lodash/isEmpty'
import _isNil from '@lodash/isNil'

import { EVENTS } from '../../../../constants/events'
import { emit } from '../../../../utils/GlobalEventBus'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { NotesRecord } from '@domain/board/records/notesRecord'

import { cellHasTryOutInput } from '../../smartHintHC/helpers'
import {
    areCommonHouseCells,
    areSameCells,
    isMainNumberPresentInAnyHouseOfCell,
    getCellAxesValues,
} from '../../utils/util'

/* Try Out actions */
export const inputTryOutNumber = (number, focusedCells, snackBarCustomStyles, dependencies) => {
    const { smartHintRepository } = dependencies
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    if (_isEmpty(selectedCell)) {
        showSnackBar({
            msg: 'please select some cell before filling number',
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    if (!isValidInputNumberClick(number, smartHintRepository)) {
        showSnackBar({
            msg: `try filling cell which is empty and has ${number} as a candidate there`,
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    if (isRestrictedInputClick(number, smartHintRepository)) {
        showSnackBar({
            msg: smartHintRepository.getTryOutCellsRestrictedNumberInputsMsg(),
            customStyles: snackBarCustomStyles,
        })
        return {}
    }

    return {
        inputNumber: number,
        removableNotes: getRemovalbeNotesHostCells(number, focusedCells, selectedCell, smartHintRepository.getTryOutNotes()),
    }
}

const isValidInputNumberClick = (number, smartHintRepository) => {
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    const mainNumbers = smartHintRepository.getTryOutMainNumbers()
    const notes = smartHintRepository.getTryOutNotes()
    return !MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && NotesRecord.isNotePresentInCell(notes, number, selectedCell)
}

const isRestrictedInputClick = (inputNumber, smartHintRepository) => {
    const cellsRestrictedNumberInputs = smartHintRepository.getTryOutCellsRestrictedNumberInputs()
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
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

const getRemovalbeNotesHostCells = (inputNumber, focusedCells, selectedCell, notes) => {
    const result = []

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

export const eraseTryOutNumber = (focusedCells, snackBarCustomStyles, dependencies) => {
    const { smartHintRepository, boardRepository } = dependencies
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    if (_isNil(selectedCell)) return []

    const boardMainNumbers = {
        tryOutMainNumbers: smartHintRepository.getTryOutMainNumbers(),
        actualMainNumbers: boardRepository.getMainNumbers(),
    }
    if (!cellHasTryOutInput(selectedCell, boardMainNumbers)) {
        showSnackBar({
            msg: 'you can only erase from cells which were filled after this hint is displayed',
            customStyles: snackBarCustomStyles,
        })
        return []
    }

    return getNotesToEnterHostCells(focusedCells, dependencies)
}

const getNotesToEnterHostCells = (focusedCells, dependencies) => {
    const { smartHintRepository, boardRepository } = dependencies

    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    const tryOutMainNumbers = smartHintRepository.getTryOutMainNumbers()
    const numberToBeErased = MainNumbersRecord.getCellMainValue(tryOutMainNumbers, selectedCell)

    // TODO: make it efficient

    const mainNumbersStateAfterErase = _cloneDeep(tryOutMainNumbers)
    mainNumbersStateAfterErase[selectedCell.row][selectedCell.col].value = 0

    const result = []
    const actualNotesInfo = boardRepository.getNotes()
    focusedCells.forEach(cell => {
        if (areSameCells(cell, selectedCell)) {
            result.push({
                cell,
                notes: NotesRecord.getCellVisibleNotesList(actualNotesInfo, cell).filter(note => shouldSpawnNoteInCell(note, cell, mainNumbersStateAfterErase, dependencies)),
            })
        } else if (
            !MainNumbersRecord.isCellFilled(tryOutMainNumbers, cell)
            && shouldSpawnNoteInCell(numberToBeErased, cell, mainNumbersStateAfterErase, dependencies)
        ) {
            result.push({
                cell,
                notes: [numberToBeErased],
            })
        }
    })

    return result
}

const shouldSpawnNoteInCell = (note, cell, mainNumbersStateAfterErase, dependencies) => {
    const { smartHintRepository, boardRepository } = dependencies
    const actualNotesInfo = boardRepository.getNotes()
    const tryOutNotesInfo = smartHintRepository.getTryOutNotes()
    return (
        NotesRecord.isNotePresentInCell(actualNotesInfo, note, cell)
        && !NotesRecord.isNotePresentInCell(tryOutNotesInfo, note, cell)
        && !isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbersStateAfterErase)
    )
}
