import _property from '@lodash/property'

const smartHintColorSystemReader = {
    cellDefaultBGColor: _property('cellDefaultBGColor'),
    selectedCellBGColor: _property('selectedCellBGColor'),
    inhabitableCellCrossColor: _property('inhabitableCellCrossColor'),
    safeNoteColor: _property('safeNoteColor'),
    toBeRemovedNoteColor: _property('toBeRemovedNoteColor'),
    tryOutFilledNumberColor: _property('tryOutFilledNumberColor'),
    removableNoteTryOutNumberInputColor: _property('removableNoteTryOutNumberInputColor'),
    correctTryOutInputMsgColor: _property('correctTryOutInputMsgColor'),
    incorrectTryOutInputMsgColor: _property('incorrectTryOutInputMsgColor'),
    yWingPivotCellBGColor: _property('yWing.pivotCellBGColor'),
    yWingWingCellBGColor: _property('yWing.wingCellBGColor'),
    xWingTopLeftBottomRightCellBGColor: _property('xWing.topLeftBottomRightCellsBGColor'),
    xWingTopRightBottomLeftCellBGColor: _property('xWing.topRightBottomLeftCellsBGColor'),
    xWingFinnCellBGColor: _property('xWing.finnCellBGColor'),
    urTypeThreeNPNotes: _property('ur.typeThree.nakedPairNotes'),
}

export default smartHintColorSystemReader
