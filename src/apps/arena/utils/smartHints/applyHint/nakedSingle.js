import { BOARD_MOVES_TYPES } from "../../../constants"

export const nakedSingleApplyHint = ({ rawHint }) => {
    const { cell, mainNumber } = rawHint
    return [
        {
            cell,
            action: { type: BOARD_MOVES_TYPES.ADD, mainNumber }
        }
    ]
}
