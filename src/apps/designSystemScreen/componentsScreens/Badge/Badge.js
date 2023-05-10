import React, { memo } from 'react'

import { View } from 'react-native'

import Text from '@ui/atoms/Text'
import Badge from '@ui/atoms/Badge'

import { styles } from './badge.styles'

const BadgeDemo = () => (
    <View style={styles.container}>
        <View>
            <View style={{ height: 32, width: 32, backgroundColor: 'pink' }}>
                <Text>Icon</Text>
            </View>
            <Badge label="99999+" />
        </View>
    </View>
)

export default memo(BadgeDemo)
