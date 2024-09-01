import React, { useRef, useState } from 'react'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levels.styles'

import { Page } from '../components/Page'
import LevelCard, { LEVEL_STATES } from '@ui/atoms/LevelCard'
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import {
    ITEM_WIDTH, ITEM_HEIGHT, itemHorizontalMargin, ROWS_GAP
} from './levels.constants'

// just give 1000 puzzles and add more later on 
const getLevelCards = (start = 0) => {
    const result = []
    for (let i = start; i < start + 1000; i++) {
        if (i === start + 23) {
            result.push({
                state: LEVEL_STATES.UNLOCKED,
                activeStars: 1,
                levelNum: i + 1
            })
            continue
        }
        result.push({
            state: i < start + 23 ? LEVEL_STATES.COMPLETED : LEVEL_STATES.LOCKED,
            activeStars: 1,
            levelNum: i + 1
        })
    }
    return result
}

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

}) => {
    const styles = useStyles(getStyles)

    const [dataProvider, setDataProvider] = useState(itemEqualityChecker.cloneWithRows(getLevelCards()))
    const listRef = useRef(null)

    const rowRenderer = (type, data) => {
        return (
            <LevelCard {...data} containerStyle={styles.levelContainer} />
        )
    }

    return (
        <Page style={styles.container}>
            <RecyclerListView
                ref={listRef}
                layoutProvider={layoutProvider}
                dataProvider={dataProvider}
                rowRenderer={rowRenderer}
                renderAheadOffset={1000}
            // initialRenderIndex={491}
            />
        </Page>
    )
}

export default React.memo(Levels)
