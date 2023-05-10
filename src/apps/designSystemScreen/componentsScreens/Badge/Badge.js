import React, { memo } from 'react'

import { View } from 'react-native'

import Text from '@ui/atoms/Text'
import Badge from '@ui/atoms/Badge'

import { Page } from 'src/apps/components/Page'

import { styles } from './badge.styles'

const BadgeDemo = () => (
    <Page style={styles.container}>
        <View>
            <View style={{ height: 32, width: 32, backgroundColor: 'pink' }}>
                <Text>Icon</Text>
            </View>
            <Badge label="99999+" />
        </View>
    </Page>
)

export default memo(BadgeDemo)
