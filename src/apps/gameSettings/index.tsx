import React, {
    useEffect, useMemo,
    useRef,
    useState,
} from 'react'
import { View, ScrollView } from 'react-native'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { Page } from '../components/Page'
import { Switch } from 'react-native-paper'; // TODO: import it from UI folder
import { Dropdown } from 'react-native-paper-dropdown';
import { Snackbar } from 'react-native-paper';

import _get from '@lodash/get'
import { getStyles } from './gameSettings.styles'
import { GAME_SETTINGS_KEYS, AllGameSettingsValues } from '@interfaces/gameSettingsAdapter'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import Divider from '@ui/atoms/Divider'
import { useDependency } from 'src/hooks/useDependency'
import _isEmpty from '@lodash/isEmpty'
import { Touchable } from '../components/Touchable'
import { useDispatch, useSelector } from 'react-redux'
import { getMaxMistakesLimit } from '../arena/store/selectors/refree.selectors'
import { useThemeValues } from '../arena/hooks/useTheme'
import { createRefreeStateSlice, fetchRefreeDataFromFromLocalStorage } from '../arena/store/reducers/refree.reducers'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import { getContainerBackgroundColor } from '@ui/molecules/Button/button.styles'
import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import { getActiveGameBoardCellBgCell, getActiveGameCellMainNumberFontColor, getActiveGameNoteStyles } from '../arena/PuzzleBoard'
import { getStyles as puzzleBoardStylesHandler } from '../arena/PuzzleBoard/puzzleBoard.styles'

import { Board } from '../arena/gameBoard'
import { transformRawPuzzleToStateMainNumbers } from '@domain/board/utils/puzzleDataTransformers'
import { createBoardStateSlice } from '../arena/store/reducers/board.reducers'
import { injectReducer, removeReducer } from 'src/redux/store'
import { createBoardRepositoryHandlers } from 'src/repositories/boardRepository/BoardRepository'

import { boardStateSelectors, boardControllerSelectors, gameStateSelectors, refreeSelectors } from './state.selectors'
import { NotesRecord } from '@domain/board/records/notesRecord'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import withActions from '@utils/hocs/withActions'
import { ACTION_TYPES, ACTION_HANDLERS } from './gameSettings.actionHandlers'
import Refree from '../arena/refree'
import { BoardControllerComp } from '../arena/cellActions'
import { START_GAME_MENU_ITEMS_IDS } from '@application/usecases/newGameMenu/constants'
import { Timer } from '@utils/classes/timer'
import { Inputpanel } from '../arena/inputPanel'
import { createBoardControllerRepositoryHandlers } from 'src/repositories/boardControllerRepository/BoardControllerRepository'
import { GAME_SETTINGS_STATE, OPTION_STATES, SNACKBAR_MSGS, DYNAMIC_DATA_KEYS } from './constants'
import { createBoardControllerSlice } from '../arena/store/reducers/boardController.reducers'
import { createGameStateSlice } from '../arena/store/reducers/gameState.reducers'
import { createGameStateRepositoryHandlers } from 'src/repositories/gameStateRepository/GameStateRepository'
import { GAME_STATE } from '@application/constants'
import { useSnackbar } from '../arena/hooks/useSnackbar'
import _isNil from '@lodash/isNil'
import { hideOutNotesWhoseNumbersFilledInHouse } from '@application/usecases/board'
import { PreviewStates } from '@application/adapterInterfaces/analytics'
import Tooltip, { usePopable } from '@ui/atoms/Tooltip'
import { MAX_GAME_SETTINGS_PRVIEW_TOOLTIP_SHOWN_COUNT } from '@application/adapterInterfaces/coachMarks'
import { createRefreeStateRepositoryHandlers } from 'src/repositories/refreeRepository/refreeRepository'

enum INPUT_TYPES {
    TOGGLE = 'TOGGLE',
    DROPDOWN = 'DROPDOWN'
}

