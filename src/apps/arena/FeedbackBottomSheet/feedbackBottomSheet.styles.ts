import { StyleSheet } from 'react-native'
import _get from '@lodash/get'

import { hexToRGBA } from '@utils/util'

export const getStyles = (_: unknown, theme: unknown) => {
    const disabledContainer = _get(theme, ['button', 'filled', 'color', 'container', 'disabled'], {})
    const disabledLabel = _get(theme, ['button', 'filled', 'color', 'label-text', 'disabled'], {})

    return StyleSheet.create({
        container: {
            padding: 16,
            paddingVertical: 32,
        },
        title: {
            marginBottom: 8,
        },
        description: {
            marginBottom: 24,
            color: _get(theme, ['colors', 'on-surface-variant']),
        },
        pillsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        pillsContainerWrapper: {
            borderWidth: 1,
            borderColor: _get(theme, ['colors', 'outline']),
            borderRadius: 8,
            padding: 12,
            marginBottom: 24,
        },
        pillsContainerWrapperHighlight: {
            borderColor: _get(theme, ['colors', 'error']),
            borderWidth: 1,
        },
        textInputContainer: {
            marginBottom: 24,
        },
        textInput: {
            borderWidth: 1,
            borderColor: _get(theme, ['colors', 'outline']),
            borderRadius: 8,
            padding: 16,
            minHeight: 100,
            textAlignVertical: 'top',
            color: _get(theme, ['colors', 'on-surface']),
            ..._get(theme, ['typography', 'body', 'medium'], {}),
        },
        textInputFocused: {
            borderColor: _get(theme, ['colors', 'primary']),
            borderWidth: 2,
        },
        textInputHighlight: {
            borderColor: _get(theme, ['colors', 'error']),
            borderWidth: 2,
        },
        characterCount: {
            textAlign: 'right',
            marginTop: 4,
            color: _get(theme, ['colors', 'on-surface-variant']),
        },
        buttonsContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
        },
        noFeedbackButtonsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 12,
            width: '100%',
        },
        submitButton: {
            width: '100%',
        },
        submitButtonVisuallyDisabled: {
            backgroundColor: hexToRGBA(disabledContainer.background, disabledContainer.opacity),
        },
        submitButtonLabelVisuallyDisabled: {
            color: hexToRGBA(disabledLabel.color, disabledLabel.opacity),
        },
        outlinedButton: {
            paddingHorizontal: 16,
        },
        placeholderTextColor: {
            color: _get(theme, ['colors', 'on-surface-variant']),
        },
    })
}
