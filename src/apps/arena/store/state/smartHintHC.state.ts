import {
    CellsFocusData,
    FocusedCells,
    ApplyHint,
    SelectCellOnClose,
    HintSteps,
    ClickableCells,
    Chain,
    InputPanelNumbersVisibility,
    RemovableNotesInfo,
    TryOutInputsColors,
} from '../../utils/smartHints/types'

export type HintSvgData = {
    data: Chain
}

export type HintsInfo = {
    hasTryOut: boolean
    cellsToFocusData: CellsFocusData
    focusedCells: FocusedCells
    type: string // TODO: put type using enums
    title: string // TODO: put type from enums
    steps: HintSteps
    applyHint: ApplyHint
    clickableCells?: ClickableCells
    unclickableCellClickInTryOutMsg?: string
    selectCellOnClose?: SelectCellOnClose
    tryOutAnalyserData?: unknown // every hint has separate contract for it
    removableNotes?: RemovableNotesInfo
    inputPanelNumbersVisibility?: InputPanelNumbersVisibility
    cellsRestrictedNumberInputs?: unknown
    restrictedNumberInputMsg?: string
    svgProps?: HintSvgData
    tryOutInputsColors?: TryOutInputsColors
}

type SmartHintTryOutBoardData = {
    mainNumbers: MainNumbers | null
    notes: Notes | null
    selectedCell?: Cell
}

type InitialState = {
    show: boolean
    currentHintNum: number
    hints: HintsInfo[]
    tryOut: SmartHintTryOutBoardData
}

export const INITIAL_STATE: InitialState = {
    show: false,
    currentHintNum: -1,
    hints: [],
    tryOut: {} as SmartHintTryOutBoardData,
}
