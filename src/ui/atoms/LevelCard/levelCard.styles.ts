import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import { CARD_DIMENSIONS } from './levelCard.constants'
import { getContainerBackgroundColor, getTextColor } from '@ui/molecules/Button/button.styles'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'

const disabledButtonConfig = {
    type: BUTTON_TYPES.FILLED,
    state: BUTTON_STATES.DISABLED
}

const getContainerBGColor = (levelState, theme) => {
    if (levelState !== LEVEL_STATES.LOCKED) return null
    return getContainerBackgroundColor(disabledButtonConfig, theme)
}

export const getStyles = ({ levelState }, theme) => {
    return StyleSheet.create({
        container: {
            display: 'flex',
            alignItems: 'center',
            height: CARD_DIMENSIONS.HEIGHT,
            width: CARD_DIMENSIONS.WIDTH,
            padding: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: _get(theme, ['colors', 'outline-variant']),
            backgroundColor: getContainerBGColor(levelState, theme)
        },
        levelText: { marginTop: 4 },
        starsContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginTop: 8,
        },
        middleStar: {
            position: 'relative',
            bottom: 8,
            marginHorizontal: 4
        },
        disabledLevelText: {
            color: getTextColor(disabledButtonConfig, theme)
        }
    })
}
