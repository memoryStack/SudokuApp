import React, { memo } from 'react'

import { ScrollView } from 'react-native-gesture-handler'

import { View } from 'react-native'

import _get from '@lodash/get'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from '../arena/gameBoard'
import { Page } from '../components/Page'
import { generateMainNumbersFromPuzzleString } from '../arena/utils/util'

import { cellsHighlightData } from './boardData'
import { RULES_TEXT_CONFIG, PUZZLE } from './playGuide.constants'
import { getStyles } from './playGuide.styles'

const PlayGuide_ = () => {
    const styles = useStyles(getStyles)

    const getCellBGColor = (cell, isPuzzleSolved) => {
        if (isPuzzleSolved) return null
        return _get(cellsHighlightData, [cell.row, cell.col, 'bgColor'])
    }

    const renderBoard = ({ puzzle, isPuzzleSolved, ...restProps }) => (
        <Board
            mainNumbers={generateMainNumbersFromPuzzleString(puzzle)}
            axisTextStyles={styles.axisText}
            showCellContent
            getCellBGColor={cell => getCellBGColor(cell, isPuzzleSolved)}
            {...restProps}
        />
    )

    const renderRules = () => (
        <Text style={styles.ruleText}>
            {RULES_TEXT_CONFIG.map(({ key, label, styles: subTextStyles = {} }) => (
                <Text key={key} style={subTextStyles}>{label}</Text>
            ))}
        </Text>
    )

    const renderPuzzleSolution = () => (
        <View style={styles.puzzleSolutionContainer}>
            <Text style={styles.ruleText} type={TEXT_VARIATIONS.TITLE_MEDIUM}>Solution of above puzzle will look like this</Text>
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
