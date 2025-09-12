import React from 'react'

import { StyleProp, ViewStyle, View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levelCard.styles'

import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import { PlayIcon } from '@resources/svgIcons/play'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'
import LevelStars from '../LevelStars'

export interface Props {
    state: LEVEL_STATES
    levelNum: number
    activeStars: number
    containerStyle?: StyleProp<ViewStyle>,
    testID?: string
    unsolved?: boolean
}

const LevelCard: React.FC<Props> = ({
    levelNum = 0,
    state = LEVEL_STATES.LOCKED,
    activeStars = 0,
    containerStyle,
    testID = '',
    unsolved = false,
}) => {
    const styles = useStyles(getStyles, { levelState: state, unsolved })

    const theme = useThemeValues()

    const levelNumberView = (style = null) => {
        return (
            <Text
                type={TEXT_VARIATIONS.LABEL_LARGE}
                style={[styles.levelText, style, unsolved ? styles.unsolvedLevelText : null]}
                withoutLineHeight
            >
                {levelNum}
            </Text>
        )
    }

    const renderCompletedLevel = () => {
        return (
            <>
                <LevelStars
                    activeStars={activeStars}
                    containerStyle={styles.starsContainer}
                    middleStarStyle={styles.middleStar}
                />
                {levelNumberView()}
            </>
        )
    }

    const renderLockedLevel = () => {
        return (
            <>
                {/* <LockIcon fill={styles.disabledLevelText.color} /> */}
                <LevelStars
                    activeStars={0}
                    containerStyle={styles.starsContainer}
                    middleStarStyle={styles.middleStar}
                    unsolved={unsolved}
                />
                {levelNumberView(styles.disabledLevelText)}
            </>
        )
    }

    const renderUnlockedLevel = () => {
        return (
            <>
                <PlayIcon fill={_get(theme, ['colors', 'primary'])} />
                {levelNumberView()}
            </>
        )
    }

    return (
        <View style={[styles.container, containerStyle]} testID={testID}>
            {state === LEVEL_STATES.COMPLETED ? renderCompletedLevel() : null}
            {state === LEVEL_STATES.LOCKED ? renderLockedLevel() : null}
            {state === LEVEL_STATES.UNLOCKED ? renderUnlockedLevel() : null}
        </View>
    )
}

export default React.memo(LevelCard)
