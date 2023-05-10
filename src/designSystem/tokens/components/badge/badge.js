module.exports = {
    badge: {
        sm: {
            container: {
                color: {
                    value: '{colors.error}',
                },
                layout: {
                    shape: {
                        value: '{shape.corner.full}',
                    },
                    size: {
                        value: 6,
                        description: 'use it for width and height',
                    },
                },
            },
        },
        lg: {
            container: {
                color: {
                    value: '{colors.error}',
                },
                layout: {
                    shape: {
                        value: '{shape.corner.full}',
                    },
                    padding: {
                        value: 4,
                    },
                    size: {
                        value: 16,
                        description: 'use it as height only, width will depend on the content width',
                    },
                },
            },
            label: {
                color: {
                    value: '{colors.on-error}',
                },
                font: {
                    value: '{typography.label.small}',
                },
            },
        },
    },
}
