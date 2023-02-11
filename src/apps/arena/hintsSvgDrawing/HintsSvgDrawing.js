import React, { memo, useState, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Svg, Path } from 'react-native-svg'

import _map from 'lodash/src/utils/map'
import _isNil from 'lodash/src/utils/isNil'
import _isEmpty from 'lodash/src/utils/isEmpty'
import _isFunction from 'lodash/src/utils/isFunction'

import { roundToNearestPixel } from '../../../utils/util'

import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'

import { MARKER_TYPES } from './svgDefs/remotePairs/remotePairs.constants'
import { HINT_ID_VS_SVG_DEFS } from './svgDefs'
import { HINT_ID_VS_SVG_ELEMENTS_HANDLER } from './svgElementsHandlers'

const SVG_STROKE_WIDTH = roundToNearestPixel(2) // width 2 is good for chains

const linkColor = 'rgb(217, 19, 235)'

const HintsSvgDrawing = ({ boardRef, notesRefs, hint }) => {
    const {
        BOARD_GRID_WIDTH: SVG_CONTAINER_WIDTH,
        BOARD_GRID_HEIGHT: SVG_CONTAINER_HEIGHT,
    } = useBoardElementsDimensions()

    const [outlineState, setPath] = useState({ svgElements: [], boardYPos: -1, boardXPos: -1 })

    useEffect(() => {
        const handler = () => {
            boardRef.current && boardRef.current.measure(async (_x, _y, _boardWidth, _boardHeight, boardPageX, boardPageY) => {
                const svgElementsHandler = HINT_ID_VS_SVG_ELEMENTS_HANDLER[hint.id]
                if (!_isFunction(svgElementsHandler)) return
                const boardPageCordinates = { x: boardPageX, y: boardPageY }
                setPath({
                    svgElements: await svgElementsHandler({ notesRefs, boardPageCordinates }),
                    boardXPos: boardPageX,
                    boardYPos: boardPageY,
                })
            })
        }
        setTimeout(handler, 4000)
    }, [boardRef, notesRefs])

    const getDefs = () => {
        const DefsComponent = HINT_ID_VS_SVG_DEFS[hint.id]
        return !_isNil(DefsComponent) ? <DefsComponent /> : null
    }

    if (_isEmpty(outlineState.svgElements)) return null

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
                {
                    _map(outlineState.svgElements, ({ element: Element, markerID = MARKER_TYPES.LONG_LINK, props }) => (
                        <Element
                            {...props}
                            // TODO: get these below props from components only
                            stroke={linkColor}
                            strokeWidth={SVG_STROKE_WIDTH}
                            strokeLinejoin="round"
                            strokeDasharray="6, 4"
                            {... (Element === Path) && { markerEnd: `url(#${markerID})` }}
                        />
                    ))
                }
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
