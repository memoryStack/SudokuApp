import React from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './divider.styles'
import { DIVIDER_TYPES } from './divider.constants'

const Divider = ({
    style,
    type,
    ...rest
}) => {
    const styles = useStyles(getStyles, { type })

    return (
        <View style={[styles.container, style]} {...rest} />
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
