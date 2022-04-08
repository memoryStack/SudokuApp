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
