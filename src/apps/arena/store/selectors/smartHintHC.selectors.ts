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

export const getHintHCInfo = (state: RootState): HintHCInfo => {
    const { currentHintNum } = state.smartHintHC

    if (currentHintNum === -1) return {} as HintHCInfo

    const getHintInfo = () => ({
        type: state.smartHintHC.hints[0].type,
        title: state.smartHintHC.hints[0].title,
        logic: state.smartHintHC.hints[0].steps[currentHintNum - 1].text,

        focusedCells: state.smartHintHC.hints[0].focusedCells,
        cellsToFocusData: state.smartHintHC.hints[0].cellsToFocusData,
        selectCellOnClose: state.smartHintHC.hints[0].selectCellOnClose,

        inputPanelNumbersVisibility: state.smartHintHC.hints[0].inputPanelNumbersVisibility,
        isTryOut: state.smartHintHC.hints[0].steps[currentHintNum - 1].isTryOut || false,
        hasTryOut: state.smartHintHC.hints[0].hasTryOut || false,
        tryOutAnalyserData: state.smartHintHC.hints[0].tryOutAnalyserData,

        svgProps: getSvgPropsData(state),
    })

    return {
        show: state.smartHintHC.show,
        currentHintNum,
        totalHintsCount: (state.smartHintHC.hints[0].steps || []).length || 1,
        hint: getHintInfo(),
    }
}

export const getTryOutSelectedCell = (state: RootState) => state.smartHintHC.tryOut.selectedCell

export const getTryOutMainNumbers = (state: RootState) => state.smartHintHC.tryOut.mainNumbers

export const getTryOutNotes = (state: RootState) => state.smartHintHC.tryOut.notes

export const getTryOutClickableCells = (state: RootState) => state.smartHintHC.hints[0].clickableCells || []

export const getTryOutCellsRestrictedNumberInputs = (state: RootState) => state.smartHintHC.hints[0].cellsRestrictedNumberInputs || []

export const getTryOutCellsRestrictedNumberInputsMsg = (state: RootState) => state.smartHintHC.hints[0].restrictedNumberInputMsg || 'oh!, something unexpected happen'

export const getApplyHintChanges = (state: RootState) => state.smartHintHC.hints[0].applyHint

export const getSvgPropsData = (state: RootState) => state.smartHintHC.hints[0].svgProps?.data

export const getUnclickableCellClickInTryOutMsg = () => {
    const state = getStoreState()
    return state.smartHintHC.hints[0].unclickableCellClickInTryOutMsg
}
