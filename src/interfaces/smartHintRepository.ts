// this interface is defined by domain
import type {
    SmartHintRepository as ApplicationLayerSmartHintRepoInterface
} from '@application/adapterInterfaces/stateManagers/smartHintHCRepository'

import {
    CellsFocusData, ClickableCells, RemovableNotesInfo, SmartHintsColorSystem, TryOutInputsColors, HintSteps
} from '../apps/arena/utils/smartHints/types'
import { HintsInfo } from 'src/apps/arena/store/state/smartHintHC.state'

export type HintData = {
    hints: HintsInfo[]
    mainNumbers: MainNumbers
    notes: Notes
    rawHintMeta: {
        id: string,
        hint: unknown,
        mainNumbers: MainNumbers,
        notes: Notes,
        smartHintsColorSystem: SmartHintsColorSystem
    }
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
    setCellsToFocusData: (data: CellsFocusData) => void
    setStepsText: ({ steps, title }: { steps: HintSteps, title: string }) => void
    getTryOutInputsColors: () => TryOutInputsColors | null | undefined
}
