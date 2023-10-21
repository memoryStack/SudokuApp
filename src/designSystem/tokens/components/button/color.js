// interaction states are
/*
    enabled
    disabled
    pressed -> ignore it for now, need to understand https://m3.material.io/foundations/interaction/states/state-layers
                to better apply tokens
    focused -> not sure when to use it, skipping for now
    hovered -> doesn't not exist in mobiles
*/

module.exports = {
    button: {
        filled: {
            color: {
                container: {
                    enabled: {
                        background: {
                            value: '{colors.primary}',
                        },
                    },
                    disabled: {
                        background: {
                            value: '{colors.on-surface}',
                        },
                        opacity: {
                            value: '12%',
                            type: 'colorOpacity',
                        },
                    },
                },
                'label-text': {
                    enabled: {
                        color: {
                            value: '{colors.on-primary}',
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
                icon: {
                    enabled: {
                        color: {
                            value: '{colors.on-primary}',
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
            },
        },
        tonal: {
            color: {
                container: {
                    enabled: {
                        background: {
                            value: '{colors.secondary-container}',
                        },
                    },
                    disabled: {
                        background: {
                            value: '{colors.on-surface}',
                        },
                        opacity: {
                            value: '12%',
                            type: 'colorOpacity',
                        },
                    },
                },
                'label-text': {
                    enabled: {
                        color: {
                            value: '{colors.on-secondary-container}',
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
                icon: {
                    enabled: {
                        color: {
                            value: '{colors.on-secondary-container}',
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
            },
        },
        text: {
            color: {
                container: {
                    enabled: {
                        background: {
                            value: 'transparent',
                            // TODO: add it in colors tokens
                        },
                    },
                    disabled: {
                        background: {
                            value: 'transparent',
                        },
                        opacity: {
                            value: '12%',
                            type: 'colorOpacity',
                        },
                    },
                },
                'label-text': {
                    enabled: {
                        color: {
                            value: '{colors.primary}',
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
                icon: {
                    enabled: {
                        color: {
                            value: '{colors.primary}',
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
            },
        },
        outlined: {
            color: {
                outline: {
                    enabled: {
                        color: { value: '{colors.neutral-variant.50}' },
                    },
                },
                'label-text': {
                    enabled: {
                        color: {
                            value: '{colors.primary}',
                        },
                    },
                },
                icon: {
                    enabled: {
                        color: {
                            value: '{colors.primary}',
                        },
                    },
                },
            },
        },
    },
}
