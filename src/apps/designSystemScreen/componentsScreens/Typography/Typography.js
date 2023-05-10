import React, { memo } from 'react'

import { View, ScrollView } from 'react-native'

import _map from '@lodash/map'
import _get from '@lodash/get'

import Text from '@ui/atoms/Text'

import { Page } from 'src/apps/components/Page'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { styles } from './typography.styles'
import { TYPOGRAPHIES } from './typography.constants'

const TypographyDemo = ({ navigation }) => {
    const theme = useThemeValues()

    const renderTypographyVariant = ({ title, tokensPath }) => {
        const tokensStyles = _get(theme, `typography.${tokensPath}`)

        return (
            <View style={styles.variantContainer}>
                <Text style={styles.variantTitle}>{title}</Text>
                <Text style={tokensStyles}>Typography</Text>
            </View>
        )
    }

    return (
        <Page style={styles.container}>
            <ScrollView>
                {_map(TYPOGRAPHIES, renderTypographyVariant)}
            </ScrollView>
        </Page>
    )
}

export default memo(TypographyDemo)
