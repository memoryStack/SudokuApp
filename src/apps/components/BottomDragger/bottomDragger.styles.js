import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

import { hexToRGBA } from '@utils/util'
import { fonts } from '../../../resources/fonts/font'

import {
    HEADER_HEIGHT,
    XXSMALL_SIZE,
    XSMALL_SPACE,
} from './bottomDragger.constants'

export const getStyles = (_, theme) => {
    const { color: scrimColor, opacity: scrimOpacity } = _get(theme, ['bottomSheet', 'scrim'])

    return StyleSheet.create({
        slidingParentContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: hexToRGBA(scrimColor, scrimOpacity),
        },
        header: {
            justifyContent: 'space-around',
            alignItems: 'center',
            width: '100%',
            height: HEADER_HEIGHT,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: 'rgb(216, 217, 220)',
            borderTopLeftRadius: XXSMALL_SIZE,
            borderTopRightRadius: XXSMALL_SIZE,
        },
        subView: {
            position: 'absolute',
            width: '100%',
            backgroundColor: 'white',
            // TODO: use of below color needs some research
            // backgroundColor: _get(theme, ['bottomSheet', 'container', 'color']),
            ..._get(theme, ['bottomSheet', 'container', 'layout', 'shape']),
        },
        clipStyle: {
            height: XSMALL_SPACE,
            width: 24,
            borderRadius: XSMALL_SPACE,
            backgroundColor: hexToRGBA('#282C3F', 20),
        },
        headerText: {
            fontSize: 20,
            color: hexToRGBA('#282C3F', 90),
            fontFamily: fonts.regular,
        },
    })
}
