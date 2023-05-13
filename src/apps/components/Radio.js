import React, { memo } from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'

import { useStyles } from '@utils/customHooks/useStyles'
import { isHexColor, rgba } from '@utils/util'
import { useThemeValues } from '../arena/hooks/useTheme'

// TODO: move it to ui library

// TODO: this just got repeated
// we need to make some kind of utils
const getTransformedHexColor = ({ color, opacity }) => {
    if (!isHexColor(color)) return color
    return rgba(color, opacity)
}

const getStyles = ({ isSelected, disabled }, theme) => {
    let color = _get(theme, 'radioButton.default.color')
    if (isSelected) {
        color = _get(theme, 'radioButton.selected.color')
    }
    if (disabled) {
        color = getTransformedHexColor(_get(theme, 'radioButton.disabled'))
    }

    return StyleSheet.create({
        container: {
            justifyContent: 'center',
            alignItems: 'center',
            height: _get(theme, 'radioButton.outerRing.size'),
            width: _get(theme, 'radioButton.outerRing.size'),
            ..._get(theme, 'radioButton.outerRing.shape'),
            borderWidth: _get(theme, 'radioButton.outerRing.borderWidth'),
            borderColor: color,
        },
        innerDot: {
            height: _get(theme, 'radioButton.innerDot.size'),
            width: _get(theme, 'radioButton.innerDot.size'),
            ..._get(theme, 'radioButton.innerDot.shape'),
            backgroundColor: color,
        },
    })
}

const Radio = props => {
    const { isSelected, disabled } = props

    const styles = useStyles(getStyles, { isSelected, disabled })

    console.log('@@@@@', styles.container)
    console.log('@@@@@', styles.innerDot)

    const renderIconFill = () => {
        if (!isSelected || disabled) return null
        return <View style={styles.innerDot} />
    }

    return (
        <View style={styles.container}>
            {renderIconFill()}
        </View>
    )
}

Radio.propTypes = {
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
}

Radio.defaultProps = {
    isSelected: false,
    disabled: false,
}

export default memo(Radio)
