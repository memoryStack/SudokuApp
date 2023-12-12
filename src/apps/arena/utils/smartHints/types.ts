import { TRY_OUT_RESULT_STATES } from './tryOutInputAnalyser/constants'
import { LINK_TYPES } from './xChain/xChain.constants'

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

type ChainLink = {
    start: { cell: Cell, note: NoteValue }
    end: { cell: Cell, note: NoteValue }
    type: LINK_TYPES
}

export type Chain = ChainLink[]

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

export type RemovableNotesInfo = {
    [note: NoteValue]: Cell[]
}

export type CellsRestrictedNumberInputs = {
    [cellKey: string]: NoteValue[]
}

export type TryOutInputsColors = {
    [cellNum: number]: {
        [mainNumber: number]: string
    }
}

// TODO: add more keys here to support for other hints as well
export type TransformedRawHint = {
    cellsToFocusData: CellsFocusData
    title: string // TODO: better get it from enums
    type?: string // TODO: verify why it's optional. fix it today
    steps: HintSteps
    applyHint: ApplyHint
    selectCellOnClose?: SelectCellOnClose
    hasTryOut?: boolean
    focusedCells?: FocusedCells
    tryOutAnalyserData?: unknown
    removableNotes?: RemovableNotesInfo
    inputPanelNumbersVisibility?: InputPanelVisibleNumbers
    clickableCells?: Cell[]
    unclickableCellClickInTryOutMsg?: string
    cellsRestrictedNumberInputs?: CellsRestrictedNumberInputs
    restrictedNumberInputMsg?: string
    svgProps?: { data: Chain }
    tryOutInputsColors?: TryOutInputsColors
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
