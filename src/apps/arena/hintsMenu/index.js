import React from 'react'
import { View, Text } from 'react-native'
import { Touchable, TouchableTypes } from '../../components/Touchable'
import { emit } from '../../../utils/GlobalEventBus'
import { EVENTS } from '../../../resources/constants'
import { noOperationFunction } from '../../../utils/util'
import { fonts } from '../../../resources/fonts/font'

const HintsMenu_ = ({ visibilityToggler = noOperationFunction }) => {
    const handleItemClicked = code => {
        emit(EVENTS.SHOW_SELECTIVE_HINT, { code })
        visibilityToggler()
    }

    const hintsMenu = [
        {
            label: 'Naked\nSingle',
            code: 0,
        },
        {
            label: 'Hidden\nSingle',
            code: 1,
        },
        {
            label: 'Naked\nDouble',
            code: 2,
        },
        {
            label: 'Hidden\nDouble',
            code: 3,
        },
        {
            label: 'Naked\nTripple',
            code: 4,
        },
        {
            label: 'Hidden\nTripple',
            code: 5,
        },
        {
            label: 'All',
            code: -1,
        },
    ]

    const renderMenuItem = ({ label, code }) => {
        return (
            <Touchable
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: rgba('#d5e5f6', 60),
                    // backgroundColor: 'white',
                }}
                onPress={() => handleItemClicked(code)}
                touchable={TouchableTypes.opacity}
                key={label}
            >
                <Text
                    style={{
                        color: 'rgb(49, 90, 163)',
                        fontSize: 20,
                        fontFamily: fonts.regular,
                    }}
                >
                    {label}
                </Text>
            </Touchable>
        )
    }

    const COLUMNS_COUNT = 2
    const BORDER_THICKNESS = 2

    const rows = []
    let row = []
    hintsMenu.forEach((item, index) => {
        const isLastItem = index === hintsMenu.length - 1
        const isLastColumn = index % COLUMNS_COUNT === COLUMNS_COUNT - 1 || isLastItem

        const menuItem = renderMenuItem(item)
        row.push(menuItem)

        if (isLastColumn) {
            rows.push(
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    {row}
                </View>,
            )

            if (!isLastItem)
                rows.push(
                    <View style={{ width: '101%', height: BORDER_THICKNESS, backgroundColor: 'rgb(49, 90, 163)' }} />,
                )

            row = []
        } else {
            row.push(<View style={{ width: BORDER_THICKNESS, height: '101%', backgroundColor: 'rgb(49, 90, 163)' }} />)
        }
    })

    return (
        <Touchable onPress={visibilityToggler}>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }}
            >
                <View
                    style={{
                        height: '50%',
                        width: '75%',
                        backgroundColor: 'white',
                        borderRadius: 32,
                        overflow: 'hidden',
                    }}
                >
                    {rows}
                </View>
            </View>
        </Touchable>
    )
}

export const HintsMenu = React.memo(HintsMenu_)
