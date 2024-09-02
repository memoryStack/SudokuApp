export const getPencilStatus = state => state.boardController.pencilState

export const getAvailableHintsCount = state => state.boardController.hintsLeft

export const getHintsMenuVisibilityStatus = state => state.boardController.showHintsMenu

export const getHintsUsed = state => state.boardController.hintsUsed
