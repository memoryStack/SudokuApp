import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getHintHCInfo, getTryOutMainNumbers, getTryOutNotes } from '../../store/selectors/smartHintHC.selectors'
import { analyseTryOutInput } from '../../utils/smartHints/tryOutInputAnalyser'

const useIsHintTryOutStep = () => {
    const { hint: { isTryOut = false } = {} } = useSelector(getHintHCInfo)
    return isTryOut
}

const useCellFocus = () => {
    const { hint: { cellsToFocusData: smartHintCellsHighlightInfo = {} } = {} } = useSelector(getHintHCInfo)

    const isCellFocused = cell => {
        return !!smartHintCellsHighlightInfo[cell.row]?.[cell.col]
    }

    return isCellFocused
}

const useHintTryOutAnalyserResult = () => {
    const { hint: { type: hintType, tryOutAnalyserData } = {} } = useSelector(getHintHCInfo)

    const [tryOutResult, setTryOutResult] = useState({})
    const mainNumbers = useSelector(getTryOutMainNumbers)
    const notesInfo = useSelector(getTryOutNotes)
    const isHintTryOut = useIsHintTryOutStep()

    useEffect(() => {
        if (!isHintTryOut) return
        setTryOutResult(analyseTryOutInput({ hintType, data: tryOutAnalyserData }))
    }, [isHintTryOut, mainNumbers, notesInfo, tryOutAnalyserData, hintType])

    return tryOutResult
}

export { useIsHintTryOutStep, useCellFocus, useHintTryOutAnalyserResult }
