import React, { memo } from 'react'

import Text from '@ui/atoms/Text'

import { GAME_STATE } from '@resources/constants'

import { useStyles } from '@utils/customHooks/useStyles'

import { Board } from '../arena/gameBoard'
import { Page } from '../components/Page'

import { mainNumbers, cellsHighlightData } from './boardData'
import { RULES_TEXT_CONFIG } from './playGuide.constants'
import { getStyles } from './playGuide.styles'

const PlayGuide_ = () => {
    const styles = useStyles(getStyles)

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
            {RULES_TEXT_CONFIG.map(({ key, label, styles: subTextStyles = {} }) => (
                <Text key={key} style={subTextStyles}>{label}</Text>
            ))}
        </Text>
    )

    return (
        <Page style={styles.container}>
            {renderBoard()}
            {renderRules()}
        </Page>
    )
}

export const PlayGuide = memo(PlayGuide_)
