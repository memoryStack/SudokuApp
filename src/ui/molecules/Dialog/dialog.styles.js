import { StyleSheet } from 'react-native'

import _get from '@lodash/get'

export const getStyles = ({ isIconPresent, windowWidth }, theme) => StyleSheet.create({
    overlay: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: _get(theme, 'dialog.scrim.color'),
    },
    container: {
        backgroundColor: _get(theme, 'dialog.container.color'),
        borderRadius: _get(theme, 'dialog.container.layout.shape.borderRadius'),
        padding: _get(theme, 'dialog.container.layout.padding'),
        width: Math.min(windowWidth - 48, _get(theme, 'dialog.container.layout.width.max')), // TODO: take care of this 48 here
    },
    icon: {
        marginBottom: _get(theme, 'dialog.container.layout.spacing.iconAndTitle'),
        alignSelf: 'center',
    },
    headline: {
        color: _get(theme, 'dialog.headline.color'),
        ..._get(theme, 'dialog.headline.font'),
        textAlign: isIconPresent ? _get(theme, 'dialog.headline.layout.withIcon') : _get(theme, 'dialog.headline.layout.withoutIcon'),
    },
    description: {
        color: _get(theme, 'dialog.supportingText.color'),
        ..._get(theme, 'dialog.supportingText.font'),
        marginTop: _get(theme, 'dialog.container.layout.spacing.titleAndSupportingText'),
    },
    divider: {
        marginTop: 16,
    },
    bodyContainer: {
        marginTop: _get(theme, 'dialog.container.layout.spacing.titleAndBody'),
        alignSelf: 'center',
    },
    footerButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: _get(theme, 'dialog.container.layout.spacing.bodyAndActions'),
        alignSelf: 'flex-end',
    },
    footerButtonsGap: {
        marginLeft: _get(theme, 'dialog.textButtons.gap'),
    },
})
