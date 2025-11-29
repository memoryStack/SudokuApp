/* eslint-disable no-param-reassign */
const stateHandlers = {
    setLockedNumber: (state, { payload: { number, type } }) => {
        state.lockedNumber = {
            isLocked: true,
            number,
            type
        }
    },
    unlockNumber: (state) => {
        state.lockedNumber = {
            isLocked: false,
            number: 0,
            type: ''
        }
    },
}

export default stateHandlers
