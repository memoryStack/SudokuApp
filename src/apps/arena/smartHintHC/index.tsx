import React, { useCallback, useEffect, useRef } from 'react'

import {
    View, ScrollView, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native'

import { useSelector } from 'react-redux'

import _noop from '@lodash/noop'
import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'

import { CloseIcon } from '@resources/svgIcons/close'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS, Styles } from '@ui/atoms/Text'

import { Action, OnAction } from '@utils/hocs/withActions/types'

import { useStyles } from '@utils/customHooks/useStyles'

import SmartHintText from '@ui/molecules/SmartHintText'
import { getLinkHTMLText } from 'src/apps/hintsVocabulary/vocabExplainations/utils'
import _isNil from '@lodash/isNil'
import { useDependency } from '../../../hooks/useDependency'
import withActions from '../../../utils/hocs/withActions'

import { BottomDragger, getCloseDraggerHandler } from '../../components/BottomDragger'
import { Touchable } from '../../components/Touchable'

import {
    getApplyHintChanges,
    getCurrentHintStepNum,
    getFocusedCells,
    getHintStepLogic,
    getHintTitle,
    getHintType,
    getInputPanelNumbersVisibility,
    getSelectCellOnClose,
    getTotalStepsCount,
} from '../store/selectors/smartHintHC.selectors'
import { useIsHintTryOutStep, useHintTryOutAnalyserResult } from '../hooks/smartHints'

import { Inputpanel } from '../inputPanel'
import { TRY_OUT_RESULT_STATES } from '../utils/smartHints/tryOutInputAnalyser/constants'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { getStyles } from './smartHintHC.styles'
import {
    FOOTER_BUTTONS_TEXT,
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID,
    SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID,
    HINT_VS_VOCAB_ID,
} from './constants'
import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { InputPanelNumbersVisibility } from '../utils/smartHints/types'

type ScrollEventType = NativeSyntheticEvent<NativeScrollEvent>;

type Props = {
    parentHeight: number
    onAction: OnAction
    height: number
}

const useSmartHintData = () => {
    const focusedCells = useSelector(getFocusedCells)
    const title = useSelector(getHintTitle)
    const logic = useSelector(getHintStepLogic)
    const selectCellOnClose = useSelector(getSelectCellOnClose)
    const inputPanelNumbersVisibility = useSelector(getInputPanelNumbersVisibility)
    const currentHintNum = useSelector(getCurrentHintStepNum)
    const totalHintsCount = useSelector(getTotalStepsCount)
    const id = useSelector(getHintType)

    return {
        id,
        focusedCells,
        title,
        logic,
        selectCellOnClose,
        inputPanelNumbersVisibility,
        currentHintNum,
        totalHintsCount,
    }
}

