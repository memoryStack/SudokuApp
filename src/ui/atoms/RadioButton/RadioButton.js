import React, { memo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './radioButton.styles'
import { TEST_IDS } from './radioButton.constants'

// NOTE: if option is "disabled" then option-disabled-feedback have to be implemented by
// the parent element, since this is just dumb UI with any Touchability functionality
const Radio = props => {
    const { isSelected, disabled, testID: rootTestID } = props

    const styles = useStyles(getStyles, { isSelected, disabled })

    const renderIconFill = () => {
        if (!isSelected || disabled) return null
        return <View style={styles.innerDot} testID={TEST_IDS.INNER_DOT} />
    }

    return (
        <View style={styles.container} testID={rootTestID}>
            {renderIconFill()}
        </View>
    )
}

Radio.propTypes = {
    isSelected: PropTypes.bool,
    disabled: PropTypes.bool,
    testID: PropTypes.string,
}

Radio.defaultProps = {
    isSelected: false,
    disabled: false,
    testID: TEST_IDS.OUTER_RING,
}

export default memo(Radio)
