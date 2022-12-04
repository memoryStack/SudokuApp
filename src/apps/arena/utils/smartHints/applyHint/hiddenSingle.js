import { BOARD_MOVES_TYPES } from "../../../constants"

export const hiddenSingleApplyHint = ({ rawHint }) => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber }
        }
    ]
}
