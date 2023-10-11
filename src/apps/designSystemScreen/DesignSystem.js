import React, { memo } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import _map from '@lodash/map'

import Button from '@ui/molecules/Button'

import { ROUTES } from '../../navigation/route.constants'
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
    {
        label: 'Dialog',
        routeKey: ROUTES.DIALOG,
    },
]

const DesignSystem = ({ navigation }) => {
    const renderItem = ({ label, routeKey }) => (
        <Button
            key={routeKey}
            containerStyle={{ marginTop: 40 }}
            onPress={() => navigation && navigation.navigate(routeKey)}
            label={label}
        />
    )

    return (
        <View style={styles.container}>
            {_map(BUTTONS_MAP, renderItem)}
        </View>
    )
}

export default memo(DesignSystem)

DesignSystem.propTypes = {
    navigation: PropTypes.object,
}

DesignSystem.defaultProps = {
    navigation: {},
}
