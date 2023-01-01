import React, { useCallback, useEffect, useRef } from 'react'

import { View, Text, ScrollView, useWindowDimensions } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'
import _get from 'lodash/src/utils/get'
import _isEmpty from 'lodash/src/utils/isEmpty'

import { BottomDragger } from '../../components/BottomDragger'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { Button } from '../../../components/button'
import withActions from '../../../utils/hocs/withActions'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { getApplyHintChanges, getHintHCInfo } from '../store/selectors/smartHintHC.selectors'
import { useIsHintTryOutStep, useHintTryOutAnalyserResult } from '../utils/smartHints/hooks'
import { Inputpanel } from '../inputPanel'
import { TRY_OUT_RESULT_STATES } from '../utils/smartHints/tryOutInputAnalyser/constants'

import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import { getContainerStyles, styles } from './styles'
import { FOOTER_BUTTONS_TEXT, HITSLOP } from './constants'

const SmartHintHC_ = ({ parentHeight, onAction }) => {
    const {
        hint: { focusedCells, title = '', logic = '', selectCellOnClose, inputPanelNumbersVisibility } = {},
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
        scrollViewRef.current && scrollViewRef.current.scrollTo({ x: 0, y: newVerticalPosition, animated: true })
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

    const closeView = () => smartHintHCRef.current && smartHintHCRef.current.closeDragger()

    const onApplyHintClick = useCallback(() => {
        closeView()
        closeByApplyHintClick.current = true
    }, [onAction])

    const onClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: selectCellOnClose })
        closeByApplyHintClick.current && onAction({ type: ACTION_TYPES.ON_APPLY_HINT_CLICK, payload: applyHintChanges })
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

    const renderHeader = () => {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.hintTitleContainer}>
                    <Text style={styles.hintTitle}>{title}</Text>
                    {totalHintsCount > 1 ? (
                        <Text style={styles.hintsCountText}>{`${currentHintNum}/${totalHintsCount}`}</Text>
                    ) : null}
                </View>
                <Touchable touchable={TouchableTypes.opacity} onPress={closeView} hitSlop={HITSLOP}>
                    <CloseIcon height={24} width={24} fill={'rgba(0, 0, 0, .8)'} />
                </Touchable>
            </View>
        )
    }

    const renderHintText = () => {
        return (
            <ScrollView ref={scrollViewRef} onScroll={handleOnScroll}>
                <Text style={styles.hintLogicText}>{logic}</Text>
            </ScrollView>
        )
    }

    const getTryOutResultTextStyle = () => {
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.VALID_PROGRESS) return styles.tryOutProgressResult
        if (tryOutResult.state === TRY_OUT_RESULT_STATES.ERROR) return styles.tryOutErrorResult
        return styles.tryOutDefaultResult
    }

    const renderTryOutContent = () => {
        return (
            <>
                <Inputpanel numbersVisible={inputPanelNumbersVisibility} onAction={onAction} singleRow />
                <Text style={[styles.tryOutResult, getTryOutResultTextStyle()]}>{tryOutResult.msg}</Text>
            </>
        )
    }

    const renderFooter = () => {
        return (
            <View style={styles.footerContainer}>
                <Button
                    text={displayPrevButton ? FOOTER_BUTTONS_TEXT.PREV : ''}
                    onClick={displayPrevButton ? onPrevClick : _noop}
                    avoidDefaultContainerStyles={true}
                    textStyles={styles.footerButtonText}
                    hitSlop={HITSLOP}
                />
                {/* TODO: find better way to hide the button.it's wtf right now */}
                <Button
                    text={displayNextButton ? FOOTER_BUTTONS_TEXT.NEXT : FOOTER_BUTTONS_TEXT.APPLY_HINT}
                    onClick={displayNextButton ? onNextClick : onApplyHintClick}
                    avoidDefaultContainerStyles={true}
                    textStyles={styles.footerButtonText}
                    hitSlop={HITSLOP}
                />
            </View>
        )
    }

    return (
        <BottomDragger
            ref={smartHintHCRef}
            stopBackgroundClickClose
            onDraggerClosed={onClosed}
            parentHeight={parentHeight}
            bottomMostPositionRatio={1.1} // TODO: we can make it a default i guess
            animateBackgroundOverlayOnClose={false}
        >
            <View style={containerStyles}>
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
