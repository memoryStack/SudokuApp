import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import {
    getHousesCellsSharedByCells, isCellExists,
} from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HOUSE_TYPE } from 'src/apps/arena/utils/smartHints/constants'
import Text from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import _cloneDeep from '@lodash/cloneDeep'
import { CellsFocusData } from 'src/apps/arena/utils/smartHints/types'
import { getCellsHighlightData } from 'src/apps/arena/utils/smartHints/rawHintTransformers/nakedGroup/nakedGroup'
import { getHouseCells } from 'src/apps/arena/utils/houseCells'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import _get from '@lodash/get'
import { getStyles } from './nakedDouble.styles'
import { useBoardData } from '../hooks/useBoardData'

const oneHostHouse = '687004523953002614142356978310007246760000305020000701096001032230000057070000069'
const oneHostHouseHostCells = [{ row: 3, col: 4 }, { row: 4, col: 5 }]
const twoHostHouse = '800210047040089100000040000000098005090030000007001409000000000003000254200000008'
const twoHostHouseHostCells = [{ row: 7, col: 4 }, { row: 7, col: 5 }]

const NakedDouble = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)
    const twoHostHosueBoardData = useBoardData(twoHostHouse, 1000)

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
        </View>
    ) : null

    const renderTruncatedBoardForExample = (mainNumbers: MainNumbers, cellsFocusData: CellsFocusData = {}) => (
        <View style={styles.truncatedBoardContainer}>
            <ReactNativeZoomableView
                initialZoom={1}
                zoomEnabled={false}
                initialOffsetX={-10}
                initialOffsetY={10}
                disableShifting
            >
                <Board
                    notes={oneHostHosueBoardData.notes}
                    mainNumbers={mainNumbers}
                    cellsHighlightData={cellsFocusData}
                    showCellContent
                    getCellBGColor={(cell: Cell) => {
                        if (isCellExists(cell, oneHostHouseHostCells)) return styles.nakedDoubleHostCell
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

    const waysToFillNakedDouble = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers)) return null
        const mainNumbersForFirstFillWay = _cloneDeep(oneHostHosueBoardData.mainNumbers)
        const mainNumbersForSecondFillWay = _cloneDeep(oneHostHosueBoardData.mainNumbers)
        const [firstNDHostCell, secondNDHostCell] = oneHostHouseHostCells
        mainNumbersForFirstFillWay[firstNDHostCell.row][firstNDHostCell.col].value = 8
        mainNumbersForFirstFillWay[secondNDHostCell.row][secondNDHostCell.col].value = 9
        mainNumbersForSecondFillWay[firstNDHostCell.row][firstNDHostCell.col].value = 9
        mainNumbersForSecondFillWay[secondNDHostCell.row][secondNDHostCell.col].value = 8
        return (
            <View style={styles.waysToFillNDCellsContainer}>
                <SmartHintText
                    text="<p>These cells can be filled only in two ways as shown below</p>"
                />
                <View style={styles.waysToFillBoardContainer}>
                    {renderTruncatedBoardForExample(mainNumbersForFirstFillWay)}
                    <Text>OR</Text>
                    {renderTruncatedBoardForExample(mainNumbersForSecondFillWay)}
                </View>
            </View>
        )
    }

    const removableNotesHighlight = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers)) return null
        const mainNumbersForFirstFillWay = _cloneDeep(oneHostHosueBoardData.mainNumbers)
        const [firstNDHostCell, secondNDHostCell] = oneHostHouseHostCells
        mainNumbersForFirstFillWay[firstNDHostCell.row][firstNDHostCell.col].value = 8
        mainNumbersForFirstFillWay[secondNDHostCell.row][secondNDHostCell.col].value = 9

        const hostHouseCellsWithoutHostCells = getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 4 })
            .filter(cell => !isCellExists(cell, oneHostHouseHostCells))
        const cellsFocusData = getCellsHighlightData(
            hostHouseCellsWithoutHostCells,
            oneHostHouseHostCells,
            [8, 9],
            oneHostHosueBoardData.notes,
            _get(theme, 'colors.smartHints'),
        )

        return (
            <View style={styles.removableNotesExampleContainer}>
                <Text>
                    {
                        'In both cases above, 8 and 9 candidates in cells other than D5 and E6 will be eliminated. So in below example'
                        + ' all candidates highlighted in red color will be eliminated'
                    }
                </Text>
                <View style={styles.removableNotesBoardContainer}>
                    {renderTruncatedBoardForExample(mainNumbersForFirstFillWay, cellsFocusData)}
                </View>
            </View>
        )
    }

    const twoHostHouseExample = () => {
        if (_isNil(twoHostHosueBoardData.mainNumbers)) return null

        const hostHouseCellsWithoutHostCells = getHousesCellsSharedByCells(twoHostHouseHostCells)
            .filter(cell => !isCellExists(cell, twoHostHouseHostCells))
        const cellsFocusData = getCellsHighlightData(
            hostHouseCellsWithoutHostCells,
            twoHostHouseHostCells,
            [6, 7],
            twoHostHosueBoardData.notes,
            _get(theme, 'colors.smartHints'),
        )

        return (
            <View style={styles.removableNotesExampleContainer}>
                <Text>
                    {
                        'A Naked Double can be formed in more than one house as well. See in example below,'
                        + ' cells H5 and H6 are part of row H and 8th block.'
                    }
                </Text>
                <View style={styles.exampleBoardContainer}>
                    <Board
                        {...twoHostHosueBoardData}
                        showCellContent
                        getCellBGColor={(cell: Cell) => {
                            if (isCellExists(cell, twoHostHouseHostCells)) return styles.nakedDoubleHostCell
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
                </View>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText
                text={
                    '<p>'
                    + `In <a href="${HINTS_VOCAB_IDS.NAKED_SINGLE}">Naked Single</a>, we focus only on one`
                    + ` <a href="${HINTS_VOCAB_IDS.CANDIDATE}">candidate</a> and one <a href="${HINTS_VOCAB_IDS.CELL}">cell</a>.`
                    + ' Naked Double is the extension of Naked Single. Here we will focus on two candidates and two cells.\n'
                    + `Naked Double is formed when in a <a href="${HINTS_VOCAB_IDS.HOUSE}">house</a> you can find two cells that contain the same two`
                    + ' numbers as candidates.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + 'Notice in above Sudoku Puzzle in 5th block D5 and E6 cells can have only 8 and 9 as candidates.'
                    + ' So, it\'s a Naked Double and D5 and E6 are locked for 8 and 9 but which cell out of D5 or E6 '
                    + ' will have 8 and which will be filled by 9 is still unknown.'
                    + '</p>'
                }
            />
            {waysToFillNakedDouble()}
            {removableNotesHighlight()}
            {twoHostHouseExample()}
        </View>
    )
}

export default React.memo(NakedDouble)
