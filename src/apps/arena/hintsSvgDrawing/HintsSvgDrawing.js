/* eslint-disable react/prop-types */
import React, { memo, useState, useEffect } from 'react'

import { View } from 'react-native'

import PropTypes from 'prop-types'

import { Path, Svg } from 'react-native-svg'

import _map from '@lodash/map'
import _isNil from '@lodash/isNil'
import _isEmpty from '@lodash/isEmpty'
import _isFunction from '@lodash/isFunction'

import { HINT_ID_VS_SVG_DEFS } from './svgDefs'
import { HINT_ID_VS_SVG_ELEMENTS_HANDLER } from './svgElementsHandlers'
import { SimplePathConfigs } from './svgElementsHandlers/remotePairs/remotePairs'
import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'
import { STATIC_BOARD_ELEMENTS_DIMENSIONS } from '../constants'
import { roundToNearestPixel } from '@utils/util'
import { getRectangularHighlightsPaths } from './svgElementsHandlers/rectangularHighlights'

const svgBoardSizeDiff = 40 // 40 units bigger than the main board

const HintsSvgDrawing = ({
    boardRef, notesRefs, hint, svgProps, hideMarkersEnd,
}) => {
    const [svgElementsConfigs, setSvgElementsConfigs] = useState([])

    const [boardPageCordinates, setBoardPageCordinates] = useState(null)

    const { BOARD_GRID_WIDTH } = useBoardElementsDimensions()

    useEffect(() => {
        const measureBoard = () => {
            boardRef?.current?.measure?.((_x, _y, _width, _height, _pageX, _pageY) => {
                setBoardPageCordinates({ x: _pageX, y: _pageY })
            })
        }
        // have to put this delay, else notes and board
        // measurements are all empty
        // TODO: it needs some serious searching

        // increased the delay from 100 to 1000 because when screen navigation happens and we go back to Arena page
        // then these is a difference of some pixels in board and notes measurements sometimes
        setTimeout(measureBoard, 1000)
    }, [])

    useEffect(() => {
        const handler = async () => {
            const svgElementsHandler = HINT_ID_VS_SVG_ELEMENTS_HANDLER[hint.id]
            // if (_isEmpty(boardPageCordinates) || !_isFunction(svgElementsHandler) || _isEmpty(svgProps)) return
            if (_isEmpty(boardPageCordinates)) return

            setSvgElementsConfigs(getRectangularHighlightsPaths(svgProps))

            // setSvgElementsConfigs(await svgElementsHandler({
            //     notesRefs, boardPageCordinates, svgProps, hideMarkersEnd,
            // }))
        }
        handler()
    }, [boardPageCordinates, boardRef, notesRefs, hint, svgProps, hideMarkersEnd])

    if (_isEmpty(svgElementsConfigs)) return null

    const getContianerStyles = () => ({
        position: 'absolute',
        width: roundToNearestPixel(BOARD_GRID_WIDTH + svgBoardSizeDiff),
        height: roundToNearestPixel(BOARD_GRID_WIDTH + svgBoardSizeDiff),
        top: -roundToNearestPixel(svgBoardSizeDiff / 2 + STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH),
        left: -roundToNearestPixel(svgBoardSizeDiff / 2 + STATIC_BOARD_ELEMENTS_DIMENSIONS.THIN_BORDER_WIDTH),
        overflow: 'visible',
        zIndex: 1,
        // backgroundColor: 'rgba(255, 0, 0, 0.2)',
    })

    const getDefs = () => {
        const DefsComponent = HINT_ID_VS_SVG_DEFS[hint.id]
        return !_isNil(DefsComponent) ? <DefsComponent /> : null
    }

    return (
        <View style={getContianerStyles()} pointerEvents="none">
            <Svg
                width="100%"
                height="100%"
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
    hideMarkersEnd: PropTypes.bool,
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
    hideMarkersEnd: false,
    // boardRef: {},
}

export default memo(HintsSvgDrawing)
