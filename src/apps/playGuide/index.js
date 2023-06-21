import React, { memo } from 'react'

import { Text, View } from 'react-native'
import { GAME_STATE } from '@resources/constants'

import { Board } from '../arena/gameBoard'

import { mainNumbers, cellsHighlightData } from './boardData'

import { RULES_TEXT_CONFIG } from './playGuide.constants'

import { styles } from './style'

const PlayGuide_ = () => {
    const renderBoard = () => (
        <Board
            mainNumbers={mainNumbers}
            showSmartHint // this is problamatic, why are we even sending this ??
            cellsHighlightData={cellsHighlightData}
            gameState={GAME_STATE.ACTIVE}
            axisTextStyles={styles.axisText}
        />
    )

    const renderRules = () => (
        <Text style={styles.ruleText}>
            {RULES_TEXT_CONFIG.map(({ label, styles = {} }, index) => (
                <Text key={index} style={styles}>{label}</Text>
            ))}
        </Text>
    )

    return (
        <View style={styles.container}>
            {renderBoard()}
            {renderRules()}
        </View>
    )
}

export const PlayGuide = memo(PlayGuide_)
