import React, { memo } from "react";

import { StyleSheet, Text, View } from "react-native";
import { GAME_STATE } from "../../resources/constants";

import { fonts } from "../../resources/fonts/font";
import { Board } from "../arena/gameBoard";
import { HOUSE_TYPE } from "../arena/utils/smartHints/constants";

import { mainNumbers, cellsHighlightData } from './boardData'
import { HOUSE_VS_CELLS_BACKGROUND_COLOR } from './boardData/cellsHighlightData'

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
    },
    heading: {
        fontSize: 24,
        fontFamily: fonts.bold,
        marginTop: 24,
        marginBottom: 40,
    },
    ruleText: {
        fontSize: 20,
    }
})

const PlayGuide_ = () => {

    const renderBoard = () => {
        return (
            <Board
                mainNumbers={mainNumbers}
                showSmartHint={true}
                smartHintCellsHighlightInfo={cellsHighlightData} // TODO: fix namings
                gameState={GAME_STATE.ACTIVE}
            />
        )
    }

    const renderRules = () => {
        const rulesTextConfig = [
            { label: 'A sudoku puzzle begins with a grid in which some of the numbers are already in place. A puzzle is completed when each number from 1 to 9 appears only once in each of the 9 ' },
            {
                label: 'rows',
                styles: {
                    color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.ROW],
                    fontFamily: fonts.bold
                }
            },
            { label: ', ' },
            {
                label: 'columns',
                styles: {
                    color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.COL],
                    fontFamily: fonts.bold
                }
            },
            { label: ', and ' },
            {
                label: 'blocks',
                styles: {
                    color: HOUSE_VS_CELLS_BACKGROUND_COLOR[HOUSE_TYPE.BLOCK],
                    fontFamily: fonts.bold
                }
            },
            { label: '. Study the grid to find the numbers that might fit into each cell.' }
        ]

        return (
            <Text style={{
                padding: 20,
                fontSize: 18,
                textAlign: 'center',
                lineHeight: 24
            }}>
                {
                    rulesTextConfig.map(({ label, styles = {} }) => {
                        return (
                            <Text style={styles}>{label}</Text>
                        )
                    })
                }
            </Text>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Rules</Text>
            {renderBoard()}
            {renderRules()}
        </View>
    )
}

export const PlayGuide = memo(PlayGuide_)
