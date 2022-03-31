import { EVENTS } from "../../../resources/constants";
import { emit } from "../../../utils/GlobalEventBus";
import { ACTION_TYPES } from "../inputPanel/constants";
import { eraseAction, inputNumberAction } from "../store/actions/gameInputPanel.actions";
import { isGameActive } from "../store/utils";

const handleNumberClick = ({ params: number }) => {    
    if (!isGameActive()) return
    inputNumberAction(number)
}

const handleEraserClick = () => {
    if (!isGameActive()) return
    // TODO: remove event and implement action
    emit(EVENTS.ERASER_CLICKED)
    eraseAction()
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
