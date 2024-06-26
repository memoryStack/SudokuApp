import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _inRange from '@lodash/inRange'

import SmartHintText from '@ui/molecules/SmartHintText'

import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'

import { getStyles } from './block.styles'
import { useBoardData } from '../hooks/useBoardData'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const Block = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

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
                    + ` Each block contains 9 <a href="${HINTS_VOCAB_IDS.CELL}">cells</a> arranged in 3 <a href="${HINTS_VOCAB_IDS.COLUMN}">columns</a> and 3 <a href="${HINTS_VOCAB_IDS.ROW}">rows</a>.`
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
