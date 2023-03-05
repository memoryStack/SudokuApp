import React, { memo } from 'react'
import {
    StyleSheet,
    View,
} from 'react-native'

import PropTypes from 'prop-types'

const styles = StyleSheet.create({
    RadioHolder: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioIcon: {
        height: 12,
        width: 12,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

const colors = {
    selected: 'rgb(49, 90, 163)',
    disabled: 'rgba(0, 0, 0, 0.4)',
    default: 'rgba(0, 0, 0, 0.8)',
}

// this is an atom component
const Radio = props => {
    const {
        isSelected, disabled,
    } = props

    const getColor = () => {
        if (disabled) return colors.disabled
        if (isSelected) return colors.selected
        return colors.default
    }

    const renderIconFill = () => {
        if (!isSelected || disabled) return null
        return <View style={[styles.radioIcon, { backgroundColor: getColor() }]} />
    }

    return (
        <View
            style={[
                styles.RadioHolder,
                { borderColor: getColor() },
            ]}
        >
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
