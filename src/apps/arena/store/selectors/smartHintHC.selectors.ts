import { getStoreState } from '../../../../redux/dispatch.helpers'
import { RootState } from '../../../../redux/types'

import { HintStep } from '../../utils/smartHints/types'

import { HintsInfo, HintSvgData } from '../state/smartHintHC.state'

export type Hint = {
    type: HintsInfo['type']
    title: HintsInfo['title']
    logic: HintStep['text']
    focusedCells: HintsInfo['focusedCells']
    cellsToFocusData: HintsInfo['cellsToFocusData']
    selectCellOnClose: HintsInfo['selectCellOnClose']
    inputPanelNumbersVisibility: HintsInfo['inputPanelNumbersVisibility']
    isTryOut: HintStep['isTryOut'] | boolean
    hasTryOut: HintsInfo['hasTryOut'] | boolean
    tryOutAnalyserData: HintsInfo['tryOutAnalyserData']
    svgProps?: HintSvgData['data']
}

type HintHCInfo = {
    show: boolean
    currentHintNum: number
    totalHintsCount: number
    hint: Hint
}

export const getTryOutSelectedCell = (state: RootState) => state.smartHintHC.tryOut.selectedCell

export const getTryOutMainNumbers = (state: RootState) => state.smartHintHC.tryOut.mainNumbers

export const getTryOutNotes = (state: RootState) => state.smartHintHC.tryOut.notes

export const getTryOutClickableCells = (state: RootState) => state.smartHintHC.hints[0].clickableCells || []

export const getTryOutCellsRestrictedNumberInputs = (state: RootState) => state.smartHintHC.hints[0].cellsRestrictedNumberInputs || []

export const getTryOutCellsRestrictedNumberInputsMsg = (state: RootState) => state.smartHintHC.hints[0].restrictedNumberInputMsg || 'oh!, something unexpected happen'

export const getApplyHintChanges = (state: RootState) => state.smartHintHC.hints[0].applyHint

export const getUnclickableCellClickInTryOutMsg = () => {
    const state = getStoreState()
    return state.smartHintHC.hints[0].unclickableCellClickInTryOutMsg
}

export const getRemovableNotesInfo = (state: RootState) => state.smartHintHC.hints[0].removableNotes

export const getIsTryOutStep = (state: RootState) => {
    const { currentHintNum } = state.smartHintHC
    if (currentHintNum === -1) return false
    const isTryOut = state.smartHintHC.hints[0].steps[currentHintNum - 1].isTryOut || false
    return isTryOut
}

export const getHintHasTryOutStep = (state: RootState) => {
    const { currentHintNum } = state.smartHintHC
    if (currentHintNum === -1) return false
    const hasTryOut = state.smartHintHC.hints[0].hasTryOut || false
    return hasTryOut
}

export const getShowSmartHint = (state: RootState) => state.smartHintHC.show

export const getHintStepLogic = (state: RootState) => {
    if (!getShowSmartHint(state)) return ''
    const { currentHintNum } = state.smartHintHC
    return state.smartHintHC.hints[0].steps[currentHintNum - 1].text
}

export const getHintType = (state: RootState) => {
    if (!getShowSmartHint(state)) return ''
    return state.smartHintHC.hints[0].type
}

export const getHintTitle = (state: RootState) => {
    if (!getShowSmartHint(state)) return ''
    return state.smartHintHC.hints[0].title
}

export const getHintTryOutAnalyserData = (state: RootState) => {
    if (!getIsTryOutStep(state)) return null
    return state.smartHintHC.hints[0].tryOutAnalyserData
}

export const getCellToFocusData = (state: RootState) => {
    if (!getShowSmartHint(state)) return null
    return state.smartHintHC.hints[0].cellsToFocusData
}

export const getSvgPropsData = (state: RootState) => {
    if (!getShowSmartHint(state)) return null
    return state.smartHintHC.hints[0].svgProps?.data
}

export const getFocusedCells = (state: RootState) => {
    if (!getShowSmartHint(state)) return null
    return state.smartHintHC.hints[0].focusedCells
}

export const getSelectCellOnClose = (state: RootState) => {
    if (!getShowSmartHint(state)) return null
    return state.smartHintHC.hints[0].selectCellOnClose
}

export const getInputPanelNumbersVisibility = (state: RootState) => {
    if (!getShowSmartHint(state)) return undefined
    return state.smartHintHC.hints[0].inputPanelNumbersVisibility
}

export const getCurrentHintStepNum = (state: RootState) => state.smartHintHC.currentHintNum

export const getTotalStepsCount = (state: RootState) => {
    if (!getShowSmartHint(state)) return 0
    return (state.smartHintHC.hints[0].steps || []).length || 1
}
