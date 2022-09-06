import React from 'react'

import { View, Text } from 'react-native'

import { useSelector } from 'react-redux'

import PropTypes from 'prop-types'

import _noop from 'lodash/src/utils/noop'

import { HintIcon } from '../../../resources/svgIcons/hint'

import { Touchable, TouchableTypes } from '../../components/Touchable'

import { getGameState } from '../store/selectors/gameState.selectors'
import { GameState } from '../utils/classes/gameState'

import { Styles, INACTIVE_ICON_FILL } from './style'

// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their
// comfort and confidence level

const Hint_ = ({ iconBoxSize, hints, onClick }) => {
    const gameState = useSelector(getGameState)

    const renderTickerIcon = () => {
        return null
        if (!new GameState(gameState).isGameActive()) return null

        return (
            <View style={Styles.hintsTickerBox}>
                <Text style={Styles.hintsTickerText}>{hints}</Text>
            </View>
        )
    }

    return (
        <Touchable style={Styles.actionContainer} onPress={onClick} touchable={TouchableTypes.opacity}>
            <>
                <HintIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
                {renderTickerIcon()}
            </>
            <Text style={Styles.actionText}>{`Hint`}</Text>
        </Touchable>
    )
}

export const Hint = React.memo(Hint_)

Hint_.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    hints: PropTypes.number,
}

Hint_.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    hints: 0,
}
