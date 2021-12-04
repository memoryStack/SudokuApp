import React, { useCallback, useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { Svg, Path } from 'react-native-svg'
import { RestartIcon } from '../../../resources/svgIcons/restart'
import { PersonalizePuzzleIcon } from '../../../resources/svgIcons/personalizePuzzle'
import { EVENTS, LEVEL_DIFFICULTIES, SCREEN_NAME } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { fonts } from '../../../resources/fonts/font'
import { CUSTOMIZE_YOUR_PUZZLE_TITLE, RESUME } from '../../../resources/stringLiterals'

const LEVEL_ICON_DIMENSION = 24
const NEXT_GAME_MENU_ROW_HEIGHT = 50
const RESTART_TEXT = 'Restart'

const styles = StyleSheet.create({
    nextGameMenuContainer: {
        backgroundColor: 'white',
        width: '100%',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    levelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: NEXT_GAME_MENU_ROW_HEIGHT,
        paddingHorizontal: 16,
    },
    levelText: {
        fontSize: 16,
        color: 'black',
        marginLeft: 16,
        fontFamily: fonts.regular,
    },
})

// TODO: research about using "useMemo" for the functions which are rendering a view in the
//          functional component
// TODO: find a good icon for this resume option
const NextGameMenu_ = ({ screenName = '', parentHeight, menuItemClick, onMenuClosed }) => {
    const nextGameMenuRef = useRef(null)

    const getBar = (barNum, level) => {
        const pathD = [
            'M',
            75 + 100 * barNum,
            '450',
            'L',
            75 + 100 * barNum,
            350 - 100 * barNum,
            'A 25 25 0 0 1',
            125 + 100 * barNum,
            350 - 100 * barNum,
            'L',
            125 + 100 * barNum,
            '450',
            'A 25 25 0 0 1',
            75 + 100 * barNum,
            '450',
        ].join(' ')

        let stroke
        let fill
        if (barNum <= level) stroke = 'rgba(0, 0, 0, .5)'
        else stroke = 'black'
        if (barNum > level) fill = 'none'
        else fill = 'black'
        return <Path key={`${barNum}`} d={pathD} stroke={stroke} fill={fill} strokeWidth={5} />
    }

    const getLevelIcon = level => {
        const childArray = []
        for (let i = 0; i < 4; i++) childArray.push(getBar(i, level))
        return (
            <Svg viewBox="0 0 500 500" width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION}>
                {childArray}
            </Svg>
        )
    }

    const closeView = () => nextGameMenuRef.current && nextGameMenuRef.current.closeDragger(true)

    const nextGameMenuItemClicked = useCallback(
        item => {
            if (menuItemClick) {
                menuItemClick(item)
            } else {
                switch (item) {
                    case RESTART_TEXT:
                        emit(EVENTS.RESTART_GAME)
                        closeView()
                        break
                    case CUSTOMIZE_YOUR_PUZZLE_TITLE:
                        emit(EVENTS.OPEN_CUSTOM_PUZZLE_INPUT_VIEW)
                        break
                    default:
                        emit(EVENTS.GENERATE_NEW_PUZZLE, { difficultyLevel: item })
                        closeView()
                }
            }
        },
        [nextGameMenuRef],
    )

    const getNextGameMenu = () => {
        return (
            <View style={styles.nextGameMenuContainer}>
                {Object.keys(LEVEL_DIFFICULTIES).map((levelText, index) => {
                    return (
                        <View key={levelText}>
                            <Touchable
                                style={styles.levelContainer}
                                touchable={TouchableTypes.opacity}
                                onPress={() => nextGameMenuItemClicked(levelText)}
                            >
                                {getLevelIcon(index)}
                                <Text style={styles.levelText}>{levelText}</Text>
                            </Touchable>
                        </View>
                    )
                })}
                {/* TODO: make these options a little more configurable */}
                <Touchable
                    key={CUSTOMIZE_YOUR_PUZZLE_TITLE}
                    style={styles.levelContainer}
                    touchable={TouchableTypes.opacity}
                    onPress={() => nextGameMenuItemClicked(CUSTOMIZE_YOUR_PUZZLE_TITLE)}
                >
                    <PersonalizePuzzleIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} />
                    <Text style={styles.levelText}>{CUSTOMIZE_YOUR_PUZZLE_TITLE}</Text>
                </Touchable>
                {screenName === SCREEN_NAME.HOME ? (
                    <Touchable
                        key={RESUME}
                        style={styles.levelContainer}
                        touchable={TouchableTypes.opacity}
                        onPress={() => nextGameMenuItemClicked(RESUME)}
                    >
                        <RestartIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} />
                        <Text style={styles.levelText}>{RESUME}</Text>
                    </Touchable>
                ) : null}
            </View>
        )
    }

    return (
        <BottomDragger
            parentHeight={parentHeight}
            // onDraggerOpened={onNewGameMenuOpened}
            onDraggerClosed={onMenuClosed}
            ref={nextGameMenuRef}
            bottomMostPositionRatio={1.1}
        >
            {getNextGameMenu()}
        </BottomDragger>
    )
}

export const NextGameMenu = React.memo(NextGameMenu_)
