import React from 'react'

import { StyleProp, ViewStyle } from 'react-native'

import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { useTranslation } from '../../../i18n/hooks/useTranslation'
import { Touchable } from '../../../apps/components/Touchable'

import { getStyles } from './button.styles'
import { BUTTON_STATES, BUTTON_TYPES } from './button.constants'

interface Props {
    children?: React.ReactNode,
    onPress: () => unknown,
    containerStyle?: StyleProp<ViewStyle>,
    label?: string,
    textStyles?: StyleProp<ViewStyle>,
    avoidDefaultContainerStyles?: boolean,
    type?: BUTTON_TYPES,
    state?: BUTTON_STATES,
    textType?: TEXT_VARIATIONS,
    testID?: string,
}

const Button_: React.FC<Props> = ({
    onPress = _noop,
    containerStyle = null,
    label = '',
    textStyles = {},
    avoidDefaultContainerStyles = false,
    type = BUTTON_TYPES.FILLED,
    state = BUTTON_STATES.ENABLED,
    children = null,
    textType,
    ...rest
}) => {
    const { t } = useTranslation()

    const styles = useStyles(getStyles, {
        type,
        state,
        isLabelAvailable: !!label,
        isIconAvailable: false,
    })

    const getTextFinalStyles = () => Object.assign({}, styles.labelDefaultColor, !textType && styles.labelDefaultFont, textStyles)

    const renderLabel = () => (
        <Text style={getTextFinalStyles()} type={textType}>
            {t(label)}
        </Text>
    )

    return (
        <Touchable
            style={[avoidDefaultContainerStyles ? null : styles.defaultContainer, containerStyle]}
            avoidDefaultStyles={avoidDefaultContainerStyles}
            onPress={onPress}
            disabled={state === BUTTON_STATES.DISABLED}
            addHitSlop={type === BUTTON_TYPES.TEXT}
            accessibilityRole="button"
            {...rest}
        >
            {children || renderLabel()}
        </Touchable>
    )
}

export default React.memo(Button_)
