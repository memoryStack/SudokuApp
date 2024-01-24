const PUZZLE_VS_RAW_HINTS = {
    '900008000000004027061027000095000004080010090600000780000850140850600000000300002': {
        "X_WING": { "type": "FINNED", "legs": [{ "cells": [{ "col": 3, "row": 3 }, { "col": 3, "row": 4 }, { "col": 3, "row": 5 }], "type": "FINNED", "candidate": 2 }, { "cells": [{ "col": 6, "row": 3 }, { "col": 6, "row": 4 }], "type": "PERFECT", "candidate": 2 }], "houseType": "col" },
        "HIDDEN_TRIPPLE": { "groupCells": [{ "col": 1, "row": 0 }, { "col": 2, "row": 0 }, { "col": 0, "row": 2 }], "groupCandidates": [7, 4, 2], "house": { "num": 0, "type": "block" } },
        "NAKED_TRIPPLE": { "groupCells": [{ "col": 3, "row": 2 }, { "col": 3, "row": 1 }, { "col": 3, "row": 0 }] },
        "NAKED_DOUBLE": { "groupCells": [{ "col": 8, "row": 7 }, { "col": 6, "row": 7 }] },
        "HIDDEN_DOUBLE": { "groupCells": [{ "col": 1, "row": 0 }, { "col": 2, "row": 0 }], "groupCandidates": [7, 2], "house": { "num": 0, "type": "block" } },
        "OMISSION": { "hostCells": [{ "col": 4, "row": 0 }, { "col": 4, "row": 1 }], "note": 3, "removableNotesHostHouse": { "num": 4, "type": "col" }, "hostHouse": { "num": 1, "type": "block" } },
        "X_CHAIN": { "removableNotesHostCells": [{ "col": 2, "row": 7 }], "chain": [{ "col": 7, "row": 7 }, { "col": 7, "row": 8 }, { "col": 4, "row": 8 }, { "col": 4, "row": 7 }], "note": 7 },
        "HIDDEN_SINGLE": { "cell": { "col": 2, "row": 1 }, "type": "block", "mainNumber": 8 },
        "NAKED_SINGLE": { "cell": { "col": 1, "row": 1 }, "type": "mix", "mainNumber": 3 }
    },
    '040300800360007041805200300400090008096578420700020006002004507930700012007002030': {
        "XY_CHAIN": { "removableNotesHostCells": [{ "col": 5, "row": 3 }, { "col": 2, "row": 5 }], "chain": [{ "col": 2, "row": 3 }, { "col": 6, "row": 3 }, { "col": 7, "row": 3 }, { "col": 7, "row": 5 }, { "col": 6, "row": 5 }, { "col": 5, "row": 5 }], "note": 3 },
        "X_WING": { "type": "PERFECT", "legs": [{ "cells": [{ "col": 1, "row": 3 }, { "col": 7, "row": 3 }], "type": "PERFECT", "candidate": 5 }, { "cells": [{ "col": 1, "row": 5 }, { "col": 7, "row": 5 }], "type": "PERFECT", "candidate": 5 }], "houseType": "row" },
        "HIDDEN_TRIPPLE": { "groupCells": [{ "col": 7, "row": 0 }, { "col": 7, "row": 2 }, { "col": 8, "row": 0 }], "groupCandidates": [7, 6, 5], "house": { "num": 2, "type": "block" } },
        "HIDDEN_DOUBLE": { "groupCells": [{ "col": 7, "row": 0 }, { "col": 7, "row": 2 }], "groupCandidates": [7, 6], "house": { "num": 2, "type": "block" } },
        "OMISSION": { "hostCells": [{ "col": 7, "row": 0 }, { "col": 7, "row": 2 }], "note": 6, "removableNotesHostHouse": { "num": 7, "type": "col" }, "hostHouse": { "num": 2, "type": "block" } },
        "HIDDEN_SINGLE": { "cell": { "col": 0, "row": 0 }, "type": "block", "mainNumber": 2 },
        "NAKED_TRIPPLE": { "groupCells": [{ "col": 5, "row": 5 }, { "col": 5, "row": 3 }, { "col": 3, "row": 3 }] },
        "NAKED_SINGLE": { "cell": { "col": 2, "row": 1 }, "type": "mix", "mainNumber": 9 }
    },
    '409300781320700409700000000600050000050871040000040002000000008506007094178004506': {
        "HIDDEN_TRIPPLE": { "groupCells": [{ "col": 0, "row": 6 }, { "col": 1, "row": 6 }, { "col": 2, "row": 6 }], "groupCandidates": [9, 4, 2], "house": { "num": 6, "type": "block" } },
        "NAKED_TRIPPLE": { "groupCells": [{ "col": 7, "row": 8 }, { "col": 6, "row": 7 }, { "col": 6, "row": 6 }] },
        "NAKED_DOUBLE": { "groupCells": [{ "col": 2, "row": 2 }, { "col": 2, "row": 1 }] },
        "OMISSION": { "hostCells": [{ "col": 6, "row": 2 }, { "col": 7, "row": 2 }], "note": 2, "removableNotesHostHouse": { "num": 2, "type": "row" }, "hostHouse": { "num": 2, "type": "block" } },
        "X_CHAIN": { "removableNotesHostCells": [{ "col": 3, "row": 2 }], "chain": [{ "col": 4, "row": 0 }, { "col": 5, "row": 0 }, { "col": 5, "row": 3 }, { "col": 3, "row": 3 }], "note": 2 },
        "HIDDEN_SINGLE": { "cell": { "col": 5, "row": 0 }, "type": "row", "mainNumber": 5 },
        "NAKED_SINGLE": { "cell": { "col": 1, "row": 0 }, "type": "mix", "mainNumber": 6 }
    },
    '000100308090080020300006197200070000079538240000040009964700005010050060805004000': {
        "X_WING": {
            "type": "INVALID",
            "legs": [
                { "cells": [{ "col": 3, "row": 1 }, { "col": 3, "row": 2 }], "type": "PERFECT", "candidate": 4 },
                { "cells": [{ "col": 0, "row": 0 }, { "col": 0, "row": 1 }, { "col": 0, "row": 2 }], "type": "INVALID", "candidate": 4 }
            ],
            "houseType": "col"
        },
        "OMISSION": {
            "hostCells": [{ "col": 6, "row": 1 }, { "col": 8, "row": 1 }],
            "note": 4,
            "removableNotesHostHouse": { "num": 1, "type": "row" },
            "hostHouse": { "num": 2, "type": "block" }
        },
        "HIDDEN_DOUBLE": {
            "groupCells": [{ "col": 5, "row": 0 }, { "col": 5, "row": 1 }],
            "groupCandidates": [7, 5],
            "house": { "num": 1, "type": "block" }
        },
        "HIDDEN_TRIPPLE": {
            "groupCells": [{ "col": 5, "row": 0 }, { "col": 5, "row": 1 }, { "col": 3, "row": 1 }],
            "groupCandidates": [7, 5, 3],
            "house": { "num": 1, "type": "block" }
        },
        "X_CHAIN": {
            "removableNotesHostCells": [{ "col": 3, "row": 7 }, { "col": 3, "row": 8 }],
            "chain": [{ "col": 3, "row": 5 }, { "col": 5, "row": 5 }, { "col": 5, "row": 6 }, { "col": 4, "row": 6 }],
            "note": 2
        },
        "HIDDEN_SINGLE": {
            "cell": { "col": 1, "row": 2 },
            "type": "row",
            "mainNumber": 5
        },
        "NAKED_SINGLE": {
            "cell": { "col": 7, "row": 0 },
            "type": "mix",
            "mainNumber": 5
        }
    },
    '080023400620409508410085020040906082068542000290038654154267893872394165936851247': {
        "XY_CHAIN": { "removableNotesHostCells": [{ "col": 2, "row": 1 }], "chain": [{ "col": 4, "row": 1 }, { "col": 4, "row": 3 }, { "col": 3, "row": 5 }, { "col": 2, "row": 5 }], "note": 7 },
        "X_CHAIN": { "removableNotesHostCells": [{ "col": 2, "row": 3 }], "chain": [{ "col": 2, "row": 2 }, { "col": 6, "row": 2 }, { "col": 7, "row": 1 }, { "col": 7, "row": 4 }, { "col": 0, "row": 4 }, { "col": 0, "row": 3 }], "note": 3 },
        "REMOTE_PAIRS": { "removableNotesHostCells": [{ "col": 2, "row": 1 }], "orderedChainCells": [{ "col": 4, "row": 1 }, { "col": 4, "row": 3 }, { "col": 3, "row": 5 }, { "col": 2, "row": 5 }], "remotePairNotes": [1, 7] },
        "OMISSION": { "hostCells": [{ "col": 2, "row": 1 }, { "col": 2, "row": 2 }], "note": 3, "removableNotesHostHouse": { "num": 2, "type": "col" }, "hostHouse": { "num": 0, "type": "block" } }
    },
    '900060401060340000000085200800576010070010090010892006009720000000034050103050008': {
        "X_WING": {
            "type": "INVALID",
            "legs": [
                { "cells": [{ "col": 1, "row": 8 }, { "col": 7, "row": 8 }], "type": "PERFECT", "candidate": 4 },
                { "cells": [{ "col": 0, "row": 5 }, { "col": 1, "row": 5 }, { "col": 2, "row": 5 }, { "col": 7, "row": 5 }], "type": "INVALID", "candidate": 4 }
            ],
            "houseType": "row"
        },
        "OMISSION": {
            "hostCells": [{ "col": 6, "row": 1 }, { "col": 8, "row": 1 }],
            "note": 5,
            "removableNotesHostHouse": { "num": 1, "type": "row" },
            "hostHouse": { "num": 2, "type": "block" }
        },
        "HIDDEN_DOUBLE": {
            "groupCells": [{ "col": 5, "row": 1 }, { "col": 3, "row": 2 }],
            "groupCandidates": [9, 1],
            "house": { "num": 1, "type": "block" }
        },
        "HIDDEN_TRIPPLE": {
            "groupCells": [{ "col": 1, "row": 0 }, { "col": 2, "row": 0 }, { "col": 7, "row": 0 }],
            "groupCandidates": [8, 5, 3],
            "house": { "num": 0, "type": "row" }
        },
        "X_CHAIN": {
            "removableNotesHostCells": [{ "col": 0, "row": 1 }],
            "chain": [{ "col": 2, "row": 0 }, { "col": 1, "row": 0 }, { "col": 1, "row": 6 }, { "col": 0, "row": 6 }],
            "note": 5
        },
        "HIDDEN_SINGLE": {
            "cell": { "col": 7, "row": 2 },
            "type": "block",
            "mainNumber": 6
        },
        "NAKED_SINGLE": {
            "cell": { "col": 3, "row": 0 },
            "type": "mix",
            "mainNumber": 2
        }
    },
    '000590034002340000700600002060000007820030065300000020900001003000073900470086000': {
        "X_WING": {
            "type": "FINNED",
            "legs": [
                { "cells": [{ "col": 3, "row": 6 }, { "col": 4, "row": 6 }, { "col": 6, "row": 6 }], "type": "FINNED", "candidate": 2 },
                { "cells": [{ "col": 3, "row": 8 }, { "col": 6, "row": 8 }], "type": "PERFECT", "candidate": 2 }
            ],
            "houseType": "row"
        },
        "HIDDEN_TRIPPLE": {
            "groupCells": [{ "col": 1, "row": 1 }, { "col": 1, "row": 2 }, { "col": 2, "row": 2 }],
            "groupCandidates": [9, 4, 3],
            "house": { "num": 0, "type": "block" }
        },
        "NAKED_TRIPPLE": {
            "groupCells": [{ "col": 2, "row": 0 }, { "col": 1, "row": 0 }, { "col": 0, "row": 0 }]
        },
        "NAKED_DOUBLE": {
            "groupCells": [{ "col": 3, "row": 7 }, { "col": 3, "row": 6 }]
        },
        "HIDDEN_DOUBLE": {
            "groupCells": [{ "col": 1, "row": 2 }, { "col": 2, "row": 2 }],
            "groupCandidates": [4, 3],
            "house": { "num": 0, "type": "block" }
        },
        "OMISSION": {
            "hostCells": [{ "col": 5, "row": 0 }, { "col": 5, "row": 1 }],
            "note": 7,
            "removableNotesHostHouse": { "num": 5, "type": "col" },
            "hostHouse": { "num": 1, "type": "block" }
        },
        "X_CHAIN": {
            "removableNotesHostCells": [{ "col": 5, "row": 4 }],
            "chain": [{ "col": 2, "row": 4 }, { "col": 2, "row": 5 }, { "col": 3, "row": 5 }, { "col": 3, "row": 4 }],
            "note": 7
        },
        "HIDDEN_SINGLE": {
            "cell": { "col": 5, "row": 0 },
            "type": "block",
            "mainNumber": 2
        },
        "NAKED_SINGLE": {
            "cell": { "col": 4, "row": 2 },
            "type": "mix",
            "mainNumber": 1
        }
    }
}

const RNSudokuPuzzle = {}

RNSudokuPuzzle.getRawHints = async (puzzle) => {
    return PUZZLE_VS_RAW_HINTS[puzzle]
}

export { RNSudokuPuzzle }
