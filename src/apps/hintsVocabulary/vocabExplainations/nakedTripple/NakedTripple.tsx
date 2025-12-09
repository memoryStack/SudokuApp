import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import {
    getHousesCellsSharedByCells, isCellExists,
} from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from 'src/apps/arena/utils/smartHints/constants'
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
import { useTranslation } from 'src/i18n/hooks/useTranslation'

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

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'nakedTripple',
    })

    const { t: commonT } = useTranslation(['common'])

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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('effect.title')}
                </Text>
                <Text>
                    {t('effect.intro', { candidates: oneHostHouseDetails.candidatesListText })}
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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('twoHostHouse.title')}
                </Text>
                <Text>
                    {t('twoHostHouse.explanation', { cells: twoHostHouseDetails.cellsListText })}
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
                <SmartHintText text={t('validTypes')} />
                {/* take care of this style name */}
                <View style={styles.waysToFillBoardContainer}>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: -120, initialOffsetY: 120 })}
                    <Text>{commonT('or')}</Text>
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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('invalidExample.title')}
                </Text>
                {/* take care of this style name */}
                <View style={styles.removableNotesBoardContainer}>
                    {renderTruncatedBoardForExample(twoHostHosueBoardData.mainNumbers, twoHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: -120 })}
                </View>
                <Text style={{ marginTop: 8 }}>
                    {t('invalidExample.explanation')}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText
                text={t('intro')}
            />
            {Example}
            <SmartHintText text={t('example', {
                cells: oneHostHouseDetails.cellsListText,
                candidates: oneHostHouseDetails.candidatesListText
            })} />
            {typesOfValidNakedTripples()}
            {invalidNakedTripples()}
            {removableNotesHighlight()}
            {twoHostHouseExample()}
        </View>
    )
}

export default React.memo(NakedDouble)
