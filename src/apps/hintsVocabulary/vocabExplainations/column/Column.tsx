import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import _isNil from '@lodash/isNil'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { getStyles } from './column.styles'
import { useBoardData } from '../hooks/useBoardData'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Column = () => {
    const styles = useStyles(getStyles)

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
                text={
                    '<p>'
                    + `In Sudoku, a Column refers to a vertical line of 9 <a href="${HINTS_VOCAB_IDS.CELL}">cells</a> from top to bottom.`
                    + ' In below Sudoku Board, There are 9 columns from left to right labeled as Column 1, Column 2, ..., Column 9'
                    + ' and each column contains 9 cells stacked vertically from top to bottom.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text="Here in the above Sudoku Puzzle 9 highlighted cells make 4th column."
            />
        </View>
    )
}

export default React.memo(Column)
