import React, { useEffect } from 'react'

import { View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'
import _isEmpty from '@lodash/isEmpty'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levels.styles'

import { Page } from '../components/Page'
import { GAME_LEVELS_TEXT, NUM_COLUMNS } from './levels.constants'
import { ACTION_HANDLERS, ACTION_TYPES } from './levels.actionHandlers'
import withActions from '@utils/hocs/withActions'
import { useDependency } from 'src/hooks/useDependency'
import { getRouteParamValue } from 'src/navigation/navigation.utils'
import { LevelStarIcon } from '@resources/svgIcons/levelStar'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import GameLevelsList from '../components/GameLevelsList/GameLevelsList'
import { emit } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'

const renderStarsEarning = (starsEarned, maxStars, styles) => {
    if (!starsEarned) return null
    return (
        <View style={styles.performanceContainer}>
            <LevelStarIcon height={24} width={24} />
            <Text type={TEXT_VARIATIONS.LABEL_LARGE} style={styles.performanceText}>
                {`${starsEarned}/${maxStars}`}
            </Text>
        </View>
    )
}

const Levels: React.FC<Props> = ({
    onAction, navigation, route, maxStars, starsEarned
}) => {
    const styles = useStyles(getStyles)

    const dependencies = useDependency()

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: dependencies })
    }, [])

    useEffect(() => {
        const selectedLevel = getRouteParamValue('selectedGameMenuItem', route)
        const title = `${GAME_LEVELS_TEXT[selectedLevel]} Levels`
        title && navigation.setOptions({ title })
    }, [])

    useEffect(() => {
        navigation.setOptions({ headerRight: () => renderStarsEarning(starsEarned, maxStars, styles) })
    }, [starsEarned, maxStars, styles])

    return (
        <Page
            style={styles.container}
            onFocus={() => emit(EVENTS.LOCAL.REFRESH_GAME_LEVELS_INFO)}
        >
            <GameLevelsList
                puzzleType={getRouteParamValue('selectedGameMenuItem', route)}
                onPuzzleClick={({ levelNum }) => {
                    onAction({
                        type: ACTION_TYPES.ON_LEVEL_CLICK,
                        payload: { levelNum }
                    })
                }}
                numberOfColumns={NUM_COLUMNS}
                styles={{
                    levelContainer: styles.levelContainer
                }}
            />
        </Page>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Levels))
