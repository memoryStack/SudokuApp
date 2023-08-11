import _property from '@lodash/property'

const smartHintColorSystemReader = {
    cellDefaultBGColor: _property('cellDefaultBGColor'),
    selectedCellBGColor: _property('selectedCellBGColor'),
    inhabitableCellCrossColor: _property('inhabitableCellCrossColor'),
}

export default smartHintColorSystemReader
