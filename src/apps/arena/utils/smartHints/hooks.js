import { useSelector } from 'react-redux'

import { getHintHCInfo } from '../../store/selectors/smartHintHC.selectors'

const useIsHintTryOutStep = () => {
    const {hint: { key: stepKey } = {}} = useSelector(getHintHCInfo)
    return stepKey === 'TRY_OUT'
}

const useCellFocus = () => {
    const { hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } =
        useSelector(getHintHCInfo)

    const isCellFocused = (cell) => {
        return !!(smartHintCellsHighlightInfo[cell.row]?.[cell.col])
    }

    return isCellFocused
}

export {
    useIsHintTryOutStep,
    useCellFocus,
}
