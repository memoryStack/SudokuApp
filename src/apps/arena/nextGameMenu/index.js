import React, { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { BottomDragger } from '../../components/BottomDragger'
import { Svg, Path } from 'react-native-svg'
import { RestartIcon } from '../../../resources/svgIcons/restart'
import { LEVEL_DIFFICULTIES } from '../../../resources/constants'
import { Touchable, TouchableTypes } from '../../components/Touchable'

const LEVEL_ICON_DIMENSION = 24
const NEXT_GAME_MENU_ROW_HEIGHT = 50
export const CUSTOMIZE_YOUR_PUZZLE_TITLE = 'Customize Your Puzzle'
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
    },
})

// TODO: research about using "useMemo" for the functions which are rendering a view in the 
//          functional component
const NextGameMenu_ = ({ parentHeight, menuItemClick, onMenuClosed }) => {

    const nextGameMenuRef = useRef(null)

    const getBar = (barNum, level) => {
        const pathD = ['M', (75 + 100 * barNum), '450', 'L', (75 + 100 * barNum), (350 - 100 * barNum),
                        'A 25 25 0 0 1', (125 + 100 * barNum), (350 - 100 * barNum), 'L', (125 + 100 * barNum), '450',
                        'A 25 25 0 0 1', (75 + 100 * barNum), '450'].join(' ')

        let stroke
        let fill
        if (barNum <= level) stroke = "rgba(0, 0, 0, .5)"
        else stroke = "black"
        if (barNum > level) fill = "none"
        else fill = "black"
        return (
            <Path
                d={pathD}
                stroke={stroke}
                fill={fill}
                strokeWidth={5}
            />
        )
    }

    const getLevelIcon = (level) => {
        const childArray = []
        for(let i = 0; i < 4; i++)
            childArray.push(getBar(i, level))
        return (
            <Svg viewBox="0 0 500 500" width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION}>
                {childArray}
            </Svg>
        )
    }

    const getNextGameMenu = () => {
        return (
            <View style={styles.nextGameMenuContainer}>
                {
                    Object.keys(LEVEL_DIFFICULTIES).map((levelText, index) => {
                        return (
                            <View key={levelText}>
                                <Touchable
                                    style={styles.levelContainer}
                                    touchable={TouchableTypes.opacity}
                                    onPress={() => menuItemClick(levelText)}
                                >
                                    {getLevelIcon(index)}
                                    <Text style={styles.levelText}>{levelText}</Text>
                                </Touchable>
                            </View>
                        )
                    })
                }
                <Touchable
                    style={styles.levelContainer}
                    touchable={TouchableTypes.opacity}
                    onPress={() => menuItemClick('resume')}
                > 
                    <RestartIcon width={LEVEL_ICON_DIMENSION} height={LEVEL_ICON_DIMENSION} />
                    <Text style={styles.levelText}>{'Resume'}</Text>
                </Touchable>
                {/* TODO: make this and above option a little more configurable */}
                <Touchable
                    style={styles.levelContainer}
                    touchable={TouchableTypes.opacity}
                    onPress={() => menuItemClick(CUSTOMIZE_YOUR_PUZZLE_TITLE)}
                >
                    <Text style={styles.levelText}>{CUSTOMIZE_YOUR_PUZZLE_TITLE}</Text>
                </Touchable>
            </View>
        )
    }

    return (
        <BottomDragger
            parentHeight={parentHeight}
            onDraggerClosed={onMenuClosed}
            ref={nextGameMenuRef}
            bottomMostPositionRatio={1.1}
        >
            {getNextGameMenu()}
        </BottomDragger>
    )
}

export const NextGameMenu = React.memo(NextGameMenu_)
