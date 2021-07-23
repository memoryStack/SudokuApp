import React from 'react'
import { View, Dimensions } from 'react-native'
import { Undo } from './undo'
import { Eraser } from './eraser'
import { Pencil } from './pencil'
import { Hint } from './hint'
import { Styles } from './style'

const { width: windowWidth } = Dimensions.get('window')
const ICON_BOX_DIMENSION = (windowWidth / 100) * 5

const CellActions_ = ({ gameState, cellActionsData }) => {
    return (
        <View style={Styles.container}>
            <Undo iconBoxSize={ICON_BOX_DIMENSION} gameState={gameState} />
            <Eraser iconBoxSize={ICON_BOX_DIMENSION} gameState={gameState} />
            <Pencil iconBoxSize={ICON_BOX_DIMENSION} gameState={gameState} pencilState={cellActionsData.pencilState} />
            <Hint iconBoxSize={ICON_BOX_DIMENSION} gameState={gameState} numOfHints={cellActionsData.hints} />
        </View>
    )
}

export const CellActions = React.memo(CellActions_)
