import React from 'react'

import { View } from 'react-native'

import _isNil from '@lodash/isNil'
import _get from '@lodash/get'
import _cloneDeep from '@lodash/cloneDeep'

import { HOUSE_TYPE } from '@domain/board/board.constants'

import SmartHintText from '@ui/molecules/SmartHintText'
import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from 'src/apps/arena/gameBoard'
import { FONT_WEIGHTS } from '@resources/fonts/font'
import { isCellExists } from 'src/apps/arena/utils/util'
import { HINTS_VOCAB_IDS } from 'src/apps/arena/utils/smartHints/rawHintTransformers'
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from 'src/apps/arena/utils/smartHints/constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import { CellsFocusData } from 'src/apps/arena/utils/smartHints/types'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import { getCellsAxesValuesListText } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getAxisValuesFromTranslations, getCandidatesListText } from 'src/apps/arena/utils/smartHints/util'
import { highlightPrimaryHouseCells } from 'src/apps/arena/utils/smartHints/rawHintTransformers/hiddenGroup/hiddenGroup'
import { getStyles } from './hiddenDouble.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { useSmartHintsTranslations } from '../hooks/useSmartHintsTranslations'

type ZoomableViewConfigs = {
    initialZoom?: number
    initialOffsetX?: number
    initialOffsetY?: number
}

const oneHostHouse = '200710805000085009000069710627001008001050600400600931092370000300540000504092006'
const oneHostHouseHostCells = [{ row: 1, col: 0 }, { row: 1, col: 1 }]
const oneHostHouseGroupCandidates = [1, 7]
const HiddenDouble = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)
    const smartHintsTranslationsTexts = useSmartHintsTranslations()
    const boardAxesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)

    const oneHostHouseDetails = {
        cellsListText: getCellsAxesValuesListText(oneHostHouseHostCells, smartHintsTranslationsTexts.common.conjugations.and, boardAxesValues),
        candidatesListText: getCandidatesListText(oneHostHouseGroupCandidates, smartHintsTranslationsTexts.common.conjugations.and),
    }

    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'hiddenDouble',
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
            <SmartHintText
                text={t('example', { candidates: oneHostHouseDetails.candidatesListText, cells: oneHostHouseDetails.cellsListText })}
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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('effect.title')}
                </Text>
                <SmartHintText
                    text={t('effect.intro', { candidates: oneHostHouseDetails.candidatesListText })}
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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('invalidExample.title')}
                </Text>
                <View style={styles.invalidExamplesBoardContainer}>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, firstExampleHostCells, { initialOffsetX: 110, initialOffsetY: -110 })}
                    <Text>{commonT('or')}</Text>
                    {renderTruncatedBoardForExample(oneHostHosueBoardData.mainNumbers, oneHostHosueBoardData.notes, {}, secondExampleHostCells, { initialOffsetX: -120, initialOffsetY: 120 })}
                </View>
                <Text style={{ marginTop: 8 }}>
                    {t('invalidExample.explanation')}
                </Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <SmartHintText text={t('intro')} />
            {Example}
            {invalidHiddenDouble()}
            {removableNotesHighlight()}
        </View>
    )
}

export default React.memo(HiddenDouble)
