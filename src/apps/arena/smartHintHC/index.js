import React, { useEffect, useRef } from 'react'
import { getContainerStyles, styles } from './styles'
import { View, Text, ScrollView, useWindowDimensions } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { CloseIcon } from '../../../resources/svgIcons/close'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { Button } from '../../../components/button'
import { noOperationFunction } from '../../../utils/util'

const HITSLOP = { top: 24, left: 24, bottom: 24, right: 24 }
const SmartHintHC_ = ({
    title = '',
    logic = '',
    parentHeight,
    onSmartHintHCClosed,
    nextButtonText = 'Next',
    prevButtonText = 'Prev',
    nextHintClick = noOperationFunction,
    prevHintClick = noOperationFunction,
    currentHintNum,
    totalHintsCount,
}) => {
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

    return (
        <BottomDragger
            ref={smartHintHCRef}
            stopBackgroundClickClose
            onDraggerClosed={onSmartHintHCClosed}
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
                            text={displayPrevButton ? prevButtonText : ''}
                            onClick={displayPrevButton ? prevHintClick : noOperationFunction}
                            avoidDefaultContainerStyles={true}
                            textStyles={styles.footerButtonText}
                            hitSlop={HITSLOP}
                        />
                        <Button
                            text={displayNextButton ? nextButtonText : ''} // TODO: find better way to hide the button.it's wtf right now
                            onClick={displayNextButton ? nextHintClick : noOperationFunction}
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

export default React.memo(SmartHintHC_)
