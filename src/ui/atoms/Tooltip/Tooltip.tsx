import React from 'react'

import PropTypes from 'prop-types'

import { Popable } from 'react-native-popable';

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './tooltip.styles'

const Tooltip = React.forwardRef((props, ref) => {
    const {
        content,
        children,
        showOnPress = false,
        ...rest
    } = props
    const styles = useStyles(getStyles)

    return (
        <Popable
            ref={ref}
            content={content}
            action={showOnPress ? undefined : "none"}
            style={styles.container}
            textStyle={{ lineHeight: 16 }}
            {...rest}
        >
            {children}
        </Popable>
    )
})

export default React.memo(Tooltip)

Tooltip.propTypes = {

}

Tooltip.defaultProps = {

}
