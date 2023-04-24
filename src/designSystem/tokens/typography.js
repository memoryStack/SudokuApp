// can't add fontFamily here because tokens generation is at build-time
// and at this time we don't know if it's android, ios or web. so <Text />
// will have to take care of this

module.exports = {
    typography: {
        display: {
            large: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 64,
                    fontSize: 57,
                },
                type: 'typography',
            },
            medium: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 52,
                    fontSize: 45,
                },
                type: 'typography',
            },
            small: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 44,
                    fontSize: 36,
                },
                type: 'typography',
            },
        },
        heading: {
            large: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 40,
                    fontSize: 32,
                },
                type: 'typography',
            },
            medium: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 36,
                    fontSize: 28,
                },
                type: 'typography',
            },
            small: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 32,
                    fontSize: 24,
                },
                type: 'typography',
            },
        },
        title: {
            large: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0,
                    lineHeight: 28,
                    fontSize: 22,
                },
                type: 'typography',
            },
            medium: {
                value: {
                    fontWeight: '500',
                    letterSpacing: 0.15, // test it's effectiveness
                    lineHeight: 24,
                    fontSize: 16,
                },
                type: 'typography',
            },
            small: {
                value: {
                    fontWeight: '500',
                    letterSpacing: 0.1,
                    lineHeight: 20,
                    fontSize: 14,
                },
                type: 'typography',
            },
        },
        body: {
            large: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0.5,
                    lineHeight: 24,
                    fontSize: 16,
                },
                type: 'typography',
            },
            medium: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0.25,
                    lineHeight: 20,
                    fontSize: 14,
                },
                type: 'typography',
            },
            small: {
                value: {
                    fontWeight: '400',
                    letterSpacing: 0.4,
                    lineHeight: 16,
                    fontSize: 12,
                },
                type: 'typography',
            },
        },
        label: {
            large: {
                value: {
                    fontWeight: '600',
                    letterSpacing: 0.1,
                    lineHeight: 24,
                    fontSize: 16,
                },
                type: 'typography',
            },
            medium: {
                value: {
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    lineHeight: 16,
                    fontSize: 12,
                },
                type: 'typography',
            },
            small: {
                value: {
                    fontWeight: '500',
                    letterSpacing: 0.5,
                    lineHeight: 16,
                    fontSize: 11,
                },
                type: 'typography',
            },
        },
    },
}
