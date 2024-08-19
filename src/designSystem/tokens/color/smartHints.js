module.exports = {
    colors: {
        smartHints: {
            cellDefaultBGColor: { value: '{colors.white}' },
            selectedCellBGColor: { value: 'rgb(255, 245, 187)' },
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
        },
    },
}
