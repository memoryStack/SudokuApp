import React, { memo } from 'react'

import { Svg, Path, G } from 'react-native-svg'

import PropTypes from 'prop-types'

/* SVGR has dropped some elements not supported by react-native-svg: title */
const SvgComponent = ({ fill, ...restProps }) => (
    <Svg width="1em" height="1em" viewBox="0 0 34 34" {...restProps}>
        <G stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <G transform="translate(-741.000000, -1281.000000)" fill={fill}>
                <Path d="M759.892034,1298 L773.823452,1284.06827 C774.408112,1283.4836 774.408112,1282.52699 773.823452,1281.94232 C773.238792,1281.35765 772.281467,1281.35765 771.696808,1281.94232 L757.76539,1295.87331 L743.834716,1281.94232 C743.250056,1281.35765 742.292732,1281.35765 741.708072,1281.94232 C741.123412,1282.52699 741.123412,1283.4836 741.708072,1284.06827 L755.639489,1298 L741.708072,1311.93173 C741.123412,1312.5164 741.123412,1313.47301 741.708072,1314.05768 L741.708072,1314.05768 C742.292732,1314.64235 743.250056,1314.64235 743.834716,1314.05768 L757.76539,1300.12669 L771.696808,1314.05768 C772.281467,1314.64235 773.238792,1314.64235 773.823452,1314.05768 L773.823452,1314.05768 C774.408112,1313.47301 774.408112,1312.5164 773.823452,1311.93173 L759.892034,1298 Z" />
            </G>
        </G>
    </Svg>
)

export const CloseIcon = memo(SvgComponent)

SvgComponent.propTypes = {
    fill: PropTypes.string,
}

SvgComponent.defaultProps = {
    fill: '',
}
