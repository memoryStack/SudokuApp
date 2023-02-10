import React, { memo, useState } from 'react'

import { View } from 'react-native'

import { Svg } from 'react-native-svg'

import _map from 'lodash/src/utils/map'
import _isNil from 'lodash/src/utils/isNil'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { HINT_ID_VS_SVG_DEFS } from './svgDefs'

// it needs all the refs of board and all notes and all the data
// which is needed by hints to generate the svg details
const HintsSvgDrawing = ({
    boardRef, notesRefs, hint, children, outlineState,
}) => {
    const {
        BOARD_GRID_WIDTH: SVG_CONTAINER_WIDTH,
        BOARD_GRID_HEIGHT: SVG_CONTAINER_HEIGHT,
    } = useBoardElementsDimensions()

    // const [outlineState, setPath] = useState({ svgElements: [], boardYPos: -1, boardXPos: -1 })

    const getSvgElementsConfigs = []

    const getDefs = () => {
        const DefsComponent = HINT_ID_VS_SVG_DEFS[hint.id]
        if (_isNil(DefsComponent)) return null
        return <DefsComponent />
    }

    return (
        <View
            style={{
                width: SVG_CONTAINER_WIDTH,
                height: SVG_CONTAINER_HEIGHT,
                position: 'absolute',
                zIndex: 1,
                overflow: 'visible',
                top: outlineState.boardYPos,
                left: outlineState.boardXPos,
            }}
            pointerEvents="none"
        >
            <Svg
                viewBox={`0 0 ${SVG_CONTAINER_WIDTH} ${SVG_CONTAINER_HEIGHT}`}
                width={SVG_CONTAINER_WIDTH}
                height={SVG_CONTAINER_HEIGHT}
                overflow="visible"
            >
                {getDefs()}
                {children}
            </Svg>
        </View>
    )
}

// TODO: add prop types

export default memo(HintsSvgDrawing)
