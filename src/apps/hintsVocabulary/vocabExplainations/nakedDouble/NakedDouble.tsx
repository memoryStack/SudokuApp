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
import { HOUSE_TYPE } from '@domain/board/board.constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import _cloneDeep from '@lodash/cloneDeep'
import { CellsFocusData } from 'src/apps/arena/utils/smartHints/types'
import { getCellsHighlightData } from 'src/apps/arena/utils/smartHints/rawHintTransformers/nakedGroup/nakedGroup'
import { getHouseCells } from '@domain/board/utils/housesAndCells'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import _get from '@lodash/get'
import { getStyles } from './nakedDouble.styles'
import { useBoardData } from '../hooks/useBoardData'
import { useTranslation } from 'src/i18n/hooks/useTranslation'

const oneHostHouse = '687004523953002614142356978310007246760000305020000701096001032230000057070000069'
const oneHostHouseHostCells = [{ row: 3, col: 4 }, { row: 4, col: 5 }]
const twoHostHouse = '800210047040089100000040000000098005090030000007001409000000000003000254200000008'
const twoHostHouseHostCells = [{ row: 7, col: 4 }, { row: 7, col: 5 }]

const NakedDouble = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)
    const twoHostHosueBoardData = useBoardData(twoHostHouse, 1000)

    const { t } = useTranslation(['hintsVocabulary'], {
        keyPrefix: 'nakedDouble',
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
                    text={t('waysToFill')}
                />
                <View style={styles.waysToFillBoardContainer}>
                    {renderTruncatedBoardForExample(mainNumbersForFirstFillWay)}
                    <Text>{commonT('or')}</Text>
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
                <Text style={styles.textDefault}>
                    {t('removableNotes')}
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
                <Text style={styles.textDefault} type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('twoHostHouseTitle')}
                </Text>
                <Text style={styles.textDefault}>
                    {t('twoHostHouse')}
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
                text={t('intro')}
            />
            {Example}
            <SmartHintText
                text={t('example')}
            />
            {waysToFillNakedDouble()}
            {removableNotesHighlight()}
            {twoHostHouseExample()}
        </View>
    )
}

export default React.memo(NakedDouble)