const SETTINGS_ = [
    {
        title: 'Game Over',
        hasPreview: false,
        items: [
            {
                key: GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: `Game over on {{${DYNAMIC_DATA_KEYS.MISTAKES_LIMIT}}} mistakes`
            },
            {
                key: GAME_SETTINGS_KEYS.MISTAKES_LIMIT,
                inputType: INPUT_TYPES.DROPDOWN,
                value: 0,
                description: 'Number of mistake allowed in game',
                disabled: false,
                options: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '5', value: '5' },
                    { label: '6', value: '6' },
                    { label: '7', value: '7' },
                    { label: '8', value: '8' },
                    { label: '9', value: '9' },
                    { label: '10', value: '10' },
                ]
            }
        ]
    },
    {
        title: 'Visual Highlights',
        hasPreview: true,
        items: [
            {
                key: GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Show feedback when mistake is made'
            },
            {
                key: GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Highlight cells with different background colors'
            },
            {
                key: GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Highlight notes of a number'
            }
        ]
    },
    {
        title: 'Fill Numbers',
        hasPreview: true,
        items: [
            {
                key: GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Allow filling all the notes in cell'
            },
            {
                key: GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Fill notes with short press and cell solution number with long press'
            }
        ]
    },
    {
        title: 'Sounds',
        hasPreview: false,
        items: [
            {
                key: GAME_SETTINGS_KEYS.SOUNDS_ENABLED,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Enable or disable all game sounds'
            }
        ]
    },
    {
        title: 'Hints',
        hasPreview: false,
        items: [
            {
                key: GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Show reminders to use hints when stuck'
            }
        ]
    }
]

const clues = [0, 0, 0, 0, 0, 2, 0, 0, 0, 5, 9, 0, 3, 0, 0, 0, 1, 0, 0, 6, 3, 4, 0, 0, 5, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 8, 7, 0, 0, 8, 6, 3, 0, 0, 5, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 1, 3, 8, 0, 0, 5, 0, 0, 0, 8, 0, 7, 4, 0, 0, 0, 9, 0, 0, 0, 0, 0]
const solution = [4, 1, 7, 5, 9, 2, 8, 6, 3, 5, 9, 2, 3, 8, 6, 4, 1, 7, 8, 6, 3, 4, 1, 7, 5, 9, 2, 1, 4, 5, 7, 2, 9, 6, 3, 8, 7, 2, 9, 8, 6, 3, 1, 4, 5, 6, 3, 8, 1, 4, 5, 7, 2, 9, 9, 7, 4, 2, 5, 1, 3, 8, 6, 2, 5, 1, 6, 3, 8, 9, 7, 4, 3, 8, 6, 9, 7, 4, 2, 5, 1]

const getDynamicDataMapping = (settingsConfigsOnOffValue: AllGameSettingsValues) => {
    return {
        [DYNAMIC_DATA_KEYS.MISTAKES_LIMIT]: settingsConfigsOnOffValue[GAME_SETTINGS_KEYS.MISTAKES_LIMIT]
    }
}

