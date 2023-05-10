import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { BADGE_TYPE } from './badge.constants'

export const getStyles = ({ type }, theme) => {
    const size = _get(theme, ['badge', type, 'container', 'layout', 'size'])

    const sizeProps = {
        height: size,
        ...type === BADGE_TYPE.LARGE && { minWidth: size },
        ...type === BADGE_TYPE.SMALL && { width: size },
    }

    // NOTE: after assuming that all the icons/images with badges on them
    //      will be of 32*32 need to standardize the icon sizes
    const placementProps = {
        top: type === BADGE_TYPE.SMALL ? 0 : -4,
        ...type === BADGE_TYPE.SMALL && { right: 0 },
        ...type === BADGE_TYPE.LARGE && { left: 16 },
    }

    return StyleSheet.create({
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            ...placementProps,
            backgroundColor: _get(theme, ['badge', type, 'container', 'color']),
            ..._get(theme, ['badge', type, 'container', 'layout', 'shape']),
            padding: _get(theme, ['badge', type, 'container', 'layout', 'padding']),
            ...sizeProps,
        },
        label: {
            ...type === BADGE_TYPE.LARGE && {
                color: _get(theme, ['badge', type, 'label', 'color']),
                ..._get(theme, ['badge', type, 'label', 'font']),
            },
        },
    })
}
