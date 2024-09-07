import React, { useRef, useState, useEffect } from 'react'

import _isEmpty from '@lodash/isEmpty'

import { useStyles } from '@utils/customHooks/useStyles'

import { DataProvider, LayoutProvider } from "recyclerlistview"

import LevelCard from '@ui/atoms/LevelCard'
import { RecyclerListView } from "recyclerlistview"
import { ACTION_HANDLERS, ACTION_TYPES } from './actionHandlers'
import withActions from '@utils/hocs/withActions'

import { Level } from '@application/usecases/gameLevels/type'
import { LEVEL_STATES } from '@application/usecases/gameLevels/constants'
import { useDependency } from 'src/hooks/useDependency'
import _isNil from '@lodash/isNil'
import { addListener, removeListener } from '@utils/GlobalEventBus'
import { EVENTS } from 'src/constants/events'
import { AUTO_GENERATED_NEW_GAME_IDS } from '@application/usecases/newGameMenu/constants'
import { Touchable } from '../Touchable'

import {
    ITEM_WIDTH, ITEM_HEIGHT, itemHorizontalMargin, ROWS_GAP, NUM_COLUMNS
} from './constants'

import { getStyles } from './styles'

// this is done so that unsolved level will be scrolled
// in the middle of the screen
const getNormalizedIndexToFocus = (actualIndex: number, maxItems: number) => {
    return Math.min(Math.max(0, actualIndex - 3 * NUM_COLUMNS), maxItems - 1)
}

const _dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2
})

const layoutProvider = new LayoutProvider(
    index => 0,
    (type, dim) => {
        dim.width = ITEM_WIDTH + 2 * itemHorizontalMargin
        dim.height = ITEM_HEIGHT + ROWS_GAP
    }
)

type Props = {
    onAction: () => {},
    levels: Level[],
    levelToFocusIndex: number,
    onPuzzleClick: ({ levelNum }: { levelNum: number }) => {},
    puzzleType: AUTO_GENERATED_NEW_GAME_IDS,
}

const GameLevelsList: React.FC<Props> = ({
    onAction,
    levels,
    levelToFocusIndex,
    onPuzzleClick,
}) => {
    const styles = useStyles(getStyles)

    const dependencies = useDependency()

    const [dataProvider, setDataProvider] = useState(_dataProvider.cloneWithRows(levels || []))
    const listRef = useRef(null)

    useEffect(() => {
        const fetch = () => onAction({ type: ACTION_TYPES.ON_INIT, payload: dependencies })
        fetch()
        addListener(EVENTS.LOCAL.REFRESH_GAME_LEVELS_INFO, fetch)
        return () => removeListener(EVENTS.LOCAL.REFRESH_GAME_LEVELS_INFO, fetch)
    }, [])

    useEffect(() => {
        if (_isNil(levels)) return
        setDataProvider(_dataProvider.cloneWithRows(levels))
    }, [levels])

    const rowRenderer = (type, data: Level) => {
        return (
            <Touchable
                onPress={() => onPuzzleClick({ levelNum: data.levelNum })}
                disabled={data.state === LEVEL_STATES.LOCKED}
            >
                <LevelCard {...data} containerStyle={styles.levelContainer} />
            </Touchable>
        )
    }

    {/* TODO: it crashes when levels are changed at run-time */ }
    return (
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
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(GameLevelsList))
