import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import _isNil from '@lodash/isNil'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './column.styles'
import { useBoardData } from '../hooks/useBoardData'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Column = () => {
    const styles = useStyles(getStyles)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'column',
    })
    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (cell.col === 3) return styles.highlightedCell
                    return null
                }}
            />
        </View>
    ) : null

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
            />
            {Example}
            <SmartHintText
                text={t('observation')}
            />
        </View>
    )
}

export default React.memo(Column)
