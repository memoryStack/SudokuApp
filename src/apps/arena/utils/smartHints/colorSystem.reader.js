import _property from '@lodash/property'

const smartHintColorSystemReader = {
    cellDefaultBGColor: _property('cellDefaultBGColor'),
    selectedCellBGColor: _property('selectedCellBGColor'),
    inhabitableCellCrossColor: _property('inhabitableCellCrossColor'),
    safeNoteColor: _property('safeNoteColor'),
    toBeRemovedNoteColor: _property('toBeRemovedNoteColor'),
    tryOutFilledNumberColor: _property('tryOutFilledNumberColor'),
    correctTryOutInputMsgColor: _property('correctTryOutInputMsgColor'),
    incorrectTryOutInputMsgColor: _property('incorrectTryOutInputMsgColor'),
}

export default smartHintColorSystemReader