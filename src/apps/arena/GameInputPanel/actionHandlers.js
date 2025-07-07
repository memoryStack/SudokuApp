import { eraseCellUseCase, inputNumberUseCase } from '@application/usecases/board'
import { ACTION_TYPES } from '../inputPanel/constants'
import { isGameActive } from '../utils/util'
import { SOUNDS } from 'src/interfaces/soundAdapter'
import { PENCIL_STATE } from '@application/constants'

const handleNumberClick = ({ getState, params: { number, isLongPress } }) => {
    const { dependencies } = getState()
    const { gameStateRepository, boardControllerRepository, gameSettingsAdapter, soundAdapter } = dependencies
    if (!isGameActive(gameStateRepository.getGameState())) return

    const pencilState = boardControllerRepository.getPencil()
    const fillNoteOnShortClick = gameSettingsAdapter.fillNoteOnShortClick()
    const fillAsNote = fillNoteOnShortClick ? !isLongPress : pencilState === PENCIL_STATE.ACTIVE
    const soundsEnabled = gameSettingsAdapter.soundsEnabled()
    inputNumberUseCase(
        number,
        fillAsNote,
        {
            ...dependencies,
            sound: {
                mistake: { play: () => soundsEnabled && soundAdapter.play(SOUNDS.MISTAKE) },
                addNumber: { play: () => soundsEnabled && soundAdapter.play(SOUNDS.NUMBER_INPUT) },
                removeNumber: { play: () => soundsEnabled && soundAdapter.play(SOUNDS.ERASER_CLICK) },
            }
        }
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
