import { StyleSheet } from 'react-native'

import _get from '@lodash/get'
import { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import { CARD_DIMENSIONS } from './levelCard.constants'
import { getTextColor } from '@ui/molecules/Button/button.styles'

const disabledButtonConfig = {
    type: BUTTON_TYPES.FILLED,
    state: BUTTON_STATES.DISABLED
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
        },
        levelText: { marginTop: 4 },
        starsContainer: {
            marginTop: 8,
        },
        middleStar: {
            bottom: 8,
            marginHorizontal: 4
        },
        disabledLevelText: {
            color: getTextColor(disabledButtonConfig, theme)
        }
    })
}
