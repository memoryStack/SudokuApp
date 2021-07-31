import React, { useEffect, useRef } from 'react'
import { View, Text, Animated } from 'react-native'
import { Styles } from './style'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS, GAME_STATE } from '../../../resources/constants'

const ANIMATION_DURATION = 100
const hitSlopDimension = 8
const hitSlop = { top: hitSlopDimension, bottom: hitSlopDimension, left: hitSlopDimension, right: hitSlopDimension }
const InputNumber_ = ({ number, gameState }) => {
    
    // subscribe and unsbscribe to the events
    useEffect(() => {
        return () => {

        }
    }, [])

    const showInputNumber = true // TODO: calculate this value for each number smartly
    const transformValue = useRef(new Animated.Value(0)).current
    const viewScaleAnimationConfig = transformValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.5], // mark this range as constant
    })

    const animateInputNumber = () => {
        Animated.timing(transformValue, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
        }).start(() => {
            Animated.timing(transformValue, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }).start()
        })
    }

    const onNumberClicked = () => {
        if (!showInputNumber || gameState !== GAME_STATE.ACTIVE) return
        animateInputNumber()
        emit(EVENTS.INPUT_NUMBER_CLICKED, { number })
    }

    return (
            showInputNumber ? 
                <Touchable 
                    // style={Styles.numberButtonContainer}
                    onPress={onNumberClicked}
                    touchable={TouchableTypes.opacity}
                    hitSlop={hitSlop}
                >
                    <Animated.View
                        style={[
                            Styles.numberContainer,
                            {
                                transform: [{ scale: viewScaleAnimationConfig }]
                            }
                        ]}
                    >
                        <View>
                            <Text style={Styles.textStyle}>{number}</Text>
                        </View>
                    </Animated.View>
                </Touchable>
            : null
    )
}

export const InputNumber = React.memo(InputNumber_)
