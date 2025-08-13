import { useEffect, useRef, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { BAND_DIRECTIONS, ELEMENTS_TYPES } from '../hintsSvgDrawing/svgElementsHandlers/rectangularHighlights';
import _isEqual from '@lodash/isEqual';
import _set from '@lodash/set';
import { isCellExists } from '../utils/util';
import { useDependency } from 'src/hooks/useDependency';
import { fillPuzzleUseCase } from '@application/usecases/board';

NativeModules.KeyEventModule?.registerKeyEventModule();

const ANIMATIONS_TYPE = {
    SVG: 'SVG',
    VIEW: 'VIEW',
    INHABITABLE_CELL: 'INHABITABLE_CELL',
    HABITABLE_CELL_GREEN_TICK: 'HABITABLE_CELL_GREEN_TICK',
    NOTES: 'NOTES',
    NUMBER: 'NUMBER',
    FILL_PUZZLE: 'FILL_PUZZLE',
}

const ACTION = {
    ADD: 'ADD',
    UNDO: 'UNDO',
    DELETE: 'DELETE', // or RESET
}

const ANIMATIONS = [
    // //

    // //  cell notes



    // houses

    // //

    // cell cordinates






    [{
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 0, col: 4 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 }
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 1, col: 1 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 }
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    }],
    [
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.DELETE,
            config: {
                type: ELEMENTS_TYPES.BAND,
                band: { num: 0, direction: BAND_DIRECTIONS.HORIZONTAL },
            }
        },
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.ADD,
            config: {
                type: ELEMENTS_TYPES.BLOCK,
                num: 2
            }
        }
    ],
    [
        {
            type: ANIMATIONS_TYPE.INHABITABLE_CELL,
            action: ACTION.ADD,
            config: {
                cells: [{ row: 0, col: 6 }, { row: 0, col: 8 }, { row: 1, col: 6 }, { row: 1, col: 7 }],
            }
        }
    ],
    [
        {
            type: ANIMATIONS_TYPE.INHABITABLE_CELL,
            action: ACTION.DELETE,
            config: {
                cells: [{ row: 0, col: 6 }, { row: 0, col: 8 }, { row: 1, col: 6 }, { row: 1, col: 7 }],
            }
        },
    ],
    [
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.DELETE,
            config: {
                type: ELEMENTS_TYPES.BLOCK,
                num: 2
            }
        },
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.ADD,
            config: {
                type: ELEMENTS_TYPES.BAND,
                band: { num: 2, direction: BAND_DIRECTIONS.VERTICAL },
            }
        }
    ],
    [
        {
            type: ANIMATIONS_TYPE.VIEW,
            action: ACTION.ADD,
            cell: { row: 5, col: 8 },
            config: {
                'mainNumber': {
                    'fontSize': {
                        config: { toValue: 1.5, duration: 300 }
                    },
                    'textColor': {
                        config: { toValue: 1, duration: 300 },
                        output: ['rgb(12, 25, 22)', '#2653d3']
                    }
                }
            }
        }
    ],
    [
        {
            type: ANIMATIONS_TYPE.INHABITABLE_CELL,
            action: ACTION.ADD,
            config: {
                cells: [{ row: 2, col: 8 }],
            }
        },
    ],
    [
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.DELETE,
            config: {
                type: ELEMENTS_TYPES.BAND,
                band: { num: 2, direction: BAND_DIRECTIONS.VERTICAL },
            }
        },
        {
            type: ANIMATIONS_TYPE.SVG,
            action: ACTION.ADD,
            config: {
                type: ELEMENTS_TYPES.BLOCK,
                num: 2
            }
        },
        {
            type: ANIMATIONS_TYPE.INHABITABLE_CELL,
            action: ACTION.ADD,
            config: {
                cells: [{ row: 0, col: 6 }, { row: 0, col: 8 }, { row: 1, col: 6 }, { row: 1, col: 7 }],
            }
        }
    ],
    [
        {
            type: ANIMATIONS_TYPE.HABITABLE_CELL_GREEN_TICK,
            action: ACTION.ADD,
            config: {
                cells: [{ row: 2, col: 6 }, { row: 2, col: 7 }],
            }
        }
    ],

]

/*
    NOTE: let's not use prev key when prev applied animation was a view animation
        need to think over it more
*/

