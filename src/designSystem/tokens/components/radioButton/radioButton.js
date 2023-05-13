module.exports = {
    radioButton: {
        outerRing: {
            size: {
                value: 20,
            },
            shape: {
                value: '{shape.corner.full}',
            },
            borderWidth: {
                value: 2,
            },
        },
        innerDot: {
            size: {
                value: 10,
            },
            shape: {
                value: '{shape.corner.full}',
            },
        },
        selected: {
            color: {
                value: '{colors.primary}',
            },
        },
        default: {
            color: {
                value: '{colors.on-surface-variant}',
            },
        },
        disabled: {
            color: {
                value: '{colors.on-surface}',
            },
            opacity: {
                value: '38%',
                type: 'colorOpacity',
            },
        },
    },
}
