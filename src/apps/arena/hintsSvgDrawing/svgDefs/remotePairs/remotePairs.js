import React, { memo } from 'react'

import { Path, Defs, Marker } from 'react-native-svg'

import { MARKER_TYPES } from './remotePairs.constants'

// TODO: pick this color from somewhere common where
// UI related constants are present for each hints
const linkColor = 'rgb(217, 19, 235)'

const getMarker = ({ id, ...rest }) => (
    <Marker
        id={id}
        viewBox="0 -5 10 10"
        refY="0"
        markerUnits="strokeWidth"
        markerWidth="4"
        markerHeight="3"
        orient="auto"
        {...rest}
    >
        <Path
            d="M0,-5L10,0L0,5"
            stroke={linkColor}
            fill={linkColor}
        />
    </Marker>
)

const RemotePairsDefs = () => (
    <Defs>
        {getMarker({ id: MARKER_TYPES.LONG_LINK, refX: '8' })}
        {getMarker({ id: MARKER_TYPES.SHORT_LINK, refX: '5' })}
    </Defs>
)

export default memo(RemotePairsDefs)
