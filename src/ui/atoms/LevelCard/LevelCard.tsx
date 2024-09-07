import React from 'react'

import { StyleProp, ViewStyle, View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levelCard.styles'

import { LevelStarIcon } from '@resources/svgIcons/levelStar'
import { useThemeValues } from 'src/apps/arena/hooks/useTheme'
import { LockIcon } from '@resources/svgIcons/lock'
import { PlayIcon } from '@resources/svgIcons/play'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'

export interface Props {
    state: LEVEL_STATES
    levelNum: number
    activeStars: number
    containerStyle?: StyleProp<ViewStyle>,
    testID?: string
}

const getStarsActiveInfo = (activeStars: number) => {
    if (activeStars === 1) return { 0: true, 1: false, 2: false, }
    if (activeStars === 2) return { 0: true, 1: false, 2: true, }
    if (activeStars === 3) return { 0: true, 1: true, 2: true, }
    return { 0: false, 1: false, 2: false, }
}

const LevelCard: React.FC<Props> = ({
    levelNum = 0,
    state = LEVEL_STATES.LOCKED,
    activeStars = 0,
    containerStyle,
    testID = ''
}) => {
    const styles = useStyles(getStyles, { levelState: state })

    const theme = useThemeValues()

    const renderStars = () => {
        const starsActiveInfo = getStarsActiveInfo(activeStars)
        return (
            <View style={styles.starsContainer}>
                <LevelStarIcon active={starsActiveInfo[0]} />
                <View style={styles.middleStar}>
                    <LevelStarIcon active={starsActiveInfo[1]} />
                </View>
                <LevelStarIcon active={starsActiveInfo[2]} />
            </View>
        )
    }

    const levelNumberView = (style = null) => {
        return (
            <Text
                type={TEXT_VARIATIONS.LABEL_LARGE}
                style={[styles.levelText, style]}
                withoutLineHeight
            >
                {levelNum}
            </Text>
        )
    }

    const renderCompletedLevel = () => {
        return (
            <>
                {renderStars()}
                {levelNumberView()}
            </>
        )
    }

    const renderLockedLevel = () => {
        return (
            <>
                <LockIcon fill={styles.disabledLevelText.color} />
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
