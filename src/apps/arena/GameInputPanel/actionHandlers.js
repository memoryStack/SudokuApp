import { eraseCellUseCase, inputNumberUseCase } from '@application/usecases/board'
import { ACTION_TYPES } from '../inputPanel/constants'
import { isGameActive } from '../utils/util'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import { PENCIL_STATE } from '@application/constants'

const handleNumberClick = ({ getState, params: { number, isLongPress } }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardControllerRepository, gameSettingsAdapter, inputPanelRepository } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const isNumberLocked = inputPanelRepository.getIsNumberLocked()
    const numberFillOnCellClickAllowed = gameSettingsAdapter.fillNumberOnCellClick()
    if ((isLongPress && numberFillOnCellClickAllowed) || isNumberLocked) {
        const lockedNumber = inputPanelRepository.getLockedNumber()
        if (lockedNumber !== number) inputPanelRepository.setLockedNumber(number)
        else inputPanelRepository.unlockNumber()
        return
    }

    const pencilState = boardControllerRepository.getPencil()
    const fillNoteOnShortClick = gameSettingsAdapter.fillNoteOnShortClick()
    const fillAsNote = fillNoteOnShortClick ? !isLongPress : pencilState === PENCIL_STATE.ACTIVE
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
