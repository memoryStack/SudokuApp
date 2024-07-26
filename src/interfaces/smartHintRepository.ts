// this interface is defined by domain
import type {
    SmartHintRepository as ApplicationLayerSmartHintRepoInterface
} from '@application/adapterInterfaces/stateManagers/smartHintHCRepository'

import {
    CellsFocusData, ClickableCells, RemovableNotesInfo, TryOutInputsColors,
} from '../apps/arena/utils/smartHints/types'

export type HintData = {
    hints: unknown[] // TODO: come back to this type later
    mainNumbers: MainNumbers
    notes: Notes
}

export interface SmartHintRepository extends ApplicationLayerSmartHintRepoInterface {
    removeHints: () => void
    setHints: (data: HintData) => void
    getHintStepNumber: () => number
    setHintStepNumber: (stepNum: number) => void
    setTryOutSelectedCell: (cell: Cell) => void
    getTryOutClickableCells: () => ClickableCells
    getRemovableNotes: () => RemovableNotesInfo | undefined
    getUnclickableCellClickInTryOutMsg: () => string | undefined
    getCellToFocusData: () => CellsFocusData | null
    getTryOutInputsColors: () => TryOutInputsColors | null
}
