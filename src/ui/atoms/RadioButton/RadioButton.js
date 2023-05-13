import React, { memo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './radioButton.styles'

const Radio = props => {
    const { isSelected, disabled } = props

    const styles = useStyles(getStyles, { isSelected, disabled })

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
