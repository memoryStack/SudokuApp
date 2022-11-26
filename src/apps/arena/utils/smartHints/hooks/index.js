import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getHintHCInfo, getTryOutMainNumbers, getTryOutNotes } from '../../../store/selectors/smartHintHC.selectors'
import { analyseTryOutInput } from '../tryOutInputAnalyser'

const useIsHintTryOutStep = () => {
    const { hint: { isTryOut = false } = {} } = useSelector(getHintHCInfo)
    return isTryOut
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

export { useIsHintTryOutStep, useHintTryOutAnalyserResult }