const SmartHintHC_: React.FC<Props> = ({
    parentHeight = 0,
    onAction: onActionFromProps = _noop,
    height = 0,
}) => {
    const dependencies = useDependency()
    const styles = useStyles(getStyles)

    const {
        id: hintId,
        focusedCells,
        title,
        logic,
        selectCellOnClose,
        inputPanelNumbersVisibility,
        currentHintNum,
        totalHintsCount,
    } = useSmartHintData()

    const closeByApplyHintClick = useRef(false)

    const { selectedCell } = useGameBoardInputs()

    const applyHintChanges = useSelector(getApplyHintChanges)

    const tryOutResult = useHintTryOutAnalyserResult()

    const isHintTryOut = useIsHintTryOutStep()

    const onAction = React.useMemo(() => (action: Action) => {
        if (action.type === ACTION_TYPES.ON_NUMBER_CLICK) {
            action.payload = {
                number: action.payload,
                selectedCell,
                dependencies,
            }
        }
        if (action.type === ACTION_TYPES.ON_ERASE_CLICK) {
            action.payload = { dependencies }
        }
        onActionFromProps(action)
    }, [selectedCell, onActionFromProps, dependencies])

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: { focusedCells, styles } })
        return () => {
            onAction({ type: ACTION_TYPES.ON_CLOSE, payload: { newCellToSelect: selectCellOnClose, dependencies } })
        }
    }, [])

    const smartHintHCRef = useRef(null)

    const scrollViewRef = useRef(null)
    const hintsScrollPositions = useRef({} as {[key: number]: number})

    const scrollHintView = (newVerticalPosition: number) => {
        const scrollHandler = _get(scrollViewRef, 'current.scrollTo', _noop)
        scrollHandler({ x: 0, y: newVerticalPosition, animated: true })
    }

    useEffect(() => {
        const newVerticalPosition = _get(hintsScrollPositions.current, [currentHintNum], 0)
        scrollHintView(newVerticalPosition)
    }, [currentHintNum])

    const onNextClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEXT_CLICK, payload: { dependencies } })
    }, [onAction, dependencies])

    const onPrevClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PREV_CLICK, payload: { dependencies } })
    }, [onAction, dependencies])

    const closeView = () => {
        const closeDragger = getCloseDraggerHandler(smartHintHCRef)
        closeDragger()
    }

    const onApplyHintClick = useCallback(() => {
        closeView()
        closeByApplyHintClick.current = true
    }, [])

    const onClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: { newCellToSelect: selectCellOnClose, dependencies } })
        const shouldApplyHint = closeByApplyHintClick.current && !_isEmpty(applyHintChanges)
        if (shouldApplyHint) onAction({ type: ACTION_TYPES.ON_APPLY_HINT_CLICK, payload: { applyHintChanges, dependencies } })
    }, [onAction, selectCellOnClose, applyHintChanges, dependencies])

    const handleOnScroll = ({ nativeEvent: { contentOffset: { y = 0 } = {} } = {} } = {} as ScrollEventType) => {
        if (hintsScrollPositions.current) hintsScrollPositions.current[currentHintNum] = y
    }

    const isOnlyHint = totalHintsCount <= 1
    const isLastHint = currentHintNum === totalHintsCount
    const isFirstHint = currentHintNum === 1
    const displayNextButton = !(isOnlyHint || isLastHint)
    const displayPrevButton = !(isOnlyHint || isFirstHint)

    const hintVocabId = HINT_VS_VOCAB_ID[hintId]
    const learnMoreAvailable = !_isNil(hintVocabId)

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.hintTitleContainer}>
                <Text style={styles.hintTitle} type={TEXT_VARIATIONS.TITLE_LARGE}>{title}</Text>
                {totalHintsCount > 1 ? (
                    <Text
                        style={styles.hintsCountText}
                        testID={SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID}
                    >
                        {`${currentHintNum}/${totalHintsCount}`}
                    </Text>
                ) : null}
            </View>

            <Touchable
                onPress={closeView}
                addHitSlop
                testID={CLOSE_ICON_TEST_ID}
            >
                <CloseIcon height={24} width={24} fill={styles.closeIcon.color} />
            </Touchable>

        </View>
    )

    const renderHintText = (text: string, textStyles: Styles) => (
        <ScrollView ref={scrollViewRef} onScroll={handleOnScroll}>
            <SmartHintText
                style={textStyles}
                text={text}
            />
        </ScrollView>
    )

    const getTryOutResultTextStyle = () => {
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.VALID_PROGRESS) return styles.tryOutProgressResult
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.ERROR) return styles.tryOutErrorResult
        return styles.tryOutDefaultResult
    }

    const renderTryOutContent = () => (
        <>
            <Inputpanel
                numbersVisible={inputPanelNumbersVisibility}
                onAction={onAction}
                singleRow
                shouldAddNumberInPanel={number => (inputPanelNumbersVisibility as InputPanelNumbersVisibility)[number]}
            />
            {renderHintText(tryOutResult.msg, [styles.tryOutResult, getTryOutResultTextStyle()])}
        </>
    )

    const renderLearnMoreLink = () => {
        if (!learnMoreAvailable) return null
        return (
            <SmartHintText text={getLinkHTMLText(hintVocabId, 'Learn More')} />
        )
    }

    const renderFooterLeftSection = () => (
        <>
            {displayPrevButton || !learnMoreAvailable ? (
                <Button
                    label={displayPrevButton ? FOOTER_BUTTONS_TEXT.PREV : ''}
                    onPress={displayPrevButton ? onPrevClick : _noop}
                    avoidDefaultContainerStyles
                    textStyles={styles.footerButtonText}
                    type={BUTTON_TYPES.TEXT}
                />
            ) : null}
            {renderLearnMoreLink()}
        </>
    )
    const renderFooter = () => (
        <View style={styles.footerContainer}>
            {renderFooterLeftSection()}

            <Button
                label={displayNextButton ? FOOTER_BUTTONS_TEXT.NEXT : FOOTER_BUTTONS_TEXT.APPLY_HINT}
                onPress={displayNextButton ? onNextClick : onApplyHintClick}
                avoidDefaultContainerStyles
                textStyles={styles.footerButtonText}
                type={BUTTON_TYPES.TEXT}
            />
        </View>
    )

    return (
        <BottomDragger
            ref={smartHintHCRef}
            stopBackgroundClickClose
            onDraggerClosed={onClosed}
            parentHeight={parentHeight}
            animateBackgroundOverlayOnClose={false}
            testID={SMART_HINT_HC_TEST_ID}
        >
            <View style={[styles.containerStyles, { height }]} testID={SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID}>
                {renderHeader()}
                <View style={styles.bodyContainer}>{isHintTryOut ? renderTryOutContent() : renderHintText(logic, [styles.hintLogicText])}</View>
                {renderFooter()}
            </View>
        </BottomDragger>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(SmartHintHC_))
