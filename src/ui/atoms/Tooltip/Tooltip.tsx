import React from 'react'

import { Popable } from 'react-native-popable';

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './tooltip.styles'
import { ViewStyle } from 'react-native';

type Props = {
    content: string | React.ReactElement
    children: React.ReactElement
    showOnPress?: boolean
}

const Tooltip = React.forwardRef<React.ReactElement, Props>((props, ref) => {
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
            textStyle={{ lineHeight: 16 } as ViewStyle}
            {...rest}
        >
            {children}
        </Popable>
    )
})

export default React.memo(Tooltip)
