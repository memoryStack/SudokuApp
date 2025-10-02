/* eslint-disable no-param-reassign */
const stateHandlers = {
    setLockedNumber: (state, { payload: number }) => {
        state.lockedNumber = {
            isLocked: true,
            number
        }
    },
    unlockNumber: (state) => {
        state.lockedNumber = {
            isLocked: false,
            number: 0
        }
    },
}

export default stateHandlers
