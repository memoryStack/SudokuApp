import { eraseCellUseCase, inputNumberUseCase } from '@application/usecases/board'
import { ACTION_TYPES } from '../inputPanel/constants'
import { isGameActive } from '../utils/util'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import { PENCIL_STATE } from '@application/constants'
import { INPUT_TYPE } from '@application/adapterInterfaces/stateManagers/inputPanelRepository'
import _isEqual from '@lodash/isEqual'

const handleNumberClick = ({ getState, params: { number, isLongPress, notesInput = false } }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardControllerRepository, gameSettingsAdapter, inputPanelRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return
    const isNumberLocked = inputPanelRepository.getIsNumberLocked()
    const numberFillOnCellClickAllowed = gameSettingsAdapter.fillNumberOnCellClick()
    const pencilState = boardControllerRepository.getPencil()
    const inputType = (notesInput || pencilState === PENCIL_STATE.ACTIVE) ? INPUT_TYPE.NOTES : INPUT_TYPE.MAIN_NUMBERS
    if ((isLongPress && numberFillOnCellClickAllowed) || isNumberLocked) {
        const lockedNumber = inputPanelRepository.getLockedNumber()
        const newNumberToLock = { number, type: inputType }
        if (!_isEqual(lockedNumber, newNumberToLock)) inputPanelRepository.setLockedNumber(newNumberToLock)
        else inputPanelRepository.unlockNumber()
        return
    }

    const fillNoteOnShortClick = gameSettingsAdapter.fillNoteOnShortClick()
    const fillAsNote = notesInput || (fillNoteOnShortClick ? !isLongPress : pencilState === PENCIL_STATE.ACTIVE)
    inputNumberUseCase(
        number,
        fillAsNote,
        dependencies,
    )
}

const handleEraserClick = ({ getState }) => {
    const { dependencies } = getState()
    const { gameStateRepository, gameSettingsAdapter, soundAdapter } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    eraseCellUseCase(dependencies, {
        play: () => gameSettingsAdapter.soundsEnabled() && soundAdapter.play(SOUNDS.ERASER_CLICK)
    })
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
