import React, { memo } from "react";

import { Text, View } from "react-native";
import { GAME_STATE } from "../../resources/constants";


import { Board } from "../arena/gameBoard";

import { mainNumbers, cellsHighlightData } from './boardData'

import { RULES_TEXT_CONFIG } from "./playGuide.config";

import { styles } from './style'

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
            <Text style={styles.ruleText}>
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
