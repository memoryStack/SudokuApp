import { INITIAL_STATE } from '../../apps/arena/store/state/smartHintHC.state'
import { getCurrentHintStepNum } from '../../apps/arena/store/selectors/smartHintHC.selectors'
import {
    SmartHintRepository as SmartHintRepositoryInterface,
    NumberInputData,
    NumberEraseData,
    HintData,
} from '../../interfaces/smartHintRepository'

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
}
