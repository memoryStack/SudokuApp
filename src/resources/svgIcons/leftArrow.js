import React from 'react'
import { Svg, Path, G } from 'react-native-svg'

const SvgComponent = props => (
    <Svg width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" {...props}>
        <G
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill={props.fill || 'black'}
            stroke="none"
        >
            <Path
                d="M2155 4141 c-33 -21 -1423 -1343 -1456 -1386 -76 -96 -79 -272 -7
                    -379 28 -41 1419 -1369 1463 -1397 41 -26 129 -26 173 1 47 29 72 75 72 137 0
                    29 -5 64 -12 78 -6 14 -290 289 -631 613 l-619 587 1624 5 c1544 5 1625 6
                    1651 23 91 59 91 215 0 274 -26 17 -107 18 -1649 23 l-1622 5 610 580 c336
                    319 619 594 629 610 26 41 25 129 -1 173 -11 18 -34 41 -52 52 -44 27 -132 27
                    -173 1z"
            />
        </G>
    </Svg>
)

export const LeftArrow = React.memo(SvgComponent)
