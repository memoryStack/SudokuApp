import React from 'react'

import { StyleProp, ViewStyle, View, ViewPropTypes } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './levelStars.styles'

import { LevelStarIcon } from '@resources/svgIcons/levelStar'

export interface Props {
    activeStars: number
    containerStyle?: StyleProp<ViewStyle>,
    middleStarStyle?: StyleProp<ViewStyle>,
    iconSizeType?: string
}

// TODO: move these to the contants in the UI layer
export const ICON_SIZE_TYPES = {
    EXTRA_SMALL: 'EXTRA_SMALL',
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    LARGE: 'LARGE',
    EXTRA_LARGE: 'EXTRA_LARGE'
}

export const ICON_SIZES = {
    EXTRA_SMALL: { width: 16, height: 16 },
    SMALL: { width: 20, height: 20 },
    MEDIUM: { width: 24, height: 24 },
    LARGE: { width: 28, height: 28 },
    EXTRA_LARGE: { width: 32, height: 32 },
}

const getStarsActiveInfo = (activeStars: number) => {
    if (activeStars === 1) return { 0: true, 1: false, 2: false, }
    if (activeStars === 2) return { 0: true, 1: false, 2: true, }
    if (activeStars === 3) return { 0: true, 1: true, 2: true, }
    return { 0: false, 1: false, 2: false, }
}

const LevelStars: React.FC<Props> = ({
    activeStars,
    containerStyle,
    middleStarStyle,
    iconSizeType
}) => {
    const styles = useStyles(getStyles)
    const starsActiveInfo = getStarsActiveInfo(activeStars)

    const iconDimensions = ICON_SIZES[iconSizeType] || {}

    const renderIcon = (isActive: boolean) => {
        return (
            <LevelStarIcon active={isActive} {...iconDimensions} />
        )
    }

    return (
        <View style={[styles.starsContainer, containerStyle]}>
            {renderIcon(starsActiveInfo[0])}
            <View style={[styles.middleStar, middleStarStyle]}>
                {renderIcon(starsActiveInfo[1])}
            </View>
            {renderIcon(starsActiveInfo[2])}
        </View>
    )
}

export default React.memo(LevelStars)

LevelStars.propTypes = {
    activeStars: PropTypes.number,
    containerStyle: ViewPropTypes.style,
    middleStarStyle: ViewPropTypes.style,
}

LevelStars.defaultProps = {
    activeStars: 0,
    containerStyle: null,
    middleStarStyle: null,
}
