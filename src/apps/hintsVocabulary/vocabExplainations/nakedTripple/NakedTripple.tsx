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
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION, HOUSE_TYPE } from 'src/apps/arena/utils/smartHints/constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import _cloneDeep from '@lodash/cloneDeep'
import { CellsFocusData } from 'src/apps/arena/utils/smartHints/types'
import { getCellsHighlightData } from 'src/apps/arena/utils/smartHints/rawHintTransformers/nakedGroup/nakedGroup'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import _get from '@lodash/get'
import { getCellsAxesValuesListText } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getCandidatesListText } from 'src/apps/arena/utils/smartHints/util'
import { getStyles } from './nakedTripple.styles'
import { useBoardData } from '../hooks/useBoardData'

type ZoomableViewConfigs = {
    initialZoom?: number
    initialOffsetX?: number
    initialOffsetY?: number
}

const oneHostHouse = '390000700000030650507000049049380506601054983853000400900800034002940865400000297'
const oneHostHouseHostCells = [{ row: 0, col: 4 }, { row: 2, col: 3 }, { row: 2, col: 4 }]
const oneHostHouseGroupCandidates = [1, 2, 6]

const oneHostHouseDetails = {
    cellsListText: getCellsAxesValuesListText(oneHostHouseHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    candidatesListText: getCandidatesListText(oneHostHouseGroupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
}

const twoHostHouse = '400500370320000004060000000800002030210840000000000090070090106940651000000070500'
const twoHostHouseHostCells = [{ row: 4, col: 6 }, { row: 4, col: 7 }, { row: 4, col: 8 }]
const twoHostHouseGroupCandidates = [5, 6, 7]
const twoHostHouseDetails = {
    cellsListText: getCellsAxesValuesListText(twoHostHouseHostCells, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
    candidatesListText: getCandidatesListText(twoHostHouseGroupCandidates, HINT_TEXT_ELEMENTS_JOIN_CONJUGATION.AND),
}

const NakedDouble = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)
    const twoHostHosueBoardData = useBoardData(twoHostHouse, 200)

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

        const hostHouseCellsWithoutHostCells = getHouseCells({ type: HOUSE_TYPE.BLOCK, num: 1 })
            .filter(cell => !isCellExists(cell, oneHostHouseHostCells))
        const cellsFocusData = getCellsHighlightData(
            hostHouseCellsWithoutHostCells,
            oneHostHouseHostCells,
            oneHostHouseGroupCandidates,
            oneHostHosueBoardData.notes,
            _get(theme, 'colors.smartHints'),
        )

        return (
            <View style={styles.removableNotesExampleContainer}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>How to remote Notes?</Text>
                <Text>
                    {
                        `In below example ${oneHostHouseDetails.candidatesListText} will be filled in the highlighted cells`
                        + ` and these numbers will be removed from all the other cells which have ${oneHostHouseDetails.candidatesListText} as candidates`
                        + ' in the house in which Naked Tripple is formed. So all the candidates highlighted in red color will be eliminated'
                    }
                </Text>
                <View style={styles.removableNotesBoardContainer}>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, cellsFocusData, oneHostHouseHostCells, { initialOffsetY: 120 })}
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
            [5, 6, 7],
            twoHostHosueBoardData.notes,
            _get(theme, 'colors.smartHints'),
        )

        return (
            <View style={styles.removableNotesExampleContainer}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>Naked Tripple in more than one House:</Text>
                <Text>
                    {
                        'If the three cells are part of two houses simultaneously then Naked Tripple will affect cells of'
                        + ` both houses. See in example below, cells ${twoHostHouseDetails.cellsListText} are part of row E and 6th block.`
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

    const typesOfValidNakedTripples = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers) || _isNil(twoHostHosueBoardData.mainNumbers)) return null
        const firstExampleHostCells = [{ row: 0, col: 7 }, { row: 0, col: 8 }, { row: 1, col: 8 }]
        const secondExampleHostCells = [{ row: 4, col: 6 }, { row: 4, col: 7 }, { row: 4, col: 8 }]

        return (
            <View>
                <SmartHintText
                    text={
                        '<p>'
                        + '<b>Note:</b> It is not necessary that the cells must have all three candidates to make a Naked Tripple.'
                        + ' Cells must have atleast two out of these three candidates. So below examples are also correct Naked Tripples.'
                        + '</p>'
                    }
                />
                {/* take care of this style name */}
                <View style={styles.waysToFillBoardContainer}>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: -120, initialOffsetY: 120 })}
                    <Text>OR</Text>
                    {renderTruncatedBoardForExample(twoHostHosueBoardData.mainNumbers, twoHostHosueBoardData.notes, {}, secondExampleHostCells, { initialOffsetX: -120 })}
                </View>
            </View>
        )
    }

    const invalidNakedTripples = () => {
        if (_isNil(oneHostHosueBoardData.mainNumbers) || _isNil(twoHostHosueBoardData.mainNumbers)) return null
        const firstExampleHostCells = [{ row: 3, col: 8 }, { row: 4, col: 7 }, { row: 4, col: 8 }]

        return (
            <View style={{ marginTop: 16 }}>
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>Invalid Naked Tripple Example:</Text>
                {/* take care of this style name */}
                <View style={styles.removableNotesBoardContainer}>
                    {renderTruncatedBoardForExample(twoHostHosueBoardData.mainNumbers, twoHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: -120 })}
                </View>
                <Text style={{ marginTop: 8 }}>
                    {
                        'In above example these three cells have their candidates from a group of four candidates 1, 5, 6 and 7.'
                        + ' If 1 was not present in the top-right cell as candidate then it would have been a valid Naked Tripple.'
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
                    + `In <a href="${HINTS_VOCAB_IDS.NAKED_DOUBLE}">Naked Double</a>, we focus on two`
                    + ` <a href="${HINTS_VOCAB_IDS.CANDIDATE}">candidates</a> in two <a href="${HINTS_VOCAB_IDS.CELL}">cells</a> in a <a href="${HINTS_VOCAB_IDS.HOUSE}">house</a>.`
                    + ' In Naked Tripple we focus on three cells and three candidates. So a Naked Tripple is formed when three cells in any'
                    + ' house have candidates from a group of three candidates only.'
                    + '</p>'
                }
            />
            {Example}
            <SmartHintText
                text={
                    '<p>'
                    + `Notice in above Sudoku Puzzle in 2nd <a href="${HINTS_VOCAB_IDS.BLOCK}">block</a> ${oneHostHouseDetails.cellsListText} cells can`
                    + ` have only ${oneHostHouseDetails.candidatesListText} as candidates. So, it's a Naked Tripple and`
                    + ` ${oneHostHouseDetails.cellsListText} are locked for ${oneHostHouseDetails.candidatesListText} but which number will`
                    + ' go exactly in which cell is still not clear.'
                    + '</p>'
                }
            />
            {typesOfValidNakedTripples()}
            {invalidNakedTripples()}
            {removableNotesHighlight()}
            {twoHostHouseExample()}
        </View>
    )
}

export default React.memo(NakedDouble)
