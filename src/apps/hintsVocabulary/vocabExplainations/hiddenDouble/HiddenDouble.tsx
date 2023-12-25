import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'
import _cloneDeep from '@lodash/cloneDeep'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE } from 'src/apps/arena/utils/smartHints/constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { CellsFocusData } from 'src/apps/arena/utils/smartHints/types'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import { getCellsAxesValuesListText } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getCandidatesListText } from 'src/apps/arena/utils/smartHints/util'
import { highlightPrimaryHouseCells } from 'src/apps/arena/utils/smartHints/rawHintTransformers/hiddenGroup/hiddenGroup'
import { getStyles } from './hiddenDouble.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'

type ZoomableViewConfigs = {
    initialZoom?: number
    initialOffsetX?: number
    initialOffsetY?: number
}

const oneHostHouse = '200710805000085009000069710627001008001050600400600931092370000300540000504092006'
const oneHostHouseHostCells = [{ row: 1, col: 0 }, { row: 1, col: 1 }]
const oneHostHouseGroupCandidates = [1, 7]
const oneHostHouseDetails = {
    cellsListText: getCellsAxesValuesListText(oneHostHouseHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    candidatesListText: getCandidatesListText(oneHostHouseGroupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
}

const HiddenDouble = () => {
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
                    return null
                }}
            />
            <SmartHintText
                text={

                    '<p>'
                    + `Notice in above Sudoku Puzzle in 1st ${getLinkHTMLText(HINTS_VOCAB_IDS.BLOCK, 'block')} ${oneHostHouseDetails.candidatesListText} are present`
                    + ` together only in ${oneHostHouseDetails.cellsListText} as candidates. So, it's a Hidden Double.`
                    + `\nIt is called "Hidden" because in ${oneHostHouseDetails.cellsListText} cells ${oneHostHouseDetails.candidatesListText} are hidden behind other candidates`
                    + ' due to this it\'s a little harder to find.'
                    + '</p>'
                }
            />
        </View>
    ) : null

    // by default in zoom 1, 5th block will be focused
    const renderTruncatedBoardForExample = (
        mainNumbers: MainNumbers,
        notes: Notes,
        cellsFocusData: CellsFocusData = {},
        bgHighlightedCells: Cell[] = [],
        zoomableViewConfigs: ZoomableViewConfigs = {},
    ) => (
        <View style={styles.truncatedBoardContainer}>
            <ReactNativeZoomableView
                initialZoom={zoomableViewConfigs.initialZoom || 1}
                zoomEnabled={false}
                initialOffsetX={zoomableViewConfigs.initialOffsetX || -10}
                initialOffsetY={zoomableViewConfigs.initialOffsetY || 10}
                disableShifting
            >
                <Board
                    notes={notes}
                    mainNumbers={mainNumbers}
                    cellsHighlightData={cellsFocusData}
                    showCellContent
                    getCellBGColor={(cell: Cell) => {
                        if (isCellExists(cell, bgHighlightedCells)) return styles.nakedDoubleHostCell
                        return null
                    }}
                    getNoteStyles={({ noteValue, show }: Note, cell: Cell) => {
                        if (!show) return null
                        const noteColor = _get(cellsFocusData, [cell.row, cell.col, 'notesToHighlightData', noteValue, 'fontColor'], null)
                        if (!noteColor) return null
                        return {
                            color: noteColor,
                            fontWeight: FONT_WEIGHTS.HEAVY,
                        }
                    }}
                />
            </ReactNativeZoomableView>
        </View>
    )

    const removableNotesHighlight = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers)) return null

        const hostHouse = { type: HOUSE_TYPE.BLOCK, num: 0 }

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
            <View style={styles.removableNotesExampleContainer}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>How Hidden Double Affects a House?</Text>
                <SmartHintText
                    text={
                        '<p>'
                        + `In below example ${oneHostHouseDetails.candidatesListText} will be filled only in the highlighted cells`
                        + ' and other candidates highlighted in red color will be removed these cells.'
                        + '<br />'
                        + '<b>Note:</b> exactly which cell will be filled by 1 and which will be filled by 7 is still not clear.'
                        + '</p>'
                    }
                />

                <View style={styles.removableNotesBoardContainer}>
                    {renderTruncatedBoardForExample(
                        oneHostHosueBoardData.mainNumbers,
                        oneHostHosueBoardData.notes,
                        cellsHighlightData,
                        oneHostHouseHostCells,
                        { initialOffsetX: 110, initialOffsetY: 120 },
                    )}
                </View>
            </View>
        )
    }

    const invalidHiddenDouble = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers)) return null
        const firstExampleHostCells = [{ row: 7, col: 1 }, { row: 7, col: 2 }, { row: 8, col: 1 }]
        const secondExampleHostCells = [{ row: 0, col: 7 }, { row: 1, col: 6 }, { row: 1, col: 7 }, { row: 2, col: 8 }]
        return (
            <View style={{ marginTop: 16 }}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>Invalid Hidden Double Example:</Text>
                <View style={styles.invalidExamplesBoardContainer}>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: 110, initialOffsetY: -110 })}
                    <Text>OR</Text>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, secondExampleHostCells, { initialOffsetX: -120, initialOffsetY: 120 })}
                </View>
                <Text style={{ marginTop: 8 }}>
                    {
                        'In left example above, 6 and 7 appear two times only in this block but these are distributed over three cells.'
                        + ' And in right side example, 3 and 6 also appear two times only but these are spread over four cells. To be a valid'
                        + ' Hidden Double both candidates have to be present two times and only in two cells of a house.'
                    }
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                        + `In ${getLinkHTMLText(HINTS_VOCAB_IDS.HIDDEN_SINGLE, 'Hidden Single')}, we focus on only one ${getLinkHTMLText(HINTS_VOCAB_IDS.CANDIDATE, 'candidate')} and one ${getLinkHTMLText(HINTS_VOCAB_IDS.CELL, 'cell')} in a ${getLinkHTMLText(HINTS_VOCAB_IDS.HOUSE, 'house')}.`
                        + ' Hidden Double is the extension of Hidden Single and here we will focus on two candidates and two cells in a house.'
                        + '<br/>'
                        + 'A Hidden Double is formed when two candidates are present together only in two cells of a house.'
                    + '</p>'
                }
            />
            {Example}
            {invalidHiddenDouble()}
            {removableNotesHighlight()}
        </View>
    )
}

export default React.memo(HiddenDouble)
