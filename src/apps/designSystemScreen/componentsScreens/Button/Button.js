import React, { memo } from 'react'

import { View } from 'react-native'

import _map from '@lodash/map'

import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'

import { styles } from './button.styles'

const BUTTONS = [
    {
        label: 'Filled Button',
        type: BUTTON_TYPES.FILLED,
    },
    {
        label: 'Filled Button Disabled',
        type: BUTTON_TYPES.FILLED,
        state: BUTTON_STATES.DISABLED,
    },
    {
        label: 'Tonal Button',
        type: BUTTON_TYPES.TONAL,
    },
    {
        label: 'Tonal Button Disabled',
        type: BUTTON_TYPES.TONAL,
        state: BUTTON_STATES.DISABLED,
    },
    {
        label: 'Text Button',
        type: BUTTON_TYPES.TEXT,
    },
    {
        label: 'Text Button Disabled',
        type: BUTTON_TYPES.TEXT,
        state: BUTTON_STATES.DISABLED,
    },
    {
        label: 'Outlined Button',
        type: BUTTON_TYPES.OUTLINED,
    },
]

const ButtonDemo = () => {
    const renderItem = ({ label, type, ...rest }) => (
        <Button
            key={type}
            containerStyle={{ marginTop: 40 }}
            type={type}
            label={label}
            {...rest}
        />
    )

    return (
        <View style={styles.container}>
            {_map(BUTTONS, renderItem)}
        </View>
    )
}

export default memo(ButtonDemo)
