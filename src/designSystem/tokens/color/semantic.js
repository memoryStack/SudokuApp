// light theme
module.exports = {
    colors: {
        primary: {
            value: '{colors.primary.40}',
        },
        'primary-container': {
            value: '{colors.primary.90}',
        },
        'on-primary': {
            value: '{colors.primary.100}',
        },
        'on-primary-container': {
            value: '{colors.primary.10}',
        },
        'inverse-primary': {
            value: '{colors.primary.80}',
        },
        secondary: {
            value: '{colors.secondary.40}',
        },
        'secondary-container': {
            value: '{colors.secondary.90}',
        },
        'on-secondary': {
            value: '{colors.secondary.100}',
        },
        'on-secondary-container': {
            value: '{colors.secondary.10}',
        },
        tertiary: {
            value: '{colors.tertiary.40}',
        },
        'tertiary-container': {
            value: '{colors.tertiary.90}',
        },
        'on-tertiary': {
            value: '{colors.tertiary.100}',
        },
        'on-tertiary-container': {
            value: '{colors.tertiary.10}',
        },
        surface: {
            // value: '{colors.neutral.98}',
            value: '{colors.white}'
        },
        'surface-dim': {
            value: '{colors.neutral.87}',
        },
        'surface-bright': {
            value: '{colors.neutral.98}',
        },
        'surface-container-lowest': {
            value: '{colors.neutral.100}',
        },
        'surface-container-low': {
            value: '{colors.neutral.96}',
        },
        'surface-container': {
            value: '{colors.neutral.94}',
        },
        'surface-container-high': {
            value: '{colors.neutral.92}',
        },
        'surface-container-highest': {
            value: '{colors.neutral.90}',
        },
        'surface-variant': {
            value: '{colors.neutral-variant.90}',
        },
        'on-surface': {
            value: '{colors.neutral.10}',
        },
        'on-surface-variant': {
            value: '{colors.neutral-variant.30}',
        },
        'on-surface-variant-low': {
            value: '{colors.neutral-variant.50}',
        },
        'inverse-surface': {
            value: '{colors.neutral.20}',
        },
        'inverse-on-surface': {
            value: '{colors.neutral.95}',
        },
        background: {
            value: '{colors.neutral.98}',
        },
        'on-background': {
            value: '{colors.neutral.10}',
        },
        outline: {
            value: '{colors.neutral-variant.50}',
        },
        'outline-variant': {
            value: '{colors.neutral-variant.80}',
        },
        shadow: {
            value: '{colors.neutral.0}',
        },
        'surface-tint-color': {
            value: '{colors.primary}',
        },
        scrim: {
            value: '{colors.neutral.0}',
        },
        error: {
            value: '{colors.error.40}',
        },
        'on-error': {
            value: '{colors.error.100}',
        },
        'error-container': {
            value: '{colors.error.90}',
        },
        'on-error-container': {
            value: '{colors.error.10}',
        },
        success: {
            value: '{colors.success.40}',
        },
        'on-success': {
            value: '{colors.success.100}',
        },
        'success-container': {
            value: '{colors.success.80}',
        },
        'on-success-container': {
            value: '{colors.success.10}',
        },
        // below tokens doesn't belong in semantics, keeping it here until i learn overriding 
        // based on theming in style dictionary
        board: {
            selectedCellBGColor: {
                value: '{colors.yellow.95}'
            },
            clueNumColor: {
                value: '{colors.on-surface}'
            },
            userFilledNumColor: {
                value: '{colors.primary}'
            },
            mistakeCellBGColor: {
                value: '{colors.error-container}'
            },
            wronglyFilledNumColor: {
                value: '{colors.on-error-container}'
            },
            defaultCellBGColor: {
                value: '{colors.surface}'
            },
            diffHouseSameValueBGColor: {
                value: '{colors.primary-container}'
            },
            sameHouseCellBGColor: {
                value: '{colors.surface-container-high}'
            }
        },
        smartHints: {
            cellDefaultBGColor: { value: '{colors.white}' },
            selectedCellBGColor: { value: '{colors.yellow.95}' },
            inhabitableCellCrossColor: { value: '{colors.error}' },
            // normal colors.success and colors.red are too dark
            // for very small fonts like notes
            safeNoteColor: { value: '{colors.success.60}' },
            toBeRemovedNoteColor: { value: '{colors.error.60}' },
            tryOutFilledNumberColor: { value: '{colors.primary}' },
            removableNoteTryOutNumberInputColor: { value: '{colors.error}' },
            correctTryOutInputMsgColor: { value: '{colors.success}' },
            incorrectTryOutInputMsgColor: { value: '{colors.error}' },
            yWing: {
                pivotCellBGColor: { value: '#ecdcff' },
                wingCellBGColor: { value: '#ffdea1' },
            },
            xWing: {
                topLeftBottomRightCellsBGColor: { value: '#ffdcc6' },
                topRightBottomLeftCellsBGColor: { value: '#c8e6ff' },
                finnCellBGColor: { value: '#e9ddff' },
            },
            ur: {
                typeThree: {
                    nakedPairNotes: { value: '#4B61D1' }
                }
            }
        }
    },
}

