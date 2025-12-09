import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { getStyles } from './chain.styles'
import { getLinkHTMLText } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const Chain = () => {
    const styles = useStyles(getStyles)
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'chain',
    })
    const renderHowToMakeAChain = () => (
        <View style={{ marginTop: 12 }}>
            <SmartHintText
                text={t('types')}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText text={t('intro')} />
            {renderHowToMakeAChain()}
            {/* {renderHowToMakeAChain()}
            {Example}
            {renderChainFormationDetails()}
            {renderChainEffectOnPuzzle()}
            {renderValidChainLengthDetails()} */}
        </View>
    )
}

export default React.memo(Chain)
