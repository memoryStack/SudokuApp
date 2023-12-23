import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { areSameCells } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { useBoardData } from '../hooks/useBoardData'

import { getStyles } from './nakedSingle.styles'

const examplePuzzle = '007005068005800100008197005010050600704286903002010050400539800009008400820400500'

const NakedSingle = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (areSameCells(cell, { row: 3, col: 2 })) return styles.highlightedCell
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
                    + `Naked Single means that in a <a href="${HINTS_VOCAB_IDS.CELL}">cell</a> only one <a href="${HINTS_VOCAB_IDS.CANDIDATE}">candidate</a> remains`
                    + ' possible and that candidate must fill the cell.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + 'Here in above Sudoku puzzle notice that in D3 cell only 3 is present as candidate because except 3 all the other'
                    + ` numbers from 1 to 9 are present in Dth <a href="${HINTS_VOCAB_IDS.ROW}">row</a>, 3rd <a href="${HINTS_VOCAB_IDS.COLUMN}">column</a> and 4th <a href="${HINTS_VOCAB_IDS.BLOCK}">block</a>.`
                    + '</p>'
                }
            />
        </View>
    )
}

export default React.memo(NakedSingle)
