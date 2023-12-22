import React from 'react'

import SmartHintText from '@ui/molecules/SmartHintText'

const Candidate = () => {
    const a = 10
    return (
        <SmartHintText
            text={
                '<p>A Candidate in Sudoku is a digit that could be placed into a <a href="cell">cell</a>, but you\'re not'
                + ' totally sure it goes in that cell yet. Some people call this "pencil marking", since many solvers'
                + ' write small numbers or other notes in pencil to denote a possible solution.</p>'
            }
        />

    // render a board here and demonstrate that

    )
}

export default React.memo(Candidate)
