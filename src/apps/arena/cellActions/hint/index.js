import React, { useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Styles } from './style'
import { HintIcon } from '../../../../resources/svgIcons/hint'
import { Touchable, TouchableTypes } from '../../../components/Touchable'
import { emit, addListener, removeListener } from '../../../../utils/GlobalEventBus'
import { EVENTS } from '../../../../resources/constants'

const Hint_ = ({ iconBoxSize }) => {

    const gameState = 'active'
    const [hints, setHints] = useState(3) // default hints

    // passing it as prop so let's use useCallback
    const onPress = useCallback(() => {
        // TODO: it would be cool if i can animate the icon
        // to show that wisdom got transfered
        emit(EVENTS.HINT_CLICKED)
    }, [])

    useEffect(() => {
        const handler = () => {
            setHints(hints-1)
        }
        addListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        return () => {
            removeListener(EVENTS.HINT_USED_SUCCESSFULLY, handler)
        }
    }, [hints])

    return (
        <Touchable
            style={Styles.container}
            onPress={onPress}
            touchable={TouchableTypes.opacity}
        >
            <>
                <HintIcon iconBoxSize={iconBoxSize} />
                {
                    true && gameState === 'active' ?
                        <View style={Styles.tickerBox}>
                            <Text style={Styles.tickerText}>{hints}</Text>
                        </View>
                    : null
                }
            </>
            <Text style={Styles.textStyle}>{`Hint`}</Text>
        </Touchable>
    )
}

export const Hint = React.memo(Hint_)