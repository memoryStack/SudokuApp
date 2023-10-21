module.exports = {
    dialog: {
        container: {
            color: {
                value: '{colors.surface-container-high}',
            },
            layout: {
                shape: {
                    value: '{shape.corner.extra-large}',
                },
                width: {
                    min: {
                        value: 280,
                    },
                    max: {
                        value: 560,
                        description: 'max width is for tablets',
                    },
                },
                padding: {
                    value: 24,
                },
                spacing: {
                    iconAndTitle: { value: 16 },
                    titleAndSupportingText: { value: 16 },
                    titleAndBody: { value: 16 },
                    bodyAndActions: { value: 24 },
                },
            },
        },
        icon: {
            color: {
                value: '{colors.secondary}',
            },
            layout: {
                size: { value: 24 },
            },
        },
        headline: {
            color: {
                value: '{colors.on-surface}',
            },
            font: {
                value: '{typography.heading.small}',
            },
            layout: {
                withIcon: {
                    value: 'center',
                },
                withoutIcon: {
                    value: 'left',
                },
            },
        },
        textButtons: {
            spacing: {
                paddingTop: { value: 8 },
                paddingRight: { value: 0 },
                paddingBottom: { value: 8 },
                paddingLeft: { value: 0 },
            },
            gap: { value: 24 },
        },
        supportingText: {
            color: {
                value: '{colors.on-surface-variant}',
            },
            font: {
                value: '{typography.body.medium}',
            },
        },
        scrim: {
            color: {
                value: '{colors.scrim}',
            },
            opacity: {
                value: '20%',
                type: 'colorOpacity',
            },
        },
    },
}
