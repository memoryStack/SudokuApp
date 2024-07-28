import React, {
    useCallback, useRef, useEffect, useState,
} from 'react'
import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Svg, Path } from 'react-native-svg'

import _noop from '@lodash/noop'

import { RestartIcon } from '@resources/svgIcons/restart'
import { PersonalizePuzzleIcon } from '@resources/svgIcons/personalizePuzzle'

import Text from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'

import { BottomDragger, getCloseDraggerHandler } from '../../components/BottomDragger'
import { Touchable } from '../../components/Touchable'

import {
    LEVEL_ICON_DIMENSION,
    MENU_ITEMS_LABELS,
    NEXT_GAME_MENU_TEST_ID,
} from './nextGameMenu.constants'

import { getStyles } from './nextGameMenu.styles'

import { START_GAME_MENU_ITEMS_IDS } from '@application/usecases/newGameMenu/constants'
import { getMenuItemsToShow } from '@application/usecases/newGameMenu/newGameMenu'
import { useDependency } from 'src/hooks/useDependency'

const getBarPath = barNum => [
    'M', 75 + 100 * barNum, '450',
    'L', 75 + 100 * barNum, 350 - 100 * barNum,
    'A 25 25 0 0 1', 125 + 100 * barNum, 350 - 100 * barNum,
    'L', 125 + 100 * barNum, '450',
    'A 25 25 0 0 1', 75 + 100 * barNum, '450',
].join(' ')

// TODO: find a good icon for this resume option
const NextGameMenu_ = ({ parentHeight, menuItemClick, onMenuClosed }) => {
    const styles = useStyles(getStyles)

    const dependencies = useDependency()

    const nextGameMenuRef = useRef(null)

    const [pendingGame, setPendingGame] = useState({ checkedStatus: false, menuItems: [] })

    useEffect(() => {
        getMenuItemsToShow(dependencies).then((menuItems) => {
            setPendingGame({ menuItems, checkedStatus: true })
        })
    }, [])

    const getBarStrokeAndFillProps = (barNum, difficultyLevelIndex) => ({
        stroke: styles.levelIcon.color,
        fill: barNum <= difficultyLevelIndex ? styles.levelIcon.color : 'none',
    })

    const getBar = (barNum, level) => (
        <Path
            key={`${barNum}`}
            d={getBarPath(barNum)}
            {...getBarStrokeAndFillProps(barNum, level)}
            strokeWidth={5}
        />
    )

    const getLevelIcon = level => {
        const childArray = []
        for (let i = 0; i < 4; i++) childArray.push(getBar(i, level))
        return (
            <Svg viewBox="0 0 500 500" width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION}>
                {childArray}
            </Svg>
        )
    }

    const MENU_ITEM_VS_ICON = {
        [START_GAME_MENU_ITEMS_IDS.EASY]: () => getLevelIcon(0),
        [START_GAME_MENU_ITEMS_IDS.MEDIUM]: () => getLevelIcon(1),
        [START_GAME_MENU_ITEMS_IDS.HARD]: () => getLevelIcon(2),
        [START_GAME_MENU_ITEMS_IDS.EXPERT]: () => getLevelIcon(3),
        [START_GAME_MENU_ITEMS_IDS.CUSTOMIZE_PUZZLE]: () => {
            return (
                <PersonalizePuzzleIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} fill={styles.levelIcon.color} />
            )
        },
        [START_GAME_MENU_ITEMS_IDS.RESUME]: () => {
            return (
                <RestartIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} fill={styles.levelIcon.color} />
            )
        },
    }

    const closeView = () => {
        const closeDragger = getCloseDraggerHandler(nextGameMenuRef)
        closeDragger()
    }

    const nextGameMenuItemClicked = useCallback(item => {
        if (menuItemClick) {
            menuItemClick(item)
            closeView()
        }
    }, [menuItemClick])

    const getNextGameMenu = () => (
        <View style={styles.nextGameMenuContainer}>
            {pendingGame.menuItems.map((levelID) => (
                <View key={levelID}>
                    <Touchable
                        style={styles.levelContainer}
                        onPress={() => nextGameMenuItemClicked(levelID)}
                    >
                        {MENU_ITEM_VS_ICON[levelID]()}
                        <Text style={styles.levelText}>{MENU_ITEMS_LABELS[levelID]}</Text>
                    </Touchable>
                </View>
            ))}
        </View>
    )

    if (!pendingGame.checkedStatus) return null

    return (
        <BottomDragger
            testID={NEXT_GAME_MENU_TEST_ID}
            ref={nextGameMenuRef}
            parentHeight={parentHeight}
            onDraggerClosed={onMenuClosed}
        >
            {getNextGameMenu()}
        </BottomDragger>
    )
}

export const NextGameMenu = React.memo(NextGameMenu_)

NextGameMenu_.propTypes = {
    parentHeight: PropTypes.number,
    menuItemClick: PropTypes.func,
    onMenuClosed: PropTypes.func,
}

NextGameMenu_.defaultProps = {
    parentHeight: 0,
    menuItemClick: _noop,
    onMenuClosed: _noop,
}
