
type Color = string

enum ColorNames {
    "primary",
    "secondary",
    "tertiary",
    "error",
    "success",
    "primary-container",
    "on-primary",
    "on-primary-container",
    "inverse-primary",
    "secondary-container",
    "on-secondary",
    "on-secondary-container",
    "tertiary-container",
    "on-tertiary",
    "on-tertiary-container",
    "surface",
    "surface-dim",
    "surface-bright",
    "surface-container-lowest",
    "surface-container-low",
    "surface-container",
    "surface-container-high",
    "surface-container-highest",
    "surface-variant",
    "on-surface",
    "on-surface-variant",
    "on-surface-variant-low",
    "inverse-surface",
    "inverse-on-surface",
    "background",
    "on-background",
    "outline",
    "outline-variant",
    "shadow",
    "scrim",
    "surface-tint-color",
    "on-error",
    "on-success",
    "error-container",
    "success-container",
    "on-error-container",
    "on-success-container",
    "internal-background",
    "internal-on-background"
}

export type SmartHintColorSystem = {
    cellDefaultBGColor: Color,
    selectedCellBGColor: Color,
    inhabitableCellCrossColor: Color,
    safeNoteColor: Color,
    toBeRemovedNoteColor: Color,
    tryOutFilledNumberColor: Color,
    removableNoteTryOutNumberInputColor: Color,
    correctTryOutInputMsgColor: Color,
    incorrectTryOutInputMsgColor: Color,
    yWing: {
        pivotCellBGColor: Color,
        wingCellBGColor: Color
    },
    xWing: {
        topLeftBottomRightCellsBGColor: Color,
        topRightBottomLeftCellsBGColor: Color,
        finnCellBGColor: Color
    },
    ur: {
        typeThree: {
            nakedPairNotes: Color
        }
    }
}

export type Theme = {
    colors: {
        [key in ColorNames]: Color
    } & {
        smartHints: SmartHintColorSystem
    }
}
