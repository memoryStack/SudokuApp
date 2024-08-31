import React, { memo } from 'react'

import Svg, { Path, G } from 'react-native-svg'

import PropTypes from 'prop-types'

const SvgComponent = ({ fill, width, height, ...restProps }) => (
    <Svg height={height} width={width} viewBox="0 0 6 7" id="Play" {...restProps}>
        <G fillRule="evenodd">
            <G fill={fill} transform="translate(-347 -3766)">
                <G transform="translate(56 160)">
                    <Path
                        d="M296.495 3608.573l-3.994-2.43c-.669-.408-1.501.107-1.501.926v4.862c0 .82.832 1.333 1.5.927l3.995-2.43c.673-.41.673-1.445 0-1.855"
                        fill={fill}
                    />
                </G>
            </G>
        </G>
    </Svg>
);

export const PlayIcon = memo(SvgComponent)

SvgComponent.propTypes = {
    fill: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
}

SvgComponent.defaultProps = {
    fill: "#595bd4",
    width: 24,
    height: 24,
}
