import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { getHintHCInfo, getTryOutMainNumbers, getTryOutNotes } from '../store/selectors/smartHintHC.selectors'

import { analyseTryOutInput } from '../utils/smartHints/tryOutInputAnalyser'
import { TRY_OUT_RESULT_STATES } from '../utils/smartHints/tryOutInputAnalyser/constants'
import { TryOutResult } from '../utils/smartHints/types'

const useIsHintTryOutStep = () => {
    const { hint: { isTryOut = false } = {} } = useSelector(getHintHCInfo)
    return isTryOut
}

const useHintTryOutAnalyserResult = (): TryOutResult => {
    const { hint: { type: hintType, tryOutAnalyserData } = {} } = useSelector(getHintHCInfo)

    const [tryOutResult, setTryOutResult] = useState({ state: TRY_OUT_RESULT_STATES.START, msg: '' })
    const mainNumbers = useSelector(getTryOutMainNumbers)
    const notes = useSelector(getTryOutNotes)
    const isHintTryOut = useIsHintTryOutStep()

    useEffect(() => {
        if (!isHintTryOut) return
        setTryOutResult(analyseTryOutInput({ hintType, data: tryOutAnalyserData }))
    }, [isHintTryOut, mainNumbers, notes, tryOutAnalyserData, hintType])

    return tryOutResult
}

export { useIsHintTryOutStep, useHintTryOutAnalyserResult }
