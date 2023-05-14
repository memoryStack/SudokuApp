import React, { memo } from 'react'

import { View } from 'react-native'

import _map from '@lodash/map'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'

import { styles } from './button.styles'

const BUTTONS = [
    {
        label: 'Filled Button',
        type: BUTTON_TYPES.FILLED,
    },
    {
        label: 'Tonal Button',
        type: BUTTON_TYPES.TONAL,
    },
    // {
    //     label: 'Text Button',
    //     type: BUTTON_TYPES.TEXT,
    // },
]

const ButtonDemo = () => {
    // TODO: remove this extra view and add this support in Button only
    const renderItem = ({ label, type }) => (
        <View style={{ marginTop: 40 }} key={type}>
            <Button type={type} label={label} />
        </View>
    )

    return (
        <View style={styles.container}>
            {_map(BUTTONS, renderItem)}
        </View>
    )
}

export default memo(ButtonDemo)
