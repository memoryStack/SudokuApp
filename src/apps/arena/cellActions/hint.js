import React from 'react'

import { Text } from 'react-native'

import PropTypes from 'prop-types'

import _noop from '@lodash/noop'

import Badge from '@ui/atoms/Badge'

import { HintIcon } from '@resources/svgIcons/hint'

import { Touchable } from '../../components/Touchable'

import { Styles, INACTIVE_ICON_FILL } from './style'

// TODO: i should make it as a part of settings so that users can change it according to their confidence level
// and also we can make the hints numbers vary according to the difficulty level. user can customize that as per their
// comfort and confidence level

const Hint_ = ({
    iconBoxSize, hints, onClick, disabled, ...rest
}) => {
    const renderHintsCount = () => {
        if (disabled) return null
        return (
            <Badge label={hints} styles={Styles.hintsTickerBox} />
        )
    }

    return (
        <Touchable style={Styles.actionContainer} onPress={onClick} {...rest}>
            <>
                <HintIcon iconBoxSize={iconBoxSize} fill={INACTIVE_ICON_FILL} />
                {renderHintsCount()}
            </>
            <Text style={Styles.actionText}>Hint</Text>
        </Touchable>
    )
}

export const Hint = React.memo(Hint_)

Hint_.propTypes = {
    iconBoxSize: PropTypes.number,
    onClick: PropTypes.func,
    hints: PropTypes.number,
    disabled: PropTypes.bool,
}

Hint_.defaultProps = {
    iconBoxSize: 40,
    onClick: _noop,
    hints: 0,
    disabled: false,
}
