

export const getHintHCInfo = (state) => {
    const currentHintNum = state.smartHintHC.currentHintNum
    if (currentHintNum === -1) return {}
    return {
        show: state.smartHintHC.show,
        currentHintNum,
        totalHintsCount: state.smartHintHC.hints.length,
        hint: state.smartHintHC.hints[currentHintNum - 1],
    }
}
