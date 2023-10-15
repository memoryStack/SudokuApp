import { TRY_OUT_RESULT_STATES } from './tryOutInputAnalyser/constants'

export interface NotesToHighlightData {
    [note: string]: {
      fontColor: string
    }
}

type CellBackgroundColor = {
    backgroundColor: string
}

export interface CellHighlightData {
    bgColor: CellBackgroundColor
    notesToHighlightData?: NotesToHighlightData
}

interface RowData {
    [columnIndex: string]: CellHighlightData
}

export interface CellsFocusData {
    [rowIndex: string]: RowData;
}

type ChainCell = {
    cell: Cell
    in?: NoteValue
    out?: NoteValue
}

export type Chain = ChainCell[]

export type FocusedCells = Cell[]
export type SelectCellOnClose = Cell
export type ClickableCells = Cell[]

export type HintStep = {
    text: string
    isTryOut?:boolean
}

export type HintSteps = HintStep[]

export type NotesRemovalHintAction = {
    cell: Cell
    action: {
        type: string
        notes: NoteValue[]
    }
}

export type AddMainNumberHintAction = {
    cell: Cell
    action: {
        type: string
        mainNumber: MainNumberValue
    }
}

export type ApplyHint = AddMainNumberHintAction[] | NotesRemovalHintAction[]

export type TryOutResult = {
    state: TRY_OUT_RESULT_STATES
    msg: string
}

export type InputPanelNumbersVisibility = InputPanelVisibleNumbers

export type RawHintTransformersArgs = {
    rawHint: unknown
    mainNumbers: MainNumbers
    notesData: Notes
    smartHintsColorSystem: SmartHintsColorSystem
}

// TODO: add more keys here to support for other hints as well
export type TransformedRawHint = {
    cellsToFocusData: CellsFocusData
    title: string // TODO: better get it from enums
    type?: string // TODO: verify why it's optional
    steps: HintSteps
    applyHint: ApplyHint
    selectCellOnClose?: SelectCellOnClose
    hasTryOut?: boolean
    focusedCells?: FocusedCells
    tryOutAnalyserData?: unknown
    inputPanelNumbersVisibility?: InputPanelVisibleNumbers
    clickableCells?: Cell[]
    cellsRestrictedNumberInputs?: unknown
    restrictedNumberInputMsg?: string
}

export type SmartHintsColorSystem = {
    cellDefaultBGColor: string
    selectedCellBGColor: string
    inhabitableCellCrossColor: string
    safeNoteColor: string
    toBeRemovedNoteColor: string
    tryOutFilledNumberColor: string
    correctTryOutInputMsgColor: string
    incorrectTryOutInputMsgColor: string
    yWing: {
        pivotCellBGColor: string
        wingCellBGColor: string
    }
    xWing: {
        topLeftBottomRightCellsBGColor: string
        topRightBottomLeftCellsBGColor: string
        finnCellBGColor: string
    }
}
