import _property from 'lodash/src/utils/property'

/*
    read start cell
    read end cell
    read start note
    read end note
*/

const LinkReader = {
    start: _property('start'),
    startCell: _property('start.cell'),
    startNote: _property('start.note'),
    end: _property('end'),
    endCell: _property('end.cell'),
    endNote: _property('end.note'),
}

export default LinkReader
