export const getIsNumberLocked = state => state.inputPanel.lockedNumber.isLocked

export const getLockedNumber = state => {
    return {
        type: state.inputPanel.lockedNumber.type,
        number: state.inputPanel.lockedNumber.number
    }
}
