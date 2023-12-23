import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { useStyles } from '@utils/customHooks/useStyles'
import { getStyles } from './row.styles'
import { useBoardData } from '../hooks/useBoardData'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Row = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (cell.row === 3) return styles.highlightedCell
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
                    + 'In Sudoku, a Row refers to a horizontal line of 9 <a href="CELL">cells</a> from left to right.'
                    + ' There are 9 rows from top to bottom labeled as Row A, Row B, ..., Row I'
                    + ' and each row contains 9 cells placed side by side horizontally.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text="Here in the above Sudoku Puzzle 9 highlighted cells make Dth row."
            />
        </View>
    )
}

export default React.memo(Row)