// dark theme
// module.exports = {
//     colors: {
//         primary: {
//             value: '{colors.primary.80}',
//         },
//         'primary-container': {
//             value: '{colors.primary.30}',
//         },
//         'on-primary': {
//             value: '{colors.primary.20}',
//         },
//         'on-primary-container': {
//             value: '{colors.primary.90}',
//         },
//         'inverse-primary': {
//             value: '{colors.primary.40}',
//         },
//         secondary: {
//             value: '{colors.secondary.80}',
//         },
//         'secondary-container': {
//             value: '{colors.secondary.30}',
//         },
//         'on-secondary': {
//             value: '{colors.secondary.20}',
//         },
//         'on-secondary-container': {
//             value: '{colors.secondary.90}',
//         },
//         tertiary: {
//             value: '{colors.tertiary.80}',
//         },
//         'tertiary-container': {
//             value: '{colors.tertiary.30}',
//         },
//         'on-tertiary': {
//             value: '{colors.tertiary.20}',
//         },
//         'on-tertiary-container': {
//             value: '{colors.tertiary.90}',
//         },
//         surface: {
//             value: '{colors.neutral.6}',
//         },
//         'surface-dim': {
//             value: '{colors.neutral.6}',
//         },
//         'surface-bright': {
//             value: '{colors.neutral.24}',
//         },
//         'surface-container-lowest': {
//             value: '{colors.neutral.4}',
//         },
//         'surface-container-low': {
//             value: '{colors.neutral.10}',
//         },
//         'surface-container': {
//             value: '{colors.neutral.12}',
//         },
//         'surface-container-high': {
//             value: '{colors.neutral.17}',
//         },
//         'surface-container-highest': {
//             value: '{colors.neutral.22}',
//         },
//         'surface-variant': {
//             value: '{colors.neutral-variant.30}',
//         },
//         'on-surface': {
//             value: '{colors.neutral.90}',
//         },
//         'on-surface-variant': {
//             value: '{colors.neutral-variant.80}',
//         },
//         'on-surface-variant-low': {
//             value: '{colors.neutral-variant.50}',
//         },
//         'inverse-surface': {
//             value: '{colors.neutral.90}',
//         },
//         'inverse-on-surface': {
//             value: '{colors.neutral.20}',
//         },
//         background: {
//             value: '{colors.neutral.6}',
//         },
//         'on-background': {
//             value: '{colors.neutral.90}',
//         },
//         outline: {
//             value: '{colors.neutral-variant.60}',
//         },
//         'outline-variant': {
//             value: '{colors.neutral-variant.30}',
//         },
//         shadow: {
//             value: '{colors.neutral.0}',
//         },
//         'surface-tint-color': {
//             value: '{colors.primary}',
//         },
//         scrim: {
//             value: '{colors.neutral.0}',
//         },
//         error: {
//             value: '{colors.error.80}',
//         },
//         'on-error': {
//             value: '{colors.error.20}',
//         },
//         'error-container': {
//             value: '{colors.error.30}',
//         },
//         'on-error-container': {
//             value: '{colors.error.90}',
//         },
//         success: {
//             value: '{colors.success.80}',
//         },
//         'on-success': {
//             value: '{colors.success.20}',
//         },
//         'success-container': {
//             value: '{colors.success.30}',
//         },
//         'on-success-container': {
//             value: '{colors.success.90}',
//         },
//         board: {
//             selectedCellBGColor: {
//                 value: '{colors.yellow.50}'
//             },
//             clueNumColor: {
//                 value: '{colors.on-surface}'
//             },
//             userFilledNumColor: {
//                 value: '{colors.primary}'
//             },
//             mistakeCellBGColor: {
//                 value: '{colors.error-container}'
//             },
//             wronglyFilledNumColor: {
//                 value: '{colors.on-error-container}'
//             },
//             defaultCellBGColor: {
//                 value: '{colors.surface}'
//             },
//             diffHouseSameValueBGColor: {
//                 value: '{colors.primary-container}'
//             },
//             sameHouseCellBGColor: {
//                 value: '{colors.surface-variant}'
//             }
//         },
//         smartHints: {
//             cellDefaultBGColor: { value: '{colors.surface-variant}' },
//             selectedCellBGColor: { value: '{colors.yellow.50}' },
//             inhabitableCellCrossColor: { value: '{colors.error.70}' },
//             // normal colors.success and colors.red are too dark
//             // for very small fonts like notes
//             safeNoteColor: { value: '{colors.success.60}' },
//             toBeRemovedNoteColor: { value: '{colors.error.60}' },
//             tryOutFilledNumberColor: { value: '{colors.primary}' },
//             removableNoteTryOutNumberInputColor: { value: '{colors.error}' },
//             correctTryOutInputMsgColor: { value: '{colors.success}' },
//             incorrectTryOutInputMsgColor: { value: '{colors.error}' },
//             yWing: {
//                 pivotCellBGColor: { value: '#ecdcff' },
//                 wingCellBGColor: { value: '#ffdea1' },
//             },
//             xWing: {
//                 topLeftBottomRightCellsBGColor: {
//                     value: '#824d00ff'
//                 },
//                 topRightBottomLeftCellsBGColor: {
//                     value: '#044089ff'
//                 },
//                 finnCellBGColor: {
//                     value: '#755470'
//                 },
//             },
//             ur: {
//                 typeThree: {
//                     nakedPairNotes: { value: '#4B61D1' }
//                 }
//             }
//         }
//     },
// }
