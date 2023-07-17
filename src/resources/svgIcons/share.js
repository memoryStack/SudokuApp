import React, { memo } from 'react'

import { Svg, Path, G } from 'react-native-svg'

import PropTypes from 'prop-types'

/* SVGR has dropped some elements not supported by react-native-svg: title, filter */
const SvgComponent = ({ fill, ...restProps }) => (
    <Svg width={16} height={16} viewBox="0 0 16 16" {...restProps}>
        <G fill="none" fill-rule="evenodd">
            <Path
                d="M0 0H16V16H0z"
                transform="translate(-32 -472) translate(0 354) translate(16 16) translate(0 94) translate(16 8)"
            />
            <Path
                fill={fill}
                d="M12.044 13.678c-.535 0-.97-.436-.97-.972 0-.535.435-.971.97-.971.534 0 .97.436.97.971 0 .536-.436.972-.97.972M3.956 8.994c-.534 0-.97-.435-.97-.971s.436-.971.97-.971c.535 0 .97.435.97.971s-.435.971-.97.971m8.088-6.672c.534 0 .97.436.97.972 0 .535-.436.971-.97.971-.535 0-.97-.436-.97-.971 0-.536.435-.972.97-.972m0 8.424c-.577 0-1.095.253-1.454.653L5.835 8.567c.05-.173.078-.355.078-.544 0-.192-.03-.378-.081-.553l4.759-2.868c.358.4.876.652 1.453.652 1.078 0 1.956-.88 1.956-1.96 0-1.081-.878-1.96-1.956-1.96-1.079 0-1.957.879-1.957 1.96 0 .147.018.29.049.428l-4.813 2.9c-.353-.345-.835-.56-1.367-.56C2.878 6.063 2 6.943 2 8.024c0 1.08.878 1.96 1.956 1.96.535 0 1.02-.217 1.374-.566l4.806 2.862c-.031.138-.049.28-.049.427 0 1.081.878 1.96 1.957 1.96 1.078 0 1.956-.879 1.956-1.96 0-1.08-.878-1.96-1.956-1.96"
                transform="translate(-32 -472) translate(0 354) translate(16 16) translate(0 94) translate(16 8)"
            />
        </G>
    </Svg>
)

export const ShareIcon = memo(SvgComponent)

SvgComponent.propTypes = {
    fill: PropTypes.string,
}

SvgComponent.defaultProps = {
    fill: '#3E4152',
}
