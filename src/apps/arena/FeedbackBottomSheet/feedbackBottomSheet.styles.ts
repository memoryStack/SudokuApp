import { StyleSheet } from 'react-native'
import _get from '@lodash/get'

export const getStyles = (_: unknown, theme: unknown) => {
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
            marginBottom: 24,
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
        outlinedButton: {
            paddingHorizontal: 16,
        },
        placeholderTextColor: {
            color: _get(theme, ['colors', 'on-surface-variant']),
        },
    })
}
