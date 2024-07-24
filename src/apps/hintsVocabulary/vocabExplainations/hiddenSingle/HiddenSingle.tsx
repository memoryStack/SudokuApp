import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'

import { getCellHouseForHouseType } from '@domain/board/utils/housesAndCells'

import { areSameCells, isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { useBoardData } from '../hooks/useBoardData'

import { getStyles } from './hiddenSingle.styles'

const examplePuzzle = '760059080050100004000700000603090820005020600021070405000006000900008040010540036'

const hiddenSingleHostCell = { row: 2, col: 0 }
const hiddenSingleCauseCells = [
    { row: 1, col: 3 },
    { row: 5, col: 2 },
    { row: 8, col: 1 },
]

const HiddenSingle = () => {
    const styles = useStyles(getStyles)

    const boardData = useBoardData(examplePuzzle)

    const Example = !_isNil(boardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...boardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (areSameCells(cell, hiddenSingleHostCell)) return styles.hiddenSingleHostCell
                    if (isCellExists(cell, hiddenSingleCauseCells)) return styles.hiddenSingleCauseCell
                    if (getCellHouseForHouseType(HOUSE_TYPE.BLOCK, cell).num === 0) return styles.hostHouseCell
                    return null
                }}
            />
        </View>
    ) : null

    const HowToSpot = (
        <View style={styles.spotHiddenSingle}>
            <Text type={TEXT_VARIATIONS.HEADING_SMALL}>How to spot Hidden Single?</Text>
            <SmartHintText
                text={
                    '<p>'
                    + 'Concentrate on one candidate and one block and check where this candidate can come that block cells.'
                    + ' If there is only 1 cell where it can come then you have spotted a Hidden Single.'
                    + '</p>'
                }
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `Hidden Single means that a particular number appears as a <a href="${HINTS_VOCAB_IDS.CANDIDATE}">candidate</a> in only one`
                    + ` <a href="${HINTS_VOCAB_IDS.CELL}">cell</a> of any <a href="${HINTS_VOCAB_IDS.ROW}">row</a>, <a href="${HINTS_VOCAB_IDS.COLUMN}">column</a>, or <a href="${HINTS_VOCAB_IDS.BLOCK}">block</a>.`
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + 'Here in above Sudoku puzzle notice that in 1st Block 1 is present as a candidate in C1 cell only.'
                    + ' It can\'t come in any other empty cell of 1st block like A3, B1, B3, C2 and C3 because 1 is filled in'
                    + ' B4, F3 and I2 cells already. So, C1 will be filled by 1 only because this candidate has no other place in 1st block.'
                    + '<br />'
                    + ` It is called Hidden Single because unlike <a href="${HINTS_VOCAB_IDS.NAKED_SINGLE}">Naked Single</a> candidate 1 is hidden among other candidates like 2, 3, 4 and 8 in the cell.`
                    + '</p>'
                }
            />
            {HowToSpot}
        </View>
    )
}

export default React.memo(HiddenSingle)
