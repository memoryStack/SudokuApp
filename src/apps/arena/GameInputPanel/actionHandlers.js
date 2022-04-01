import { ACTION_TYPES } from "../inputPanel/constants";
import { eraseAction, inputNumberAction } from "../store/actions/gameInputPanel.actions";
import { isGameActive } from "../store/utils";

const handleNumberClick = ({ params: number }) => {    
    if (!isGameActive()) return
    inputNumberAction(number)
}

const handleEraserClick = () => {
    if (!isGameActive()) return
    eraseAction()
}

export const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_NUMBER_CLICK]: handleNumberClick,
    [ACTION_TYPES.ON_ERASE_CLICK]: handleEraserClick,
}
