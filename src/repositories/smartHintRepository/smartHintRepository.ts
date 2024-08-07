import { INITIAL_STATE } from '../../apps/arena/store/state/smartHintHC.state'
import {
    getCurrentHintStepNum,
    getRemovableNotesInfo,
    getTryOutClickableCells,
    getTryOutMainNumbers,
    getTryOutNotes,
    getTryOutSelectedCell,
    getTryOutCellsRestrictedNumberInputsMsg,
    getTryOutCellsRestrictedNumberInputs,
    getUnclickableCellClickInTryOutMsg,
    getCellToFocusData,
    getTryOutInputsColors,
} from '../../apps/arena/store/selectors/smartHintHC.selectors'
import {
    SmartHintRepository as SmartHintRepositoryInterface,
    HintData,
} from '../../interfaces/smartHintRepository'

import type { NumberInputData, NumberEraseData } from '@application/adapterInterfaces/stateManagers/smartHintHCRepository'

import { invokeDispatch, getStoreState } from '../../redux/dispatch.helpers'
import { smartHintHCActions } from '../../apps/arena/store/reducers/smartHintHC.reducers'

const {
    setHintStepNumber,
    setTryOutSelectedCell,
    updateBoardDataOnTryOutNumberInput,
    updateBoardDataOnTryOutErase,
    setHints,
} = smartHintHCActions

export const SmartHintRepository: SmartHintRepositoryInterface = {
    removeHints: () => {
        invokeDispatch(setHints(INITIAL_STATE))
    },
    setHints: (data: HintData) => {
        const hints = {
            show: true,
            currentHintNum: 1,
            hints: data.hints,
            tryOut: {
                mainNumbers: data.mainNumbers,
                notes: data.notes,
            },
        }
        invokeDispatch(setHints(hints))
    },
    setHintStepNumber: (stepNumber: number) => {
        invokeDispatch(setHintStepNumber(stepNumber))
    },
    getHintStepNumber: () => getCurrentHintStepNum(getStoreState()),
    setTryOutSelectedCell: (cell: Cell) => {
        invokeDispatch(setTryOutSelectedCell(cell))
    },
    updateBoardDataOnTryOutNumberInput: (data: NumberInputData) => {
        invokeDispatch(updateBoardDataOnTryOutNumberInput({
            number: data.inputNumber,
            removalbeNotesHostCellsData: data.removableNotes,
        }))
    },
    updateBoardDataOnTryOutErase: (data: NumberEraseData) => {
        invokeDispatch(updateBoardDataOnTryOutErase(data))
    },
    getTryOutSelectedCell: () => getTryOutSelectedCell(getStoreState()),
    getTryOutMainNumbers: () => getTryOutMainNumbers(getStoreState()),
    getTryOutNotes: () => getTryOutNotes(getStoreState()),
    getTryOutClickableCells: () => getTryOutClickableCells(getStoreState()),
    getRemovableNotes: () => getRemovableNotesInfo(getStoreState()),
    getTryOutCellsRestrictedNumberInputsMsg: () => getTryOutCellsRestrictedNumberInputsMsg(getStoreState()),
    getTryOutCellsRestrictedNumberInputs: () => getTryOutCellsRestrictedNumberInputs(getStoreState()),
    getUnclickableCellClickInTryOutMsg: () => getUnclickableCellClickInTryOutMsg(getStoreState()),
    getCellToFocusData: () => getCellToFocusData(getStoreState()),
    getTryOutInputsColors: () => getTryOutInputsColors(getStoreState()),
}
