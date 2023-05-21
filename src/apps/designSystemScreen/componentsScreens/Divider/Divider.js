import React, { memo } from 'react'

import { View } from 'react-native'

import _map from '@lodash/map'

import Divider, { DIVIDER_TYPES } from '@ui/atoms/Divider'

import Text from '@ui/atoms/Text'
import { styles } from './divider.styles'

const DIVIDERS = [
    {
        label: 'Horizontal Divider',
        type: DIVIDER_TYPES.HORIZONTAL,
    },
    {
        label: 'Vertical Divider',
        type: DIVIDER_TYPES.VERTICAL,
    },
]

const DividerDemo = () => {
    const renderItem = ({ label, type, ...rest }) => (
        <>
            <Text>{label}</Text>
            <View style={{ height: 100, width: 100, marginTop: 40 }} key={type}>
                <Divider type={type} label={label} {...rest} />
            </View>
        </>
    )

    return (
        <View style={styles.container}>
            {_map(DIVIDERS, renderItem)}
        </View>
    )
}

export default memo(DividerDemo)
