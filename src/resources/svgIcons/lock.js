import React, { memo } from 'react'

import PropTypes from 'prop-types'

import Svg, { Path } from 'react-native-svg'

const SvgComponent = ({
    width, height, fill, ...restProps
}) => (
    <Svg width={width} height={height} viewBox="0 0 16 16" {...restProps}>
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 6V4C4 1.79086 5.79086 0 8 0C10.2091 0 12 1.79086 12 4V6H14V16H2V6H4ZM6 4C6 2.89543 6.89543 2 8 2C9.10457 2 10 2.89543 10 4V6H6V4ZM7 13V9H9V13H7Z"
            fill={fill}
        />
    </Svg>
);

export const LockIcon = memo(SvgComponent)

SvgComponent.propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    fill: PropTypes.string,
}

SvgComponent.defaultProps = {
    width: 24,
    height: 24,
    fill: "#000000",
}
