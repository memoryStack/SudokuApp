import React, { memo, useState, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Svg } from 'react-native-svg'

import _map from '@lodash/map'
import _isNil from '@lodash/isNil'
import _isEmpty from '@lodash/isEmpty'
import _isFunction from '@lodash/isFunction'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { HINT_ID_VS_SVG_DEFS } from './svgDefs'
import { HINT_ID_VS_SVG_ELEMENTS_HANDLER } from './svgElementsHandlers'

const HintsSvgDrawing = ({
    boardRef, notesRefs, hint, svgProps,
}) => {
    const {
        BOARD_GRID_WIDTH: SVG_CONTAINER_WIDTH,
        BOARD_GRID_HEIGHT: SVG_CONTAINER_HEIGHT,
    } = useBoardElementsDimensions()

    const [svgElementsConfigs, setSvgElementsConfigs] = useState([])

    const [boardPageCordinates, setBoardPageCordinates] = useState(null)

    useEffect(() => {
        const measureBoard = () => {
            boardRef.current && boardRef.current.measure((_x, _y, _width, _height, _pageX, _pageY) => {
                setBoardPageCordinates({ x: _pageX, y: _pageY })
            })
        }
        // have to put this delay, else notes and board
        // measurements are all empty
        // TODO: it needs some serious searching
        setTimeout(measureBoard, 100)
    }, [])

    useEffect(() => {
        const handler = async () => {
            const svgElementsHandler = HINT_ID_VS_SVG_ELEMENTS_HANDLER[hint.id]
            if (_isEmpty(boardPageCordinates) || !_isFunction(svgElementsHandler) || _isEmpty(svgProps)) return
            setSvgElementsConfigs(await svgElementsHandler({ notesRefs, boardPageCordinates, svgProps }))
        }
        handler()
    }, [boardPageCordinates, boardRef, notesRefs, hint, svgProps])

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
