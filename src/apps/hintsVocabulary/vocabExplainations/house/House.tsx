import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './house.styles'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const House = () => {
    const styles = useStyles(getStyles)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'house',
    })

    const ExampleBoard = (
        <View style={styles.exampleBoardContainer}>
            <Board />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
            />
            {ExampleBoard}
        </View>
    )
}

export default React.memo(House)
