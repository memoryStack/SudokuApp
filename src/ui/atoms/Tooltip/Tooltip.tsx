import React from 'react'

import { Popable } from 'react-native-popable';
import type { PopableManager } from 'react-native-popable';

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './tooltip.styles'
import { ViewStyle } from 'react-native';
import _isArray from '@lodash/isArray';

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

    let finalContent = content

    if (typeof content !== 'string') {
        if (React.isValidElement(content)) {
            const styleProp = content.props.style
            const styleFromProps = _isArray(styleProp) ? Object.assign({}, ...styleProp) : styleProp

            finalContent = React.cloneElement(content, {
                style: {
                    ...styleFromProps,
                    color: styles.text.color
                },
            })
        }
    }

    return (
        <Popable
            ref={ref}
            content={finalContent}
            action={showOnPress ? undefined : "none"}
            style={[styles.container, containerStyle]}
            textStyle={styles.text}
            backgroundColor={styles.backgroundColor.backgroundColor}
            {...rest}
        >
            {children}
        </Popable>
    )
})

export default React.memo(Tooltip)
