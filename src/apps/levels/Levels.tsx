import React, { useRef, useState, useEffect } from 'react'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levels.styles'

import { Page } from '../components/Page'
import LevelCard from '@ui/atoms/LevelCard'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {
    ITEM_WIDTH, ITEM_HEIGHT, itemHorizontalMargin, ROWS_GAP
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

const itemEqualityChecker = new DataProvider((r1, r2) => {
    return r1 !== r2
})

const layoutProvider = new LayoutProvider(
    index => 0,
    (type, dim) => {
        dim.width = ITEM_WIDTH + 2 * itemHorizontalMargin
        dim.height = ITEM_HEIGHT + ROWS_GAP
    }
)

const Levels: React.FC<Props> = ({
    onAction, levels
}) => {
    const styles = useStyles(getStyles)

    const dependencies = useDependency()

    const [dataProvider, setDataProvider] = useState(itemEqualityChecker.cloneWithRows(levels || []))
    const listRef = useRef(null)

    useEffect(() => {
        onAction({ type: ACTION_TYPES.ON_INIT, payload: dependencies })
    }, [])

    useEffect(() => {
        if (_isNil(levels)) return
        setDataProvider(itemEqualityChecker.cloneWithRows(_cloneDeep(levels)))
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
            <RecyclerListView
                ref={listRef}
                layoutProvider={layoutProvider}
                dataProvider={dataProvider}
                rowRenderer={rowRenderer}
                renderAheadOffset={1000}
            // initialRenderIndex={491} // TODO: implement it
            />
        </Page>
    )
}

export default React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(Levels))
