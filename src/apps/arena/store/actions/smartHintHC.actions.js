import { getStoreState, invokeDispatch } from '../../../../redux/dispatch.helpers'
import { EVENTS } from '../../../../resources/constants'
import { emit } from '../../../../utils/GlobalEventBus'
import { consoleLog } from '../../../../utils/util'
import { getSmartHint } from '../../utils/smartHint'
import { NO_HINTS_FOUND_POPUP_TEXT } from '../../utils/smartHints/constants'
import { removeHints, setNextHint, setPrevHint, setHints, resetState } from '../reducers/smartHintHC.reducers'
import { getMainNumbers, getNotesInfo } from '../selectors/board.selectors'

const getNoHintsFoundMsg = id => {
    return `no ${NO_HINTS_FOUND_POPUP_TEXT[id]} found. try other hints or try filling some more guesses.`
}

export const showHints = hintId => {
    const mainNumbers = getMainNumbers(getStoreState())
    const notesInfo = getNotesInfo(getStoreState())

    getSmartHint(mainNumbers, notesInfo, hintId)
        .then(hints => {
            consoleLog('@@@@ hintInfo', JSON.stringify(hints))
            if (hints) invokeDispatch(setHints(hints))
            else {
                emit(EVENTS.SHOW_SNACK_BAR, {
                    msg: getNoHintsFoundMsg(hintId),
                    visibleTime: 5000,
                })
            }
        })
        .catch(error => {
            // TODO: make the popup scrollable for very long systraces
            consoleLog(error)
            if (__DEV__) {
                emit(EVENTS.SHOW_SNACK_BAR, {
                    msg: JSON.stringify(error.stack),
                    visibleTime: 10000,
                })
            }
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
