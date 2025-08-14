import React from 'react'

import { Popable } from 'react-native-popable';
import type { PopableManager } from 'react-native-popable';

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './tooltip.styles'
import { ViewStyle } from 'react-native';

type Props = {
    content: string | React.ReactElement
    children: React.ReactElement
    showOnPress?: boolean
    containerStyle?: ViewStyle
}

const Tooltip = React.forwardRef<PopableManager, Props>((props, ref) => {
    const {
        content,
        children,
        showOnPress = false,
        containerStyle,
        ...rest
    } = props
    const styles = useStyles(getStyles)

    return (
        <Popable
            ref={ref}
            content={content}
            action={showOnPress ? undefined : "none"}
            style={[styles.container, containerStyle]}
            textStyle={{ lineHeight: 16 } as ViewStyle}
            {...rest}
        >
            {children}
        </Popable>
    )
})

export default React.memo(Tooltip)
