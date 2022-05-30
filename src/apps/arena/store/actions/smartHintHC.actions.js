import { EVENTS } from '../../../../constants/events'
import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { GAME_STATE } from '../../../../resources/constants'
import { emit } from '../../../../utils/GlobalEventBus'
import { consoleLog, getClonedValue } from '../../../../utils/util'
import { getSmartHint } from '../../utils/smartHint'
import { NO_HINTS_FOUND_POPUP_TEXT } from '../../utils/smartHints/constants'
import { smartHintHCActions } from '../reducers/smartHintHC.reducers'
import { getMainNumbers, getNotesInfo } from '../selectors/board.selectors'
import { updateGameState } from './gameState.actions'

const {
    removeHints,
    setNextHint,
    setPrevHint,
    setHints,
    resetState,
    setTryOutSelectedCell,
} = smartHintHCActions

const getNoHintsFoundMsg = id => {
    return `no ${NO_HINTS_FOUND_POPUP_TEXT[id]} found. try other hints or try filling some more guesses.`
}

export const showHints = async hintId => {
    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    consoleLog('@@@@@@ notes', JSON.stringify(notesInfo))

    return getSmartHint(mainNumbers, notesInfo, hintId)
        .then(hints => {
            consoleLog('@@@@ hintInfo', JSON.stringify(hints))
            if (hints) {
                // TODO: not all hints will have try-put steps.
                // avoid this cloning of mainNumbers and notesInfo
                const hintsData = {
                    mainNumbers: getClonedValue(mainNumbers),
                    notesInfo: getClonedValue(notesInfo),
                    hints,
                }
                invokeDispatch(setHints(hintsData))
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

export const updateTryOutSelectedCell = (cell) => {
    invokeDispatch(setTryOutSelectedCell(cell))
}

export const inputTryOutNumber = (number, focusedCells) => {
    console.log('@@@@@@@ try-out number clicked', number, focusedCells)
    // update UI data
    // analyze data and return result
}

export const eraseTryOutNumber = () => {
    // update UI data
    // analyze data and return result
}
