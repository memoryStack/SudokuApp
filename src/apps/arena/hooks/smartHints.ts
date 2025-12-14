import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMainNumbers, getNotesInfo } from '../store/selectors/board.selectors'

import {
    getHintHasTryOutStep,
    getHintTryOutAnalyserData,
    getHintType,
    getIsTryOutStep,
    getTryOutMainNumbers,
    getTryOutNotes,
} from '../store/selectors/smartHintHC.selectors'

import { analyseTryOutInput } from '../utils/smartHints/tryOutInputAnalyser'
import { TRY_OUT_RESULT_STATES } from '../utils/smartHints/tryOutInputAnalyser/constants'
import { TryOutResult } from '../utils/smartHints/types'
import { useSmartHintsTranslations } from 'src/apps/hintsVocabulary/vocabExplainations/hooks/useSmartHintsTranslations'

const useIsHintTryOutStep = () => useSelector(getIsTryOutStep)

const useHintHasTryOutStep = () => useSelector(getHintHasTryOutStep)

const useHintTryOutAnalyserResult = (): TryOutResult => {
    const hintType = useSelector(getHintType)
    const tryOutAnalyserData = useSelector(getHintTryOutAnalyserData)
    const smartHintsTranslationsTexts = useSmartHintsTranslations()

    const [tryOutResult, setTryOutResult] = useState({ state: TRY_OUT_RESULT_STATES.START, msg: '' })
    const isHintTryOut = useIsHintTryOutStep()
    const tryOutMainNumbers = useSelector(getTryOutMainNumbers)
    const tryOutNotes = useSelector(getTryOutNotes)
    const actualMainNumbers = useSelector(getMainNumbers)
    const actualNotes = useSelector(getNotesInfo)

    useEffect(() => {
        if (!isHintTryOut) return
        const boardInputs = {
            tryOutMainNumbers, tryOutNotes, actualMainNumbers, actualNotes,
        }
        setTryOutResult(analyseTryOutInput({ hintType, data: tryOutAnalyserData, boardInputs, smartHintsTranslationsTexts }))
    }, [isHintTryOut, tryOutAnalyserData, hintType, tryOutMainNumbers, tryOutNotes, actualMainNumbers, actualNotes, smartHintsTranslationsTexts])

    return tryOutResult
}

export { useIsHintTryOutStep, useHintTryOutAnalyserResult, useHintHasTryOutStep }
