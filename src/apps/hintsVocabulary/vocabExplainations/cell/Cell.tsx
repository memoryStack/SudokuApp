import React from 'react'

import { View } from 'react-native'

import SmartHintText from '@ui/molecules/SmartHintText'
import { Board } from 'src/apps/arena/gameBoard'
import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { useStyles } from '@utils/customHooks/useStyles'
import { getStyles } from './cell.styles'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Cell = () => {
    const styles = useStyles(getStyles)

    const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(examplePuzzle)

    const Example = (
        <View style={styles.exampleBoardContainer}>
            <Board
                mainNumbers={mainNumbers}
                notes={notes}
                showCellContent
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    'In Sudoku, a Cell represents a single square where a number from 1 to 9 can be filled.'
                    + ' Sudoku contains 81 (9*9) such cells'
                }
            />
            {Example}
            <SmartHintText text="Here notice that some cells are already filled with numbers from 1 to 9 and some are empty." />
        </View>
    )
}

export default React.memo(Cell)
