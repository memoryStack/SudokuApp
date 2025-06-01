import _isEmpty from "@lodash/isEmpty"
import _cloneDeep from "@lodash/cloneDeep"
import _isNil from "@lodash/isNil"

import { MainNumbersRecord } from "@domain/board/records/mainNumbersRecord"
import { NotesRecord } from "@domain/board/records/notesRecord"

import type { SmartHintRepository } from '../../adapterInterfaces/stateManagers/smartHintHCRepository'
import type { Dependencies } from "../../type"
import { areCommonHouseCells, areSameCells, getCellAxesValues } from "@domain/board/utils/housesAndCells"
import { isMainNumberPresentInAnyHouseOfCell } from "@domain/board/utils/common"
import { cellHasTryOutInput } from "./utils"
import { INACTIVITY_THRESHOLD_FOR_HINT_SUGGESTION } from "@application/constants"
import { GameState } from "@application/utils/gameState"
import { Time } from '../../adapterInterfaces/stateManagers/refreeRepository'
import { MAX_HINTS_MENU_TOOLTIP_SHOWN_COUNT } from "@application/adapterInterfaces/coachMarks"

const SNACKBAR_VISIBLE_TIME = 4000

export const isValidInputNumberClick = (number: MainNumberValue, smartHintRepository: SmartHintRepository) => {
    const selectedCell = smartHintRepository.getTryOutSelectedCell() as Cell
    const mainNumbers = smartHintRepository.getTryOutMainNumbers() as MainNumbers
    const notes = smartHintRepository.getTryOutNotes() as Notes
    return !MainNumbersRecord.isCellFilled(mainNumbers, selectedCell)
        && NotesRecord.isNotePresentInCell(notes, number, selectedCell)
}

const isRestrictedInputClick = (inputNumber: MainNumberValue, smartHintRepository: SmartHintRepository) => {
    const cellsRestrictedNumberInputs = smartHintRepository.getTryOutCellsRestrictedNumberInputs()
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    // TODO: change getCellAxesValues as a key to a simple number
    const selectedCellAxesValue = getCellAxesValues(selectedCell)
    return (cellsRestrictedNumberInputs[selectedCellAxesValue] || []).includes(inputNumber)
}

const getRemovalbeNotesHostCells = (
    inputNumber: MainNumberValue,
    focusedCells: Cell[],
    selectedCell: Cell,
    notes: Notes
) => {
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

export const inputTryOutNumberUseCase = (
    number: MainNumberValue,
    focusedCells: Cell[],
    snackBarCustomStyles: any,
    dependencies: Dependencies
) => {
    const { smartHintRepository, snackBarAdapter, sound } = dependencies
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    if (_isEmpty(selectedCell)) {
        snackBarAdapter.show({
            msg: 'please select some cell before filling number',
            visibleTime: SNACKBAR_VISIBLE_TIME,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    if (!isValidInputNumberClick(number, smartHintRepository)) {
        snackBarAdapter.show({
            msg: `try filling cell which is empty and has ${number} as a candidate there`,
            visibleTime: SNACKBAR_VISIBLE_TIME,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    if (isRestrictedInputClick(number, smartHintRepository)) {
        snackBarAdapter.show({
            msg: smartHintRepository.getTryOutCellsRestrictedNumberInputsMsg(),
            visibleTime: SNACKBAR_VISIBLE_TIME,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    smartHintRepository.updateBoardDataOnTryOutNumberInput({
        inputNumber: number,
        removableNotes: getRemovalbeNotesHostCells(number, focusedCells, selectedCell, smartHintRepository.getTryOutNotes()),
    })

    sound?.play?.()
}

const shouldSpawnNoteInCell = (
    note: NoteValue,
    cell: Cell,
    mainNumbersStateAfterErase: MainNumbers,
    dependencies: Dependencies
) => {
    const { smartHintRepository, boardRepository } = dependencies
    const actualNotesInfo = boardRepository.getNotes()
    const tryOutNotesInfo = smartHintRepository.getTryOutNotes()
    return (
        NotesRecord.isNotePresentInCell(actualNotesInfo, note, cell)
        && !NotesRecord.isNotePresentInCell(tryOutNotesInfo, note, cell)
        && !isMainNumberPresentInAnyHouseOfCell(note, cell, mainNumbersStateAfterErase)
    )
}

const getNotesToEnterHostCells = (focusedCells: Cell[], dependencies: Dependencies) => {
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
                notes: NotesRecord.getCellVisibleNotesList(actualNotesInfo, cell)
                    .filter(note => shouldSpawnNoteInCell(note, cell, mainNumbersStateAfterErase, dependencies)),
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

export const eraseTryOutNumberUseCase = (
    focusedCells: Cell[],
    snackBarCustomStyles: any,
    dependencies: Dependencies
) => {
    const { smartHintRepository, boardRepository, snackBarAdapter, sound } = dependencies
    const selectedCell = smartHintRepository.getTryOutSelectedCell()
    if (_isNil(selectedCell)) return

    const boardMainNumbers = {
        tryOutMainNumbers: smartHintRepository.getTryOutMainNumbers(),
        actualMainNumbers: boardRepository.getMainNumbers(),
    }
    if (!cellHasTryOutInput(selectedCell, boardMainNumbers)) {
        snackBarAdapter.show({
            msg: 'you can only erase from cells which were filled after this hint is displayed',
            visibleTime: SNACKBAR_VISIBLE_TIME,
            customStyles: snackBarCustomStyles,
        })
        return
    }

    const notesToBeSpawned = getNotesToEnterHostCells(focusedCells, dependencies)
    smartHintRepository.updateBoardDataOnTryOutErase(notesToBeSpawned)
    sound?.play?.()
}

export const showHowToGetHintsCoachMarksUseCase = async (
    availableHints: number,
    dependencies: Dependencies
): Promise<boolean> => {
    if (availableHints) return false

    const {
        smartHintRepository,
        coachMarksAdapter,
    } = dependencies

    const userSawAHintYet = false // await smartHintRepository.getUserSawAHint()
    const userLearnedToGetHints = await coachMarksAdapter.getUserLearnedToGetHints()

    return !userSawAHintYet && !userLearnedToGetHints
}

// TODO: this is copied from arena utils, take care of it
export const getTimeDifferenceInSeconds = (timeA: Time, timeB: Time) => {
    const timeAInSeconds = timeA.hours * 3600 + timeA.minutes * 60 + timeA.seconds;
    const timeBInSeconds = timeB.hours * 3600 + timeB.minutes * 60 + timeB.seconds;
    return Math.abs(timeAInSeconds - timeBInSeconds);
}

export const shouldShowHintsMenuTooltip = async (dependencies: Dependencies) => {
    const {
        gameStateRepository,
        coachMarksAdapter,
        refreeRepository,
        smartHintRepository
    } = dependencies

    if (!new GameState(gameStateRepository.getGameState()).isGameActive() || smartHintRepository.getShowSmartHint()) return

    const inactivityTime = getTimeDifferenceInSeconds(refreeRepository.getLastActivityTime(), refreeRepository.getTime())

    const inactivityThreshold = INACTIVITY_THRESHOLD_FOR_HINT_SUGGESTION[refreeRepository.getGameLevel()]
        || INACTIVITY_THRESHOLD_FOR_HINT_SUGGESTION.DEFAULT

    if (Math.abs(inactivityThreshold - inactivityTime) < 5) return false

    return await coachMarksAdapter.getHintsMenuTooltipCount() < MAX_HINTS_MENU_TOOLTIP_SHOWN_COUNT
}
