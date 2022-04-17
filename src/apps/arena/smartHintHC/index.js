import React, { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getContainerStyles, styles } from './styles'
import { View, Text, ScrollView, useWindowDimensions } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { Button } from '../../../components/button'
import { noOperationFunction } from '../../../utils/util'
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import withActions from '../../../utils/hocs/withActions'
import { getHintHCInfo } from '../store/selectors/smartHintHC.selectors'

const NEXT_BUTTON_TEXT = 'Next'
const PREV_BUTTON_TEXT = 'Prev'
const HITSLOP = { top: 24, left: 24, bottom: 24, right: 24 }
const SmartHintHC_ = ({ parentHeight, onAction }) => {
    const {
        show: showSmartHint,
        hint: { techniqueInfo: { title = '', logic = '' } = {}, selectCellOnClose } = {},
        currentHintNum,
        totalHintsCount,
    } = useSelector(getHintHCInfo)

    useEffect(() => {
        return () => {
            onAction({ type: ACTION_TYPES.ON_UNMOUNT })
        }
    }, [])

    const onNextClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_NEXT_CLICK })
    }, [onAction])

    const onPrevClick = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_PREV_CLICK })
    }, [onAction])

    const onClosed = useCallback(() => {
        onAction({ type: ACTION_TYPES.ON_CLOSE, payload: selectCellOnClose })
    }, [onAction, selectCellOnClose])

    const smartHintHCRef = useRef(null)

    const { height: windowHeight } = useWindowDimensions()

    const scrollViewRef = useRef(null)
    const hintsScrollPositions = useRef({})

    useEffect(() => {
        if (hintsScrollPositions.current && hintsScrollPositions.current[currentHintNum] === undefined) {
            scrollViewRef.current && scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true })
        } else {
            const previousScrollPosition = hintsScrollPositions.current && hintsScrollPositions.current[currentHintNum]
            scrollViewRef.current && scrollViewRef.current.scrollTo({ x: 0, y: previousScrollPosition, animated: true })
        }
    }, [currentHintNum])

    const handleOnScroll = ({ nativeEvent: { contentOffset: { y = 0 } } = {} } = {}) => {
        if (hintsScrollPositions.current) hintsScrollPositions.current[currentHintNum] = y
    }

    const closeView = () => smartHintHCRef.current && smartHintHCRef.current.closeDragger(true)

    const isOnlyHint = totalHintsCount <= 1
    const isLastHint = currentHintNum === totalHintsCount
    const isFirstHint = currentHintNum === 1
    const displayNextButton = !(isOnlyHint || isLastHint)
    const displayPrevButton = !(isOnlyHint || isFirstHint)

    const displayFooter = displayNextButton || displayPrevButton

    const containerStyles = getContainerStyles(windowHeight, displayFooter)

    if (!showSmartHint) return null

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
                <ScrollView style={styles.logicContainer} ref={scrollViewRef} onScroll={handleOnScroll}>
                    <Text style={styles.hintLogicText}>{logic}</Text>
                </ScrollView>
                {displayFooter ? (
                    <View style={styles.footerContainer}>
                        <Button
                            text={displayPrevButton ? PREV_BUTTON_TEXT : ''}
                            onClick={displayPrevButton ? onPrevClick : noOperationFunction}
                            avoidDefaultContainerStyles={true}
                            textStyles={styles.footerButtonText}
                            hitSlop={HITSLOP}
                        />
                        <Button
                            text={displayNextButton ? NEXT_BUTTON_TEXT : ''} // TODO: find better way to hide the button.it's wtf right now
                            onClick={displayNextButton ? onNextClick : noOperationFunction}
                            avoidDefaultContainerStyles={true}
                            textStyles={styles.footerButtonText}
                            hitSlop={HITSLOP}
                        />
                    </View>
                ) : null}
            </View>
        </BottomDragger>
    )
}

export default React.memo(withActions(ACTION_HANDLERS)(SmartHintHC_))
