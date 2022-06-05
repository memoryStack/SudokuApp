import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getHintHCInfo, getTryOutMainNumbers, getTryOutNotes } from '../../store/selectors/smartHintHC.selectors'
import { analyseTryOutInput } from '../../utils/smartHints/tryOutInputAnalyser'

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

const useHintTryOutAnalyserResult = () => {
    const { hint: { hintId, tryOutAnalyserData } = {} } = useSelector(getHintHCInfo)

    const [ tryOutResult, setTryOutResult ] = useState({})
    const mainNumbers = useSelector(getTryOutMainNumbers)
    const notesInfo = useSelector(getTryOutNotes)
    const isHintTryOut = useIsHintTryOutStep()

    useEffect(() => {
        if (!isHintTryOut) return
        setTryOutResult(analyseTryOutInput({type: hintId, data: tryOutAnalyserData}))
    }, [isHintTryOut, mainNumbers, notesInfo, tryOutAnalyserData, hintId])

    return tryOutResult
}

export {
    useIsHintTryOutStep,
    useCellFocus,
    useHintTryOutAnalyserResult,
}
