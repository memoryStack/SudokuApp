import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { getPuzzleDataFromPuzzleString } from '@domain/board/testingUtils/puzzleDataGenerator'
import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './cell.styles'
import { useBoardData } from '../hooks/useBoardData'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Cell = () => {
    const styles = useStyles(getStyles)

    const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(examplePuzzle)

    const boardData = useBoardData(examplePuzzle)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'cell',
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                mainNumbers={mainNumbers}
                notes={notes}
                showCellContent
            />
        </View>
    ) : null

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
            />
            {Example}
            <SmartHintText text={t('observation')} />
        </View>
    )
}

export default React.memo(Cell)
