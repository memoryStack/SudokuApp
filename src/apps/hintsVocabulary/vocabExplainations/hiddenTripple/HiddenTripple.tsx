import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE } from 'src/apps/arena/utils/smartHints/constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { getCellsAxesValuesListText } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getCandidatesListText } from 'src/apps/arena/utils/smartHints/util'
import { highlightPrimaryHouseCells } from 'src/apps/arena/utils/smartHints/rawHintTransformers/hiddenGroup/hiddenGroup'
import { getStyles } from './hiddenTripple.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'

const oneHostHouse = '500620037004890000000050000930000000020000605700000003000009000000000700680570002'
const oneHostHouseHostCells = [{ row: 3, col: 5 }, { row: 5, col: 5 }, { row: 7, col: 5 }]
const oneHostHouseGroupCandidates = [2, 5, 6]
const oneHostHouseDetails = {
    cellsListText: getCellsAxesValuesListText(oneHostHouseHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    candidatesListText: getCandidatesListText(oneHostHouseGroupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
}

const HiddenTripple = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)

    const Example = !_isNil(oneHostHosueBoardData.mainNumbers) ? (
        <View style={styles.exampleBoardContainer}>
            <Board
                {...oneHostHosueBoardData}
                showCellContent
                getCellBGColor={(cell: Cell) => {
                    if (isCellExists(cell, oneHostHouseHostCells)) return styles.nakedDoubleHostCell
                    if (cell.col === 5) return styles.hostHouseCell
                    return null
                }}
            />
        </View>
    ) : null

    const removableNotesHighlight = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers)) return null

        const hostHouse = { type: HOUSE_TYPE.COL, num: 5 }

        const cellsHighlightData = {}
        highlightPrimaryHouseCells(
            hostHouse,
            oneHostHouseGroupCandidates,
            oneHostHouseHostCells,
            oneHostHosueBoardData.notes,
            cellsHighlightData,
            _get(theme, 'colors.smartHints'),
        )

        return (
            <View style={{ marginTop: 16 }}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>How Hidden Tripple Affects a House?</Text>
                <SmartHintText
                    text={
                        '<p>'
                        + `In below example ${oneHostHouseDetails.cellsListText} are locked for ${oneHostHouseDetails.candidatesListText}`
                        + ' because these numbers can\'t be filled in any other cells of 6th column. So, all the other candidates present'
                        + ' in these cells will be removed and these are highlighted in red color.'
                        + '<br />'
                        + `<b>Note:</b> exactly which cell out of ${oneHostHouseDetails.cellsListText} will be filled by which number is still not clear.`
                        + ' At this point only thing we can say for sure is that candidates highlighted in red color can be removed.'
                        + '</p>'
                    }
                />
                <View style={styles.exampleBoardContainer}>
                    <Board
                        {...oneHostHosueBoardData}
                        cellsHighlightData={cellsHighlightData}
                        showCellContent
                        getCellBGColor={(cell: Cell) => {
                            if (isCellExists(cell, oneHostHouseHostCells)) return styles.nakedDoubleHostCell
                            if (cell.col === 5) return styles.hostHouseCell
                            return null
                        }}
                        getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                            if (!show) return null
                            const noteColor = _get(cellsHighlightData, [cell.row, cell.col, 'notesToHighlightData', noteValue, 'fontColor'], null)
                            if (!noteColor) return null
                            return {
                                color: noteColor,
                                fontWeight: FONT_WEIGHTS.HEAVY,
                            }
                        }}
                    />
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>

            <SmartHintText
                text={
                    '<p>'
                    + `In ${getLinkHTMLText(HINTS_VOCAB_IDS.HIDDEN_DOUBLE, 'Hidden Double')}, we focus on two`
                    + ` ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidates')} in two ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cells')} in a ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.`
                    + ' Hidden Tripple is the extension of Hidden Double and here we will focus on three cells and three candidates.'
                    + '<br/>'
                    + '<br/>'
                    + 'A Hidden Tripple is formed when three candidates are present together only in three cells and nowhere else in a house.'
                    + ' Each of these three cells must have <b>atleast two</b> out of these three candidates.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + `Notice in above Sudoku Puzzle in 6th ${getLinkHTMLText(HINTS_VOCAB_IDS.COLUMN, 'column')} ${oneHostHouseDetails.candidatesListText} candidates are present`
                    + ` together only in ${oneHostHouseDetails.cellsListText} cells. So, it's a Hidden Tripple.`
                    + `\nIt is called "Hidden" because in ${oneHostHouseDetails.cellsListText} cells ${oneHostHouseDetails.candidatesListText} are hidden behind other candidates.`
                    + '\nAlso notice that in above example H6 doesn\'t have 5 as it\'s candidate. it\'s still a valid Hidden Tripple because all the cells must have <b>atleast two</b> out of three candidates and here H6 has 2, 6 as it\'s candidates out of 2, 5 and 6.'
                    + '</p>'
                }
            />
            {removableNotesHighlight()}
        </View>
    )
}

export default React.memo(HiddenTripple)
