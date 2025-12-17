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
import { HINT_TEXT_ELEMENTS_JOIN_CONJUGATION } from 'src/apps/arena/utils/smartHints/constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { HOUSE_TYPE } from '@domain/board/board.constants'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'

import { getCellsAxesList, getCellsAxesValuesListText } from 'src/apps/arena/utils/smartHints/rawHintTransformers/helpers'
import { getAxisValuesFromTranslations, getCandidatesListText } from 'src/apps/arena/utils/smartHints/util'
import { highlightPrimaryHouseCells } from 'src/apps/arena/utils/smartHints/rawHintTransformers/hiddenGroup/hiddenGroup'
import { getStyles } from './hiddenTripple.styles'
import { useBoardData } from '../hooks/useBoardData'
import { getLinkHTMLText } from '../utils'
import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { useSmartHintsTranslations } from '../hooks/useSmartHintsTranslations'

const oneHostHouse = '500620037004890000000050000930000000020000605700000003000009000000000700680570002'
const oneHostHouseHostCells = [{ row: 3, col: 5 }, { row: 5, col: 5 }, { row: 7, col: 5 }]
const oneHostHouseGroupCandidates = [2, 5, 6]

const HiddenTripple = () => {
    const styles = useStyles(getStyles)
    const theme = useThemeValues()
    const oneHostHosueBoardData = useBoardData(oneHostHouse)
    const { t } = useTranslation('hintsVocabulary', {
        keyPrefix: 'hiddenTripple',
    })

    const smartHintsTranslationsTexts = useSmartHintsTranslations()
    const boardAxesValues = getAxisValuesFromTranslations(smartHintsTranslationsTexts)
    const oneHostHouseDetails = {
        cellsListText: getCellsAxesValuesListText(oneHostHouseHostCells, smartHintsTranslationsTexts.common.conjugations.and, boardAxesValues),
        candidatesListText: getCandidatesListText(oneHostHouseGroupCandidates, smartHintsTranslationsTexts.common.conjugations.and),
    }

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
                <Text type={TEXT_VARIATIONS.TITLE_MEDIUM}>
                    {t('effect.title')}
                </Text>
                <SmartHintText
                    text={
                        t('effect.intro', { candidates: oneHostHouseDetails.candidatesListText, cells: oneHostHouseDetails.cellsListText })
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
                    t('intro')
                }
            />
            {Example}
            <SmartHintText
                text={
                    t('example', { candidates: oneHostHouseDetails.candidatesListText, cells: oneHostHouseDetails.cellsListText })
                }
            />
            {removableNotesHighlight()}
        </View>
    )
}

export default React.memo(HiddenTripple)
