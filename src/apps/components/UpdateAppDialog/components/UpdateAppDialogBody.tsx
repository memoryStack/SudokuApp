import React from 'react'

import { View } from 'react-native'

import _noop from '@lodash/noop'

import Radio from '@ui/atoms/RadioButton'
import Text from '@ui/atoms/Text'
import Dialog from '@ui/molecules/Dialog'

import { useStyles } from '@utils/customHooks/useStyles'
import { getStyles } from '../updateAppDialog.styles'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

type Props = {
    features: string[]
    cancellable: boolean
    onCancelPress: () => void
    onUpdatePress: () => void
}

export const DialogBody: React.FC<Props> = ({
    cancellable = true,
    features = [],
    onCancelPress,
    onUpdatePress
}) => {

    const styles = useStyles(getStyles)

    const { t } = useTranslation()

    const renderFeaturesList = () => (
        <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
                <View key={index} style={[styles.featureOptionContainer, index ? styles.featuresOptionsGap : null]}>
                    <Radio isSelected />
                    <Text style={styles.featureLabel}>{feature}</Text>
                </View>
            ))}
        </View>
    )

    const footerBtns = []
    if (cancellable) footerBtns.push({
        label: t('Cancel'),
        onClick: onCancelPress,
    })

    footerBtns.push({
        label: t('Update'),
        onClick: onUpdatePress,
    })

    return (
        <Dialog
            styles={styles.container}
            title={t('New Update Available')}
            body={renderFeaturesList()}
            footerButtonsConfig={footerBtns}
        />
    )
}
