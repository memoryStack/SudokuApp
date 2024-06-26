import React, {
    useCallback, useRef, useEffect, useState,
} from 'react'
import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Svg, Path } from 'react-native-svg'

import _noop from '@lodash/noop'

import { RestartIcon } from '@resources/svgIcons/restart'
import { PersonalizePuzzleIcon } from '@resources/svgIcons/personalizePuzzle'
import { LEVEL_DIFFICULTIES, SCREEN_NAME } from '@resources/constants'
import { CUSTOMIZE_YOUR_PUZZLE_TITLE, RESUME } from '@resources/stringLiterals'

import Text from '@ui/atoms/Text'

import { consoleLog } from '@utils/util'

import { useStyles } from '@utils/customHooks/useStyles'
import { useScreenName } from '../../../utils/customHooks'

import { BottomDragger, getCloseDraggerHandler } from '../../components/BottomDragger'
import { Touchable } from '../../components/Touchable'

import { previousInactiveGameExists } from '../utils/util'

import {
    LEVEL_ICON_DIMENSION,
    NEXT_GAME_MENU_TEST_ID,
} from './nextGameMenu.constants'

import { getStyles } from './nextGameMenu.styles'

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

    const screenName = useScreenName()

    const isHomeScreen = screenName === SCREEN_NAME.HOME

    const nextGameMenuRef = useRef(null)

    const [pendingGame, setPendingGame] = useState({ checkedStatus: !isHomeScreen, available: false })

    useEffect(() => {
        if (!isHomeScreen) return
        previousInactiveGameExists()
            .then(pendingGameAvailable => {
                setPendingGame({ available: pendingGameAvailable, checkedStatus: true })
            })
            .catch(error => {
                setPendingGame(_pendingGame => ({ ..._pendingGame, checkedStatus: true }))
                consoleLog(error)
            })
    }, [isHomeScreen])

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
            {Object.keys(LEVEL_DIFFICULTIES).map((levelText, index) => (
                <View key={levelText}>
                    <Touchable
                        style={styles.levelContainer}
                        onPress={() => nextGameMenuItemClicked(levelText)}
                    >
                        {getLevelIcon(index)}
                        <Text style={styles.levelText}>{levelText}</Text>
                    </Touchable>
                </View>
            ))}
            {/* TODO: make these options a little more configurable */}
            <Touchable
                key={CUSTOMIZE_YOUR_PUZZLE_TITLE}
                style={styles.levelContainer}
                onPress={() => nextGameMenuItemClicked(CUSTOMIZE_YOUR_PUZZLE_TITLE)}
            >
                <PersonalizePuzzleIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} fill={styles.levelIcon.color} />
                <Text style={styles.levelText}>{CUSTOMIZE_YOUR_PUZZLE_TITLE}</Text>
            </Touchable>
            {isHomeScreen && pendingGame.available ? (
                <Touchable
                    key={RESUME}
                    style={styles.levelContainer}
                    onPress={() => nextGameMenuItemClicked(RESUME)}
                >
                    <RestartIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} fill={styles.levelIcon.color} />
                    <Text style={styles.levelText}>{RESUME}</Text>
                </Touchable>
            ) : null}
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
