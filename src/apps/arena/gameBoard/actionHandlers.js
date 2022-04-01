import { updateSelectedCell } from '../store/actions/board.actions'
import { isGameActive } from '../store/utils'

const handleCellPress = ({ params: cell }) => {
    // TODO: some improvements can be done here like
    // check if user is clicking on same cell again and again
    if (!isGameActive()) return
    updateSelectedCell(cell)
}

const ACTION_TYPES = {
    ON_CELL_PRESS: 'ON_CELL_PRESS',
}

const ACTION_HANDLERS = {
    [ACTION_TYPES.ON_CELL_PRESS]: handleCellPress,
}

export { ACTION_TYPES, ACTION_HANDLERS }
