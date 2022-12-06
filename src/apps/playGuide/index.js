import React, { memo } from "react";

import { StyleSheet, Text, View } from "react-native";
import { GAME_STATE } from "../../resources/constants";

import { fonts } from "../../resources/fonts/font";
import { Board } from "../arena/gameBoard";

import { mainNumbers, cellsHighlightData } from './boardData'

import { RULES_TEXT_CONFIG } from "./playGuide.config";

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
        return (
            <Text style={{
                padding: 20,
                fontSize: 18,
                textAlign: 'center',
                lineHeight: 24
            }}>
                {
                    RULES_TEXT_CONFIG.map(({ label, styles = {} }) => {
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