const GameSettings_ = ({ onAction }) => {
    const _dependencies = useDependency()

    const [settingsConfigsOnOffValue, setSettingsConfigsOnOffValue] = React.useState<AllGameSettingsValues>({} as AllGameSettingsValues);

    const styles = useStyles(getStyles)

    const boardStyles = useStyles(puzzleBoardStylesHandler)

    const timer = useRef(new Timer(_noop, _noop)).current

    const [previewSection, setPreviewSection] = useState('')

    const mistakesLimit = useSelector(getMaxMistakesLimit)

    const mistakes = useSelector(refreeSelectors.getMistakes)

    const theme = useThemeValues()

    const { ref: tooltipRef, hide: hideTooltip, show: showTooltip } = usePopable()

    const dispatch = useDispatch()

    const {
        snackbarState, showSnackbar, hideSnackbar,
    } = useSnackbar(7000)

    const selectedCell = useSelector(boardStateSelectors.getSelectedCell)
    const mainNumbers = useSelector(boardStateSelectors.getMainNumbers)
    const notes = useSelector(boardStateSelectors.getNotesInfo)
    const gameState = useSelector(gameStateSelectors.getGameState)
    const pencilState = useSelector(boardControllerSelectors.getPencilStatus)

    const selectedCellMainNumber = MainNumbersRecord.getCellMainValue(mainNumbers, selectedCell)

    const dependencies = useRef(_dependencies)

    useEffect(() => {
        fetchGameSettingsValues()
        const { analytics } = dependencies.current
        analytics?.sendScreenVisitedEvent?.()
    }, [])

    useEffect(() => {
        const slice = createBoardStateSlice(GAME_SETTINGS_STATE.BOARD)
        const boardControllerSlice = createBoardControllerSlice(GAME_SETTINGS_STATE.BOARD_CONTROLLER)
        const gameStateSlice = createGameStateSlice(GAME_SETTINGS_STATE.GAME_STATE)
        const refreeStateSlice = createRefreeStateSlice(GAME_SETTINGS_STATE.REFREE)

        injectReducer(GAME_SETTINGS_STATE.BOARD, slice.reducer)
        injectReducer(GAME_SETTINGS_STATE.BOARD_CONTROLLER, boardControllerSlice.reducer)
        injectReducer(GAME_SETTINGS_STATE.GAME_STATE, gameStateSlice.reducer)
        injectReducer(GAME_SETTINGS_STATE.REFREE, refreeStateSlice.reducer)

        const boardRepository = createBoardRepositoryHandlers(slice.actions, boardStateSelectors)
        const boardControllerRepository = createBoardControllerRepositoryHandlers(boardControllerSlice.actions, boardControllerSelectors)
        const gameStateRepository = createGameStateRepositoryHandlers(gameStateSlice.actions, gameStateSelectors)
        const refreeRepository = createRefreeStateRepositoryHandlers(refreeStateSlice.actions, refreeSelectors)

        boardRepository.setState({
            mainNumbers: transformRawPuzzleToStateMainNumbers({
                clues, solution
            }),
            selectedCell: { row: 0, col: 0 },
            notes: NotesRecord.initNotes(),
            moves: []
        })

        gameStateRepository.setGameState(GAME_STATE.ACTIVE)

        dependencies.current = {
            ...dependencies.current,
            boardRepository,
            boardControllerRepository,
            gameStateRepository,
            refreeRepository
        }

        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: dependencies.current
        })

        return () => {
            removeReducer(GAME_SETTINGS_STATE.BOARD)
            removeReducer(GAME_SETTINGS_STATE.BOARD_CONTROLLER)
            removeReducer(GAME_SETTINGS_STATE.GAME_STATE)
            removeReducer(GAME_SETTINGS_STATE.REFREE)
        }
    }, [])

    useEffect(() => {
        const allowAnyNoteInCell = settingsConfigsOnOffValue[GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]
        if (!_isNil(allowAnyNoteInCell) && !allowAnyNoteInCell) {
            hideOutNotesWhoseNumbersFilledInHouse(dependencies.current)
        }
    }, [settingsConfigsOnOffValue[GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]])

    useEffect(() => {
        const { coachMarksAdapter } = dependencies.current
        setTimeout(() => {
            coachMarksAdapter.getCustomizeExperiencePreviewTooltipShownCount()
                .then((shownCount) => {
                    if (shownCount < MAX_GAME_SETTINGS_PRVIEW_TOOLTIP_SHOWN_COUNT) {
                        showTooltip()
                        setTimeout(() => {
                            hideTooltip()
                        }, 7000)
                        coachMarksAdapter.increaseCustomizeExperiencePreviewTooltipShownCount()
                    }
                })
        }, 2000)
    }, [])

    const fetchGameSettingsValues = () => {
        const { gameSettingsAdapter } = dependencies.current
        gameSettingsAdapter.getAllGameSettingsValues()
            .then((settings: AllGameSettingsValues) => {
                if (_isEmpty(settings)) setSettingsConfigsOnOffValue({} as AllGameSettingsValues)
                else setSettingsConfigsOnOffValue(settings)
            })
        dispatch(fetchRefreeDataFromFromLocalStorage());
    }

    const updateValue = async (newValue, item) => {
        const { gameSettingsAdapter, analytics } = dependencies.current
        await gameSettingsAdapter.updateGameSettingValue({
            key: item.key,
            value: newValue
        })

        fetchGameSettingsValues()
        if (item.inputType === INPUT_TYPES.TOGGLE) {
            const newState = newValue ? OPTION_STATES.ON : OPTION_STATES.OFF
            const msg = SNACKBAR_MSGS[item.key]?.[newState]

            if (msg) {
                const dynamicData = getDynamicDataMapping(settingsConfigsOnOffValue)
                showSnackbar(dynamicInterpolation(msg, dynamicData))
            }
        }
        analytics?.sendOnChangeOptionEvent?.({
            option: item.key,
            value: newValue
        })
    }

    const SETTINGS = useMemo(() => {
        const dynamicData = getDynamicDataMapping(settingsConfigsOnOffValue)
        return SETTINGS_.map((settingsCategory) => {
            return {
                ...settingsCategory,
                items: settingsCategory.items.map((item) => {
                    const extraConfigs: { [key: string]: any } = {}
                    if (item.key === GAME_SETTINGS_KEYS.MISTAKES_LIMIT) {
                        extraConfigs.disabled = !settingsConfigsOnOffValue[GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED]
                    }
                    return {
                        ...item,
                        description: dynamicInterpolation(item.description, dynamicData),
                        value: settingsConfigsOnOffValue[item.key] ?? false,
                        ...extraConfigs
                    }
                })
            }
        })
    }, [settingsConfigsOnOffValue])

    const renderInputView = (item) => {
        if (item.inputType === INPUT_TYPES.TOGGLE) {
            return (
                <Switch
                    value={item.value}
                    onValueChange={() => {
                        const newValue = !settingsConfigsOnOffValue[item.key]
                        updateValue(newValue, item)
                    }}
                />
            )
        }
        return (
            <Dropdown
                label="Gender"
                placeholder="Select Gender"
                options={item.options}
                value={`${mistakesLimit}`}
                menuContentStyle={{
                    width: 50,
                    bottom: 50,
                }}
                disabled={item.disabled}
                CustomDropdownInput={() => {
                    return (
                        <View style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 40, height: 40, borderRadius: 8, borderWidth: 1,
                            borderColor: theme.colors['outline-variant'],
                            backgroundColor: item.disabled ? getContainerBackgroundColor({
                                type: BUTTON_TYPES.FILLED,
                                state: BUTTON_STATES.DISABLED
                            }, theme) : undefined
                        }}>
                            <Text>{mistakesLimit}</Text>
                        </View>
                    )
                }}
                hideMenuHeader
                onSelect={(selectedValue) => {
                    updateValue(Number(selectedValue), item)
                }}
                Touchable={(props) => {
                    return <Touchable {...props} style={{ width: 50 }} />
                }}
            />
        )
    }

    const onPreviewPress = (category) => {
        const { analytics } = dependencies.current
        setPreviewSection((current) => {
            return current === category.title ? '' : category.title
        })
        analytics?.sendPreviewPressEvent?.({
            currentState: category.title === previewSection ? PreviewStates.CLOSED : PreviewStates.OPENED,
            section: category.title
        })
    }

    const PreviewTooltipWrapper = ({ category, children }) => {
        if (category.title === 'Visual Highlights') {
            return (
                <Tooltip
                    ref={tooltipRef}
                    content={
                        <Text
                            style={styles.tooltipText}
                            withoutLineHeight
                        >
                            {'change settings and click here to see how the Game Experience changes'}
                        </Text>
                    }
                    position={"top"}
                    caretPosition={"right"}
                    containerStyle={styles.tooltipContainer}
                >
                    {children}
                </Tooltip>
            )
        }
        return children
    }

    return (
        <Page style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.allCategoriesContainer}>
                    {SETTINGS.map((category, index) => {
                        return (
                            <View key={index}>
                                <View style={styles.categoryContainer}>
                                    <View style={styles.categoryHeaderContainer}>
                                        <Text style={styles.categoryTitle} type={TEXT_VARIATIONS.TITLE_MEDIUM}>{category.title}</Text>
                                        {
                                            category.hasPreview ?
                                                <PreviewTooltipWrapper category={category}>
                                                    <Button
                                                        type={BUTTON_TYPES.TEXT}
                                                        label={'Preview'}
                                                        onPress={() => onPreviewPress(category)}
                                                    />
                                                </PreviewTooltipWrapper>
                                                : null
                                        }
                                    </View>
                                    <View style={styles.categoryItemsContainer}>
                                        {category.items.map((item, itemIndex) => (
                                            <View key={item.key} style={[styles.itemContainer, itemIndex ? styles.itemsGap : null]}>
                                                <View style={styles.textContainer}>
                                                    <Text
                                                        style={styles.itemDescription}
                                                        withoutLineHeight
                                                        type={TEXT_VARIATIONS.BODY_MEDIUM}
                                                    >
                                                        {item.description}
                                                    </Text>
                                                </View>
                                                {renderInputView(item)}
                                            </View>
                                        ))}
                                    </View>
                                    {
                                        previewSection === category.title ?
                                            (
                                                <View style={styles.previewContainer}>
                                                    <Refree
                                                        timer={timer}
                                                        time={{ hours: 0, minutes: 11, seconds: 32 }}
                                                        mistakes={mistakes}
                                                        difficultyLevelID={START_GAME_MENU_ITEMS_IDS.MEDIUM}
                                                        maxMistakesLimit={mistakesLimit}
                                                        onAction={onAction}
                                                        containerStyles={styles.refreeContainer}
                                                    />
                                                    <Board
                                                        showCellContent
                                                        mainNumbers={mainNumbers}
                                                        notes={notes}
                                                        onCellClick={(cell) => onAction({ type: ACTION_TYPES.ON_CELL_PRESS, payload: { cell, dependencies: dependencies.current } })}
                                                        getCellBGColor={(cell) => {
                                                            return getActiveGameBoardCellBgCell(
                                                                cell, boardStyles, dependencies.current, selectedCell, mainNumbers
                                                            )
                                                        }}
                                                        getCellMainNumberFontColor={(cell) => {
                                                            return getActiveGameCellMainNumberFontColor(
                                                                cell, mainNumbers, boardStyles, dependencies.current
                                                            )
                                                        }}
                                                        getNoteStyles={(noteInfo) => {
                                                            return getActiveGameNoteStyles(
                                                                noteInfo, selectedCellMainNumber, boardStyles, dependencies.current
                                                            )
                                                        }}
                                                        showAxes={false}
                                                        customWindowWidth={350}
                                                        mainNumberTextType={TEXT_VARIATIONS.HEADING_SMALL}
                                                    />
                                                    <BoardControllerComp
                                                        containerStyles={styles.boardControllerContainerStyles}
                                                        textStyles={styles.boardControllerTextStyles}
                                                        onAction={onAction}
                                                        refFromParent={React.createRef()}
                                                        gameState={gameState}
                                                        pencilState={pencilState}
                                                    />
                                                    <Inputpanel
                                                        numbersVisible={new Array(10).fill(true)}
                                                        onAction={onAction}
                                                        disableNumbersInput={false}
                                                        disableEraser={false}
                                                        shouldAddNumberInPanel={() => true}
                                                        cellWidth={30}
                                                        textType={TEXT_VARIATIONS.HEADING_MEDIUM}
                                                    />
                                                </View>
                                            )
                                            : null
                                    }
                                </View>
                                {index < SETTINGS.length - 1 && <Divider style={styles.divider} />}
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
            <Snackbar
                visible={snackbarState.visible}
                wrapperStyle={styles.snackbarContainer}
                onDismiss={hideSnackbar}
            >
                <Text type={TEXT_VARIATIONS.LABEL_LARGE} style={styles.snackbarText}>
                    {snackbarState.message}
                </Text>
            </Snackbar>
        </Page>
    )
}

export const GameSettings = React.memo(
    withActions({ actionHandlers: ACTION_HANDLERS })(GameSettings_),
)
