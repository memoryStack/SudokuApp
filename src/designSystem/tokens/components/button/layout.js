// TODO: use these values from other small tokens like sizing
// TODO: if we need buttons variations like sm, medium, large
//          then we can add those variations in this layout
// TODO: button-label-text weight hasn't been configured yet
// TODO: know what is the default value for all of these properties
//          right now i am using empty-string
const DEFAULT = {
    container: {
        height: {
            value: 40,
        },
        'border-radius': {
            value: 20,
        },
        padding: {
            'without-icon': {
                'padding-left': {
                    value: 24,
                },
                'padding-right': {
                    value: 24,
                },
            },
            'with-icon': {
                'icon-side-padding': {
                    value: 16,
                },
                'icon-opposite-side-padding': {
                    value: 24,
                },
            },
        },
    },
    icon: {
        size: {
            value: 18,
        },
    },
    'label-text': {
        font: {
            value: '{typography.label.large}',
        },
    },
    'items-spacing': {
        'icon-and-label-text': {
            value: 8,
        },
    },
}

const OUTLINED = {
    container: {
        height: {
            value: 40,
        },
        'border-radius': {
            value: 20,
        },
        'border-width': {
            value: 1,
        },
        padding: {
            'without-icon': {
                'padding-left': {
                    value: 24,
                },
                'padding-right': {
                    value: 24,
                },
            },
            'with-icon': {
                'icon-side-padding': {
                    value: 16,
                },
                'icon-opposite-side-padding': {
                    value: 24,
                },
            },
        },
    },
    icon: {
        size: {
            value: 18,
        },
    },
    'label-text': {
        font: {
            value: '{typography.label.large}',
        },
    },
    'items-spacing': {
        'icon-and-label-text': {
            value: 8,
        },
    },
}

// TODO: for all text-buttons use hitslop for ease of pressing
const TEXT = {
    container: {
        height: {
            value: '',
        },
        'border-radius': {
            value: '',
        },
        padding: {
            'without-icon': {
                'padding-left': {
                    value: '',
                },
                'padding-right': {
                    value: '',
                },
            },
            'with-icon': {
                'icon-side-padding': {
                    value: '',
                },
                'icon-opposite-side-padding': {
                    value: '',
                },
            },
        },
    },
    icon: {
        size: {
            value: 18,
        },
    },
    'label-text': {
        font: {
            value: '{typography.label.large}',
        },
    },
    'items-spacing': {
        'icon-and-label-text': {
            value: 8,
        },
    },
}

module.exports = {
    button: {
        filled: { layout: DEFAULT },
        tonal: { layout: DEFAULT },
        // elevated: { layout: DEFAULT }, // TODO: let's avoid elevated buttons for now. we need shadow tokens for this
        outlined: { layout: OUTLINED },
        text: { layout: TEXT },
    },
}