export const useAnimationConfigs = () => {
    const [currentStep, setCurrentStep] = useState(-1)
    const [svgProps, setSvgProps] = useState([])
    const [cellsAnimationConfigs, setCellsViewAnimationConfig] = useState({})
    const [inhabitableCells, setInhabitableCells] = useState([])
    const [greenTickCells, setGreenTickCells] = useState([])

    const dependencies = useDependency()

    const eventEmitter = useRef(new NativeEventEmitter(NativeModules.KeyEventModule || NativeModules.KeyEventManager))

    const addSvgAnimation = (config) => {
        if (config.action === ACTION.ADD) {
            setSvgProps((currentAnims) => {
                return [
                    ...currentAnims,
                    config.config
                ]
            })
        }
        if (config.action === ACTION.DELETE) {
            setSvgProps((currentAnims) => {
                const animToDelete = config.config
                return currentAnims.filter((currentConfig) => {
                    return !_isEqual(currentConfig, animToDelete)
                })
            })
        }
    }

    const addViewAnimation = (config) => {
        if (config.action === ACTION.ADD) {
            const cell = config.cell
            const animConfig = config.config
            setCellsViewAnimationConfig((prevConfig) => {
                const newConfig = { ...prevConfig }
                _set(newConfig, [cell.row, cell.col], animConfig)
                return newConfig
            })
        }
    }

    const addInhabitableCellAnimation = (config) => {
        const handler = config.type === ANIMATIONS_TYPE.INHABITABLE_CELL ? setInhabitableCells : setGreenTickCells
        if (config.action === ACTION.ADD) {
            const cells = config.config.cells
            handler((prevConfig) => {
                return [
                    ...prevConfig,
                    ...cells
                ]
            })
        }
        if (config.action === ACTION.DELETE) {
            handler((prevCells) => {
                const cellsToRemove = config.config.cells
                return prevCells.filter((prevCell) => {
                    return !isCellExists(prevCell, cellsToRemove)
                })
            })
        }
    }

    const addNotesAnimation = (config) => {
        const { boardRepository } = dependencies

        if (config.action === ACTION.ADD) {
            const { cell, notes } = config
            boardRepository.setNotesBunch(notes.map((note) => {
                return { cell, note }
            }))
        }
        if (config.action === ACTION.DELETE) {
            const { cell, notes } = config
            boardRepository.eraseNotesBunch(notes.map((note) => {
                return { cell, note }
            }))
        }
    }

    const addNumberAnimation = (config) => {
        const { boardRepository } = dependencies
        if (config.action === ACTION.ADD) {
            const { cell, number } = config.config
            boardRepository.setCellMainNumber({ cell, number })
        }
        if (config.action === ACTION.DELETE) {
            const { cell, number } = config.config
            boardRepository.setCellMainNumber({ cell, number: 0 })
        }
    }

    const fillPuzzleAnimation = (config) => {
        const { boardRepository } = dependencies
        if (config.action === ACTION.ADD) {
            fillPuzzleUseCase(boardRepository)
        }
        if (config.action === ACTION.DELETE) {
            // Board.getEmptyCellsAndTheirSolution(boardRepository.getMainNumbers())
            // .forEach(({ cell, solution }) => {
            //     boardRepository.setCellMainNumber({
            //         cell,
            //         number: solution,
            //     })
            // })
        }
    }

    const removeSvgAnimation = () => {
        setSvgProps((existing) => {
            const newState = [...existing]
            newState.pop()
            return newState
        })
    }

    const removeViewAnimation = () => {

    }

    const removeInhabitableCellAnimation = (config) => {
        // if (config.action === ACTION.ADD) {
        //     const cells = config.cells
        //     setInhabitableCells((prevConfig) => {
        //         return [
        //             ...prevConfig,
        //             ...cells
        //         ]
        //     })
        // }
    }

    useEffect(() => {
        const keyboardListener = eventEmitter?.current?.addListener('onKeyDown', (event) => {
            console.log('@@@@@@@@  Key pressed:', event.keyCode, event.key, currentStep);
            const nextStepNum = event.keyCode === 22 ? currentStep + 1 : currentStep - 1
            if (nextStepNum < -1 || nextStepNum >= ANIMATIONS.length) return
            if (event.keyCode === 22) {
                const nextConfigs = ANIMATIONS[nextStepNum]
                nextConfigs.forEach((nextConfig) => {
                    if (nextConfig.type === ANIMATIONS_TYPE.SVG) addSvgAnimation(nextConfig)
                    else if (nextConfig.type === ANIMATIONS_TYPE.VIEW) addViewAnimation(nextConfig)
                    else if (nextConfig.type === ANIMATIONS_TYPE.INHABITABLE_CELL || nextConfig.type === ANIMATIONS_TYPE.HABITABLE_CELL_GREEN_TICK) addInhabitableCellAnimation(nextConfig)
                    else if (nextConfig.type === ANIMATIONS_TYPE.NOTES) addNotesAnimation(nextConfig)
                    else if (nextConfig.type === ANIMATIONS_TYPE.NUMBER) addNumberAnimation(nextConfig)
                    else if (nextConfig.type === ANIMATIONS_TYPE.FILL_PUZZLE) fillPuzzleAnimation(nextConfig)
                })
            } else {
                const latestAppliedAnimation = ANIMATIONS[currentStep]
                if (latestAppliedAnimation.type === ANIMATIONS_TYPE.SVG) removeSvgAnimation()
                else if (latestAppliedAnimation.type === ANIMATIONS_TYPE.VIEW) removeViewAnimation()
                else removeInhabitableCellAnimation()
            }
            setCurrentStep(nextStepNum)
        });

        return () => {
            keyboardListener?.remove();
        }
    }, [currentStep])

    return {
        // currentAnimNum,
        svgProps,
        cellsAnimationConfigs,
        inhabitableCells,
        greenTickCells
    }
}

