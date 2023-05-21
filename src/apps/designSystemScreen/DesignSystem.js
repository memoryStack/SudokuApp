import React, { memo } from 'react'

import { View } from 'react-native'

import _map from '@lodash/map'

import Button from '@ui/molecules/Button'

import { ROUTES } from 'src/navigation/route.constants'
import { styles } from './designSystem.styles'

const BUTTONS_MAP = [
    {
        label: 'Badge',
        routeKey: ROUTES.BADGE,
    },
    {
        label: 'Typography',
        routeKey: ROUTES.TYPOGRAPHY,
    },
    {
        label: 'Button',
        routeKey: ROUTES.BUTTON,
    },
    {
        label: 'Divider',
        routeKey: ROUTES.DIVIDER,
    },
]

const DesignSystem = ({ navigation }) => {
    // TODO: remove this extra view and add this support in Button only
    const renderItem = ({ label, routeKey }) => (
        <View style={{ marginTop: 40 }} key={routeKey}>
            <Button
                onClick={() => navigation && navigation.navigate(routeKey)}
                label={label}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            {_map(BUTTONS_MAP, renderItem)}
        </View>
    )
}

export default memo(DesignSystem)
