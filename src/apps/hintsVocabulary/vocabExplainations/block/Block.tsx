import React, { useEffect, useRef, useState } from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _inRange from '@lodash/inRange'

import SmartHintText from '@ui/molecules/SmartHintText'
import { getPuzzleDataFromPuzzleString } from '@utils/testing/puzzleDataGenerators'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { getStyles } from './block.styles'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Block = () => {
    const styles = useStyles(getStyles)

    const [boardData, setBoardData] = useState({ mainNumbers: null, notes: null })

    useEffect(() => {
        setTimeout(() => {
            const generatePossibleNotes = false
            const { mainNumbers, notes } = getPuzzleDataFromPuzzleString(examplePuzzle, generatePossibleNotes)
            setBoardData({ mainNumbers, notes })
        })
    }, [])

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (_inRange(cell.row, { start: 3, end: 5 }) && _inRange(cell.col, { start: 3, end: 5 })) return styles.highlightedCell
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
                    + 'In Sudoku, a Block is a 3*3 square region separated by thick borders in Sudoku Puzzle below.'
                    + ' Each block contains 9 <a href="CELL">cells</a> arranged in 3 <a href="COLUMN">columns</a> and 3 <a href="ROW">rows</a>.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text="Here in the above Sudoku Puzzle these 9 highlighted cells make 5th block. And these are 9 such blocks."
            />
        </View>
    )
}

export default React.memo(Block)
