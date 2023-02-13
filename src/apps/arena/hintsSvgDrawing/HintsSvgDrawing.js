import React, { memo, useState, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Svg } from 'react-native-svg'

import _map from 'lodash/src/utils/map'
import _isNil from 'lodash/src/utils/isNil'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _isFunction from 'lodash/src/utils/isFunction'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { HINT_ID_VS_SVG_DEFS } from './svgDefs'
import { HINT_ID_VS_SVG_ELEMENTS_HANDLER } from './svgElementsHandlers'

const HintsSvgDrawing = ({ boardRef, notesRefs, hint }) => {
    const {
        BOARD_GRID_WIDTH: SVG_CONTAINER_WIDTH,
        BOARD_GRID_HEIGHT: SVG_CONTAINER_HEIGHT,
    } = useBoardElementsDimensions()

    const [svgElementsConfigs, setSvgElementsConfigs] = useState([])
    const [boardPageCordinates, setBoardPageCordinates] = useState({ x: -1, y: -1 })

    useEffect(() => {
        return
        const svgElementsHandler = HINT_ID_VS_SVG_ELEMENTS_HANDLER[hint.id]
        if (!_isFunction(svgElementsHandler)) return

        boardRef.current && boardRef.current.measure(async (_x, _y, _boardWidth, _boardHeight, boardPageX, boardPageY) => {
            // eslint-disable-next-line no-shadow
            const boardPageCordinates = { x: boardPageX, y: boardPageY }
            setBoardPageCordinates(boardPageCordinates)
            setSvgElementsConfigs(await svgElementsHandler({ notesRefs, boardPageCordinates }))
        })
    }, [boardRef, notesRefs, hint])

    if (_isEmpty(svgElementsConfigs)) return null

    const getContianerStyles = () => ({
        position: 'absolute',
        width: SVG_CONTAINER_WIDTH,
        height: SVG_CONTAINER_HEIGHT,
        top: boardPageCordinates.y,
        left: boardPageCordinates.x,
        overflow: 'visible',
        zIndex: 1,
    })

    const getDefs = () => {
        const DefsComponent = HINT_ID_VS_SVG_DEFS[hint.id]
        return !_isNil(DefsComponent) ? <DefsComponent /> : null
    }

    return (
        <View style={getContianerStyles()} pointerEvents="none">
            <Svg
                viewBox={`0 0 ${SVG_CONTAINER_WIDTH} ${SVG_CONTAINER_HEIGHT}`}
                width={SVG_CONTAINER_WIDTH}
                height={SVG_CONTAINER_HEIGHT}
                overflow="visible"
            >
                {getDefs()}
                {_map(svgElementsConfigs, ({ element: Element, props }) => (<Element {...props} />))}
            </Svg>
        </View>
    )
}

// TODO: fix these proptypes
HintsSvgDrawing.propTypes = {
    hint: PropTypes.object,
    // boardRef: PropTypes.oneOfType([
    //     PropTypes.func,
    //     PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    // ]),
    // PropTypes.shape({
    //     color: PropTypes.string,
    //     fontSize: PropTypes.number
    // })
    // notesRefs: PropTypes.shape(), // how to write it's shape ??
}

HintsSvgDrawing.defaultProps = {
    hint: {},
    // boardRef: {},
}

export default memo(HintsSvgDrawing)