/*
    const ANIMATIONS = [

    [{
        type: ANIMATIONS_TYPE.SVG,
        action: ACTION.ADD,
        config: {
            type: ELEMENTS_TYPES.BLOCK,
            num: 0,
        }
    }],
    [{
        type: ANIMATIONS_TYPE.SVG,
        action: ACTION.DELETE,
        config: {
            type: ELEMENTS_TYPES.BLOCK,
            num: 0,
        }
    },
    {
        type: ANIMATIONS_TYPE.SVG,
        action: ACTION.ADD,
        config: {
            type: ELEMENTS_TYPES.CELL,
            cell: { row: 2, col: 0 }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.NUMBER,
        action: ACTION.ADD,
        config: {
            type: ELEMENTS_TYPES.CELL,
            cell: { row: 2, col: 0 },
            number: 1
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 2, col: 0 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.3, duration: 300 },

                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3'],
                }
            }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.SVG,
        action: ACTION.DELETE,
        config: {
            type: ELEMENTS_TYPES.CELL,
            cell: { row: 2, col: 0 }
        }
    },
    {
        type: ANIMATIONS_TYPE.NUMBER,
        action: ACTION.DELETE,
        config: {
            type: ELEMENTS_TYPES.CELL,
            cell: { row: 2, col: 0 },
            number: 1
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.DELETE,
        cell: { row: 2, col: 0 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.3, duration: 300 },
                    resetToPrevious: true
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    resetToPrevious: true,
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 8, col: 1 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 }
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 5, col: 2 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 }
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.INHABITABLE_CELL,
        action: ACTION.ADD,
        config: {
            cells: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }],
        }
    }],
    [{
        type: ANIMATIONS_TYPE.HABITABLE_CELL_GREEN_TICK,
        action: ACTION.ADD,
        config: {
            cells: [{ row: 1, col: 0 }, { row: 2, col: 0 }],
        }
    }],
    // {
    //     type: ANIMATIONS_TYPE.INHABITABLE_CELL,
    //     action: ACTION.DELETE,
    //     config: {
    //         cells: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }],
    //     }
    // },
    // {
    //     type: ANIMATIONS_TYPE.VIEW,
    //     action: ACTION.ADD,
    //     cell: { row: 8, col: 1 },
    //     config: {
    //         'mainNumber': {
    //             'fontSize': {
    //                 config: {},
    //                 resetToPrevious: true,
    //             },
    //             'textColor': {
    //                 config: {},
    //                 resetToPrevious: true,
    //             }
    //         }
    //     }
    // },
    // {
    //     type: ANIMATIONS_TYPE.VIEW,
    //     action: ACTION.ADD,
    //     cell: { row: 5, col: 2 },
    //     config: {
    //         'mainNumber': {
    //             'fontSize': {
    //                 config: {},
    //                 resetToPrevious: true,
    //             },
    //             'textColor': {
    //                 config: {},
    //                 resetToPrevious: true,
    //             }
    //         }
    //     }
    // },
    [{
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 1, col: 3 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 }
                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3']
                }
            }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.HABITABLE_CELL_GREEN_TICK,
        action: ACTION.DELETE,
        config: {
            cells: [{ row: 1, col: 0 }],
        }
    },
    {
        type: ANIMATIONS_TYPE.INHABITABLE_CELL,
        action: ACTION.ADD,
        config: {
            cells: [{ row: 1, col: 0 }],
        }
    }],
    [{
        type: ANIMATIONS_TYPE.INHABITABLE_CELL,
        action: ACTION.DELETE,
        config: {
            cells: [{ row: 1, col: 0 }, { row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }],
        }
    },
    {
        type: ANIMATIONS_TYPE.HABITABLE_CELL_GREEN_TICK,
        action: ACTION.DELETE,
        config: {
            cells: [{ row: 2, col: 0 }],
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 8, col: 1 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 },
                    resetToPrevious: true

                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3'],
                    resetToPrevious: true
                }
            }
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 5, col: 2 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 },
                    resetToPrevious: true

                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3'],
                    resetToPrevious: true
                }
            }
        }
    },
    {
        type: ANIMATIONS_TYPE.VIEW,
        action: ACTION.ADD,
        cell: { row: 1, col: 3 },
        config: {
            'mainNumber': {
                'fontSize': {
                    config: { toValue: 1.5, duration: 300 },
                    resetToPrevious: true

                },
                'textColor': {
                    config: { toValue: 1, duration: 300 },
                    output: ['rgb(12, 25, 22)', '#2653d3'],
                    resetToPrevious: true
                }
            }
        }
    }],
    [{
        type: ANIMATIONS_TYPE.NOTES,
        action: ACTION.ADD,
        cell: { row: 2, col: 0 },
        notes: [1, 2, 3, 4, 8]
    }],
    // {
    //     type: ANIMATIONS_TYPE.NOTES,
    //     action: ACTION.DELETE,
    //     cell: { row: 2, col: 0 },
    //     notes: [1, 2, 3, 4, 8]
    // },
]
*/