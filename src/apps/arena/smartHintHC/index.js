import React, { useCallback, useEffect, useRef } from 'react'

import {
    View, ScrollView, useWindowDimensions,
} from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'
import _get from '@lodash/get'
import _isEmpty from '@lodash/isEmpty'

import { CloseIcon } from '@resources/svgIcons/close'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { BottomDragger, getCloseDraggerHandler } from '../../components/BottomDragger'

import withActions from '../../../utils/hocs/withActions'

import { Touchable } from '../../components/Touchable'

import { getApplyHintChanges, getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { useIsHintTryOutStep, useHintTryOutAnalyserResult } from '../utils/smartHints/hooks'
import { Inputpanel } from '../inputPanel'
import { TRY_OUT_RESULT_STATES } from '../utils/smartHints/tryOutInputAnalyser/constants'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { getContainerStyles, styles } from './styles'
import {
    FOOTER_BUTTONS_TEXT,
    SMART_HINT_HC_TEST_ID,
    CLOSE_ICON_TEST_ID,
    SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID,
    SMART_HINT_HC_STEP_COUNT_TEXT_TEST_ID,
} from './constants'

const SmartHintHC_ = ({ parentHeight, onAction }) => {
    const {
        hint: {
            focusedCells, title = '', logic = '', selectCellOnClose, inputPanelNumbersVisibility,
        } = {},
        currentHintNum,
        totalHintsCount,
    } = useSelector(getHintHCInfo)

    const closeByApplyHintClick = useRef(false)

    const applyHintChanges = useSelector(getApplyHintChanges)

    const tryOutResult = useHintTryOutAnalyserResult()

    const isHintTryOut = useIsHintTryOutStep()

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: { focusedCells, styles } })
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    const smartHintHCRef = useRef(null)

    const { height: windowHeight } = useWindowDimensions()

    const scrollViewRef = useRef(null)
    const hintsScrollPositions = useRef({})

    const scrollHintView = newVerticalPosition => {
        const scrollHandler = _get(scrollViewRef, 'current.scrollTo', _noop)
        scrollHandler({ x: 0, y: newVerticalPosition, animated: true })
    }

    useEffect(() => {
        const newVerticalPosition = _get(hintsScrollPositions.current, [currentHintNum], 0)
        scrollHintView(newVerticalPosition)
    }, [currentHintNum])

    const onNextClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEXT_CLICK })
    }, [onAction])

    const onPrevClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PREV_CLICK })
    }, [onAction])

    const closeView = () => {
        const closeDragger = getCloseDraggerHandler(smartHintHCRef)
        closeDragger()
    }

    const onApplyHintClick = useCallback(() => {
        closeView()
        closeByApplyHintClick.current = true
    }, [])

    const onClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: selectCellOnClose })
        const shouldApplyHint = closeByApplyHintClick.current && !_isEmpty(applyHintChanges)
        if (shouldApplyHint) onAction({ type: ACTION_TYPES.ON_APPLY_HINT_CLICK, payload: applyHintChanges })
    }, [onAction, selectCellOnClose, applyHintChanges])

    const handleOnScroll = ({ nativeEvent: { contentOffset: { y = 0 } } = {} } = {}) => {
        if (hintsScrollPositions.current) hintsScrollPositions.current[currentHintNum] = y
    }

    const isOnlyHint = totalHintsCount <= 1
    const isLastHint = currentHintNum === totalHintsCount
    const isFirstHint = currentHintNum === 1
    const displayNextButton = !(isOnlyHint || isLastHint)
    const displayPrevButton = !(isOnlyHint || isFirstHint)

    const containerStyles = getContainerStyles(windowHeight)

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
                <CloseIcon height={24} width={24} fill="rgba(0, 0, 0, .8)" />
            </Touchable>
        </View>
    )

    const renderHintText = () => (
        <ScrollView ref={scrollViewRef} onScroll={handleOnScroll}>
            <Text style={styles.hintLogicText}>{logic}</Text>
        </ScrollView>
    )

    const getTryOutResultTextStyle = () => {
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.VALID_PROGRESS) return styles.tryOutProgressResult
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.ERROR) return styles.tryOutErrorResult
        return styles.tryOutDefaultResult
    }

    const renderTryOutContent = () => (
        <>
            <Inputpanel numbersVisible={inputPanelNumbersVisibility} onAction={onAction} singleRow />
            <Text style={[styles.tryOutResult, getTryOutResultTextStyle()]}>{tryOutResult.msg}</Text>
        </>
    )

    const renderFooter = () => (
        <View style={styles.footerContainer}>
            <Button
                label={displayPrevButton ? FOOTER_BUTTONS_TEXT.PREV : ''}
                onClick={displayPrevButton ? onPrevClick : _noop}
                avoidDefaultContainerStyles
                textStyles={styles.footerButtonText}
                type={BUTTON_TYPES.TEXT}
            />
            <Button
                label={displayNextButton ? FOOTER_BUTTONS_TEXT.NEXT : FOOTER_BUTTONS_TEXT.APPLY_HINT}
                onClick={displayNextButton ? onNextClick : onApplyHintClick}
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
            <View style={containerStyles} testID={SMART_HINT_HC_BOTTOM_DRAGGER_CHILD_TEST_ID}>
                {renderHeader()}
                <View style={styles.bodyContainer}>{isHintTryOut ? renderTryOutContent() : renderHintText()}</View>
                {renderFooter()}
            </View>
        </BottomDragger>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(SmartHintHC_))

SmartHintHC_.propTypes = {
    parentHeight: PropTypes.number,
    onAction: PropTypes.func,
}

SmartHintHC_.defaultProps = {
    parentHeight: 0,
    onAction: _noop,
}
