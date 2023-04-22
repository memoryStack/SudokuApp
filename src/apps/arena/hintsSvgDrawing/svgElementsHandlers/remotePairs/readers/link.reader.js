import _property from '@lodash/property'

const LinkReader = {
    start: _property('start'),
    startCell: _property('start.cell'),
    startNote: _property('start.note'),
    end: _property('end'),
    endCell: _property('end.cell'),
    endNote: _property('end.note'),
}

export default LinkReader
