import React, { memo } from 'react'

import { View } from 'react-native'

import { styles } from './designSystem.styles'

const DesignSystem = () => {
    const a = 10
    return (
        <View style={styles.container}>
            <View style={{
                width: 20,
                height: 20,
                backgroundColor: 'red',
            }}
            />
        </View>
    )
}

export default memo(DesignSystem)
