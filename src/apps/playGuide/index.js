import React, { memo, useEffect } from 'react'

import { ScrollView } from 'react-native-gesture-handler'

import { View, StyleSheet } from 'react-native'

import _get from '@lodash/get'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { useTranslation } from 'src/i18n/hooks/useTranslation'
import { Board } from '../arena/gameBoard'
import { Page } from '../components/Page'
import { generateMainNumbersFromPuzzleString } from '../arena/utils/util'

import { getCellsHighlightData } from './boardData'
import { HOUSES_COLORS } from './boardData/cellsHighlightData'
import { HOUSE_TYPE } from '@domain/board/board.constants'
import { PUZZLE } from './playGuide.constants'
import { getStyles } from './playGuide.styles'
import { useDependency } from 'src/hooks/useDependency'
import { useTheme } from '../arena/hooks/useTheme'
import HtmlView from 'react-native-htmlview'
import { getTextStyles } from '@ui/atoms/Text/Text'
import { FONT_WEIGHTS } from '@resources/fonts/font'

// Styles for HTML tags used in play guide rules text.
// Default text styling (padding, base color, fontSize, etc.) still comes from `styles.ruleText`
// on the parent <Text /> and the default <Text> / <p> behaviour of HtmlView.
const getHtmlStylesheet = (_, theme) => {
    return StyleSheet.create({
        p: {
            ...getTextStyles({
                theme,
            }),
        },
        row: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.ROW],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        col: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.COL],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
        block: {
            color: HOUSES_COLORS.HOUSE_TEXT[HOUSE_TYPE.BLOCK],
            fontWeight: FONT_WEIGHTS.BOLD,
        },
    })
}

const PlayGuide_ = () => {
    const styles = useStyles(getStyles)

    const htmlStylesheet = useStyles(getHtmlStylesheet)

    const { t } = useTranslation()
    const { analytics } = useDependency()

    const { theme, isLight } = useTheme()

    const cellsHighlightData = getCellsHighlightData({ theme, isLight })

    useEffect(() => {
        analytics?.sendPlayGuideOpenedEvent?.()
    }, [])

    const getCellBGColor = (cell, isPuzzleSolved) => {
        if (isPuzzleSolved) return null
        return _get(cellsHighlightData, [cell.row, cell.col, 'bgColor'])
    }

    const renderBoard = ({ puzzle, isPuzzleSolved, ...restProps }) => (
        <Board
            mainNumbers={generateMainNumbersFromPuzzleString(puzzle)}
            showCellContent
            getCellBGColor={cell => getCellBGColor(cell, isPuzzleSolved)}
            {...restProps}
        />
    )

    const renderRules = () => (
        <View style={styles.rulesContainer}>
            <HtmlView
                value={t('playGuide:rules.text')}
                stylesheet={htmlStylesheet}
            />
        </View>
    )

    const renderPuzzleSolution = () => (
        <View style={styles.puzzleSolutionContainer}>
            <Text style={styles.solutionTitle} type={TEXT_VARIATIONS.TITLE_MEDIUM}>{t('playGuide:solutionTitle')}</Text>
            {renderBoard({
                puzzle: {
                    unsolved: PUZZLE.SOLVED,
                    solution: PUZZLE.SOLVED,
                },
                isPuzzleSolved: true,
            })}
        </View>
    )

    return (
        <Page style={styles.container}>
            <ScrollView>
                {renderBoard({
                    puzzle: {
                        unsolved: PUZZLE.UNSOLVED,
                        solution: PUZZLE.SOLVED,
                    },
                    cellsHighlightData,
                })}
                {renderRules()}
                {renderPuzzleSolution()}
            </ScrollView>
        </Page>
    )
}

export const PlayGuide = memo(PlayGuide_)
