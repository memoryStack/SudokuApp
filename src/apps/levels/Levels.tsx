import React, { useRef, useState, useEffect } from 'react'

import { View } from 'react-native'

import _get from '@lodash/get'
import _noop from '@lodash/noop'
import _isEmpty from '@lodash/isEmpty'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levels.styles'

import { Page } from '../components/Page'
import LevelCard from '@ui/atoms/LevelCard'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {
    ITEM_WIDTH, ITEM_HEIGHT, itemHorizontalMargin, ROWS_GAP, GAME_LEVELS_TEXT, NUM_COLUMNS
} from './levels.constants'
import { ACTION_HANDLERS, ACTION_TYPES } from './levels.actionHandlers'
import withActions from '@utils/hocs/withActions'
import { Touchable } from '../components/Touchable'

import { Level } from '@application/usecases/gameLevels/type'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'
import { useDependency } from 'src/hooks/useDependency'
import _cloneDeep from '@lodash/cloneDeep'
import _isEqual from '@lodash/isEqual'
import _isNil from '@lodash/isNil'
import { getRouteParamValue } from 'src/navigation/navigation.utils'
import { LevelStarIcon } from '@resources/svgIcons/levelStar'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

const itemEqualityChecker = () => new DataProvider((r1, r2) => {
    return r1 !== r2
})

const getLayoutProvider = () => {
    return new LayoutProvider(
        index => 0,
        (type, dim) => {
            dim.width = ITEM_WIDTH + 2 * itemHorizontalMargin
            dim.height = ITEM_HEIGHT + ROWS_GAP
        }
    )
}

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

// this is done so that unsolved level will be scrolled
// in the middle of the screen
const getNormalizedIndexToFocus = (actualIndex: number, maxItems: number) => {
    return Math.min(Math.max(0, actualIndex - 3 * NUM_COLUMNS), maxItems - 1)
}

const Levels: React.FC<Props> = ({
    onAction, levels, navigation, route, levelToFocusIndex, maxStars, starsEarned
}) => {
    const styles = useStyles(getStyles)

    const dependencies = useDependency()

    const [dataProvider, setDataProvider] = useState(itemEqualityChecker().cloneWithRows(levels || []))
    const [layoutProvider, setLayoutProvider] = useState(getLayoutProvider())
    const listRef = useRef(null)

    useEffect(() => {
        const selectedLevel = getRouteParamValue('selectedGameMenuItem', route)
        const title = `${GAME_LEVELS_TEXT[selectedLevel]} Levels`
        title && navigation.setOptions({ title })
    }, [])

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: dependencies })
    }, [])

    useEffect(() => {
        navigation.setOptions({ headerRight: () => renderStarsEarning(starsEarned, maxStars, styles) })
    }, [starsEarned, maxStars, styles])

    useEffect(() => {
        if (_isNil(levels)) return
        setDataProvider(itemEqualityChecker().cloneWithRows(_cloneDeep(levels)))
        setLayoutProvider(getLayoutProvider())
    }, [levels])

    const rowRenderer = (type, data: Level) => {
        return (
            <Touchable
                onPress={() => {
                    onAction({
                        type: ACTION_TYPES.ON_LEVEL_CLICK,
                        payload: {
                            levelNum: data.levelNum
                        }
                    })
                }}
                disabled={data.state === LEVEL_STATES.LOCKED}
            >
                <LevelCard {...data} containerStyle={styles.levelContainer} />
            </Touchable>
        )
    }

    return (
        <Page
            style={styles.container}
            onFocus={() => {
                onAction({ type: ACTION_TYPES.ON_INIT, payload: dependencies })
            }}
        >
            {/* TODO: it crashes when levels are changed at run-time */}
            {
                !_isEmpty(levels) ?
                    <RecyclerListView
                        ref={listRef}
                        layoutProvider={layoutProvider}
                        dataProvider={dataProvider}
                        rowRenderer={rowRenderer}
                        renderAheadOffset={1000}
                        {...levelToFocusIndex && { initialRenderIndex: getNormalizedIndexToFocus(levelToFocusIndex, levels.length) }}
                    />
                    : null
            }
        </Page>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Levels))
