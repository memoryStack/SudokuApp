import { URTransformerArgs } from '../../types/uniqueRectangle'

import { TransformedRawHint } from '../../types'

/*
    {
    "UNIQUE_RECTANGLE": {
        "cellAndRemovableNotes": [
            {
                "notes": [
                    8,
                    9
                ],
                "cell": {
                    "col": 1,
                    "row": 1
                }
            }
        ],
        "hostCells": [
            {
                "col": 1,
                "row": 1
            },
            {
                "col": 2,
                "row": 1
            },
            {
                "col": 2,
                "row": 5
            },
            {
                "col": 1,
                "row": 5
            }
        ],
        "type": "UR-1",
        "urNotes": [
            8,
            9
        ],
        "isComposite": false
    }
}

*/

export const transformURTypeThree = ({
    rawHint
}: URTransformerArgs): TransformedRawHint => {
    return {
        type: 'UNIQUE_RECTANGLE',
        hasTryOut: true,
        title: 'UNIQUE_RECTANGLE',
        steps: [{ text: 'bla bla bla', isTryOut: false }],
        // steps: getHintExplanationText(wWing, notesData),
        // cellsToFocusData: getCellsToFocusData(wWing, notesData, smartHintsColorSystem),
        // focusedCells,
        // applyHint: getApplyHintData(wWing),
        // tryOutAnalyserData: {
        //     wWing,
        // },
        // removableNotes: { [wWing.removableNote]: wWing.removableNoteHostCells },
        // inputPanelNumbersVisibility: getTryOutInputPanelNumbersVisibility(wWing.nakedPairNotes) as InputPanelVisibleNumbers,
        // clickableCells: _cloneDeep(focusedCells),
        // unclickableCellClickInTryOutMsg: 'you can only select the cells which are highlighted here.',
    }
}
