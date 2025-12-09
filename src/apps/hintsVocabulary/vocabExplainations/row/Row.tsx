import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board, CellBGColorStyle } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './row.styles'
import { useBoardData } from '../hooks/useBoardData'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Row = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'row',
    })

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (cell.row === 3) return styles.highlightedCell as CellBGColorStyle
                    return null
                }}
            />
        </View>
    ) : null

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    t('intro')
                    // '<p>'
                    // + `In Sudoku, a Row refers to a horizontal line of 9 <a href="${HINTS_VOCAB_IDS.CELL}">cells</a> from left to right.`
                    // + ' There are 9 rows from top to bottom labeled as Row A, Row B, ..., Row I'
                    // + ' and each row contains 9 cells placed side by side horizontally.'
                    // + '</p>'
                }
            />
            {Example}
            <SmartHintText
                // text="Here in the above Sudoku Puzzle 9 highlighted cells make Dth row."
                text={t('observation')}
            />
        </View>
    )
}

export default React.memo(Row)
