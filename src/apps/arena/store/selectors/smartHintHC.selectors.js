// TODO: add support for the default values for all these
// primitive types of values
const EMPTY_OBJECT = {}
export const getHintHCInfo = state => {
    const currentHintNum = state.smartHintHC.currentHintNum
    if (currentHintNum === -1) return EMPTY_OBJECT
    return {
        show: state.smartHintHC.show,
        currentHintNum,
        totalHintsCount: state.smartHintHC.hints.length,
        hint: state.smartHintHC.hints[currentHintNum - 1],
    }
}

export const getTryOutSelectedCell = (state) => {
    return state.smartHintHC.tryOut.selectedCell
}

export const getTryOutMainNumbers = (state) => {
    return state.smartHintHC.tryOut.mainNumbers
}

export const getTryOutNotes = (state) => {
    return state.smartHintHC.tryOut.notesInfo
}
