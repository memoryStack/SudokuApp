// TODO: add support for the default values for all these
// primitive types of values
const EMPTY_OBJECT = {}
export const getHintHCInfo = state => {
    const currentHintNum = state.smartHintHC.currentHintNum
    if (currentHintNum === -1) return EMPTY_OBJECT

    // TODO: let's keep this all data in one big structure right now.
    // will break it before moving on to next feature
    const getHintInfo = () => {
        return {
            type: state.smartHintHC.hints[0].type,
            title: state.smartHintHC.hints[0].title,
            logic: state.smartHintHC.hints[0].steps[currentHintNum - 1].text,

            focusedCells: state.smartHintHC.hints[0].focusedCells,
            cellsToFocusData: state.smartHintHC.hints[0].cellsToFocusData,
            selectCellOnClose: state.smartHintHC.hints[0].selectCellOnClose,

            inputPanelNumbersVisibility: state.smartHintHC.hints[0].inputPanelNumbersVisibility,
            isTryOut: state.smartHintHC.hints[0].steps[currentHintNum - 1].isTryOut || false,
            tryOutAnalyserData: state.smartHintHC.hints[0].tryOutAnalyserData,
        }
    }

    return {
        show: state.smartHintHC.show,
        currentHintNum,
        totalHintsCount: (state.smartHintHC.hints[0].steps || []).length || 1,
        hint: getHintInfo(),
    }
}

export const getTryOutSelectedCell = state => {
    return state.smartHintHC.tryOut.selectedCell
}

export const getTryOutMainNumbers = state => {
    return state.smartHintHC.tryOut.mainNumbers
}

export const getTryOutNotes = state => {
    return state.smartHintHC.tryOut.notesInfo
}

export const getTryOutClickableCells = (state) => {
    return state.smartHintHC.hints[0].clickableCells || []
}
