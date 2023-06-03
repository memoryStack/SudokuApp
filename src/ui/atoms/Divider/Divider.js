import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './divider.styles'
import { DIVIDER_TEST_ID, DIVIDER_TYPES } from './divider.constants'

const Divider = ({
    style,
    type,
    ...rest
}) => {
    const styles = useStyles(getStyles, { type })

    return (
        <View
            testID={DIVIDER_TEST_ID}
            style={[styles.container, style]}
            {...rest}
        />
    )
}

export default React.memo(Divider)

Divider.propTypes = {
    style: PropTypes.object,
    type: PropTypes.oneOf(Object.values(DIVIDER_TYPES)),
}

Divider.defaultProps = {
    style: null,
    type: DIVIDER_TYPES.HORIZONTAL,
}
