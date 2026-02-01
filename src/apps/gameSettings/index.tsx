import React, {
    useEffect, useMemo,
    useRef,
    useState,
} from 'react'
import { View, ScrollView } from 'react-native'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../i18n/hooks/useTranslation'

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
import { useTheme } from '../arena/hooks/useTheme'
import { createRefreeStateSlice, fetchRefreeDataFromFromLocalStorage } from '../arena/store/reducers/refree.reducers'
import { dynamicInterpolation } from '@lodash/dynamicInterpolation'
import { getContainerBackgroundColor, getTextColor } from '@ui/molecules/Button/button.styles'
import Button, { BUTTON_STATES, BUTTON_TYPES } from '@ui/molecules/Button'
import { getActiveGameBoardCellBgCell, getActiveGameCellMainNumberFontColor, getActiveGameNoteStyles } from '../arena/PuzzleBoard'
import { getStyles as puzzleBoardStylesHandler } from '../arena/PuzzleBoard/puzzleBoard.styles'

import { Board } from '../arena/gameBoard'
import { transformRawPuzzleToStateMainNumbers } from '@domain/board/utils/puzzleDataTransformers'
import { createBoardStateSlice } from '../arena/store/reducers/board.reducers'
import { injectReducer, removeReducer } from 'src/redux/store'
import { createBoardRepositoryHandlers } from 'src/repositories/boardRepository/BoardRepository'

import { boardStateSelectors, boardControllerSelectors, gameStateSelectors, refreeSelectors, inputPanelSelectors } from './state.selectors'
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
import { GAME_SETTINGS_STATE, OPTION_STATES, DYNAMIC_DATA_KEYS } from './constants'
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
import { createInputPanelSlice } from '../arena/store/reducers/inputPanel.reducers'
import { createInputPanelStateRepositoryHandlers } from 'src/repositories/inputPanelRepository/InputPanelRepository'
import { GameInputPanelView, getRemainingCounts } from '../arena/GameInputPanel'

enum INPUT_TYPES {
    TOGGLE = 'TOGGLE',
    DROPDOWN = 'DROPDOWN'
}

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
    const { t } = useTranslation('settings')

    const SETTINGS_ = [
        {
            title: t('gameSettings.categories.darkMode', 'Dark Mode'),
            hasPreview: false,
            hasToggle: true,
            inputType: INPUT_TYPES.TOGGLE,
            key: GAME_SETTINGS_KEYS.DARK_MODE,
            value: false,
            items: []
        },
        {
            title: t('gameSettings.categories.gameOver', 'Game Over'),
            hasPreview: false,
            items: [
                {
                    key: GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.gameOverOnMistakes', `Game over on {{${DYNAMIC_DATA_KEYS.MISTAKES_LIMIT}}} mistakes`)
                },
                {
                    key: GAME_SETTINGS_KEYS.MISTAKES_LIMIT,
                    inputType: INPUT_TYPES.DROPDOWN,
                    value: 0,
                    description: t('gameSettings.descriptions.mistakesLimit', 'Number of mistake allowed in game'),
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
            title: t('gameSettings.categories.visualHighlights', 'Visual Highlights'),
            hasPreview: true,
            items: [
                {
                    key: GAME_SETTINGS_KEYS.SHOW_REMAINING_COUNT,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.showRemainingCount', 'Show how often a number can still be used')
                },
                {
                    key: GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.showFeedbackOnMistake', 'Show feedback when mistake is made')
                },
                {
                    key: GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.highlightCells', 'Highlight cells with different background colors')
                },
                {
                    key: GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.highlightNotes', 'Highlight notes of a number')
                }
            ]
        },
        {
            title: t('gameSettings.categories.fillNumbers', 'Fill Numbers'),
            hasPreview: true,
            items: [
                {
                    key: GAME_SETTINGS_KEYS.FILL_NOTES_WITHOUT_PENCIL,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.fillNotesWithoutPencil', 'Fill notes without Pencil')
                },
                {
                    key: GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.allowAnyNote', 'Allow filling all the notes in cell')
                },
                {
                    key: GAME_SETTINGS_KEYS.FILL_NUMBER_ON_CELL_CLICK,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.fillOnCellClick', 'Lock number and fill on Cell tap')
                }
            ]
        },
        {
            title: t('gameSettings.categories.sounds', 'Sounds'),
            hasPreview: false,
            items: [
                {
                    key: GAME_SETTINGS_KEYS.SOUNDS_ENABLED,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.soundsEnabled', 'Enable or disable all game sounds')
                }
            ]
        },
        {
            title: t('gameSettings.categories.hints', 'Hints'),
            hasPreview: false,
            items: [
                {
                    key: GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT,
                    inputType: INPUT_TYPES.TOGGLE,
                    value: false,
                    description: t('gameSettings.descriptions.remindToTakeHint', 'Show reminders to use hints when stuck')
                }
            ]
        }
    ]

    const SNACKBAR_MSGS = {
        [GAME_SETTINGS_KEYS.SHOW_REMAINING_COUNT]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.showRemainingCountOn', 'now you will see remaining count for each number in input panel'),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.showRemainingCountOff', 'remaining count is now hidden from input panel'),
        },
        [GAME_SETTINGS_KEYS.SOUNDS_ENABLED]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.soundsOn', 'sounds have been enabled. now try pressing any cell in puzzle and you will hear the tunes'),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.soundsOff', 'no more sounds in game. wish you a nice meditative session'),
        },
        [GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.allowAnyNoteOn', `in Preview do below\npick an empty cell and try to fill 1-9 as notes, notice now you can fill all the notes`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.allowAnyNoteOff', "in Preview do below\nin 1st try to fill all the notes. notice only 1, 4, 8 can be filled"),
        },
        [GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.fillNoteShortClickOn', `now notes will be filled without turning on Pencil. just press the number.\nlong press the number to fill cell with it's soluton`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.fillNoteShortClickOff', 'now you have to turn on Pencil to fill notes in cell'),
        },
        [GAME_SETTINGS_KEYS.FILL_NUMBER_ON_CELL_CLICK]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.fillOnCellClickOn', `now numbers & Notes will be filled faster.In Preview do below\na. long press any number to lock it\nb. tap on an empty cell and number will be filled`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.fillOnCellClickOff', 'now you have to first select a cell and then press on number to fill'),
        },
        [GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.highlightCellsOn', 'now cells will have colorful backgrounds'),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.highlightCellsOff', 'all the cells will have same background like solving Sudoku on paper'),
        },
        [GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.highlightNotesOn', 'now notes will be highlighted in puzzle.\nin Preview do below\n  a. click Fast Pencil\n  b. select a filled cell\nnotice notes have been highlighted'),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.highlightNotesOff', 'in Preview do below\n  a. click Fast Pencil\n  b. select a filled cell\nnotice all the notes have same color'),
        },
        [GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.remindHintOn', 'we will remind you to use hint at a regular interval when no progress is made in puzzle'),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.remindHintOff', 'you are the champ. no more reminders to take hint'),
        },
        [GAME_SETTINGS_KEYS.GAME_OVER_ON_MISTAKES_THRESHOLD_CROSSED]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.gameOverMistakesOn', `game will be over once your mistakes count is {{${DYNAMIC_DATA_KEYS.MISTAKES_LIMIT}}}. WATCH OUT!`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.gameOverMistakesOff', "game won't be over on making mistakes. BE FEARLESS!"),
        },
        [GAME_SETTINGS_KEYS.SHOW_FEEDBACK_ON_MISTAKE]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.showFeedbackOn', `in Preview do below\n a. fill 1 in first cell\nit's a mistake and see mistakes count has gone up`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.showFeedbackOff', `in Preview do below\n a. fill 1 in first cell\nit's a mistake and see you can't notice it in preview`),
        },
        [GAME_SETTINGS_KEYS.FILL_NOTES_WITHOUT_PENCIL]: {
            [OPTION_STATES.ON]: t('gameSettings.snackbar.fillNotesWithoutPencilOn', `in Preview now you will see 2 input panels, one for notes and one for main numbers`),
            [OPTION_STATES.OFF]: t('gameSettings.snackbar.fillNotesWithoutPencilOff', `now you have to tap on Pencil first before filling Notes`),
        }
    }

    const boardStyles = useStyles(puzzleBoardStylesHandler)

    const timer = useRef(new Timer(_noop, _noop)).current

    const [previewSection, setPreviewSection] = useState('')

    const mistakesLimit = useSelector(getMaxMistakesLimit)

    const mistakes = useSelector(refreeSelectors.getMistakes)

    const { theme, isLight, switchTheme } = useTheme()

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
    const lockedNumber = useSelector(inputPanelSelectors.getLockedNumber)

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
        const inputPanelStateSlice = createInputPanelSlice(GAME_SETTINGS_STATE.INPUT_PANEL)

        injectReducer(GAME_SETTINGS_STATE.BOARD, slice.reducer)
        injectReducer(GAME_SETTINGS_STATE.BOARD_CONTROLLER, boardControllerSlice.reducer)
        injectReducer(GAME_SETTINGS_STATE.GAME_STATE, gameStateSlice.reducer)
        injectReducer(GAME_SETTINGS_STATE.REFREE, refreeStateSlice.reducer)
        injectReducer(GAME_SETTINGS_STATE.INPUT_PANEL, inputPanelStateSlice.reducer)

        const boardRepository = createBoardRepositoryHandlers(slice.actions, boardStateSelectors)
        const boardControllerRepository = createBoardControllerRepositoryHandlers(boardControllerSlice.actions, boardControllerSelectors)
        const gameStateRepository = createGameStateRepositoryHandlers(gameStateSlice.actions, gameStateSelectors)
        const refreeRepository = createRefreeStateRepositoryHandlers(refreeStateSlice.actions, refreeSelectors)
        const inputPanelRepository = createInputPanelStateRepositoryHandlers(inputPanelStateSlice.actions, inputPanelSelectors)

        boardRepository.setState({
            mainNumbers: transformRawPuzzleToStateMainNumbers({
                clues, solution
            }),
            selectedCell: { row: 0, col: 0 },
            notes: NotesRecord.initNotes(),
            moves: []
        })

        gameStateRepository.setGameState(GAME_STATE.ACTIVE)

        inputPanelRepository.unlockNumber()

        dependencies.current = {
            ...dependencies.current,
            boardRepository,
            boardControllerRepository,
            gameStateRepository,
            refreeRepository,
            inputPanelRepository
        }

        onAction({
            type: ACTION_TYPES.ON_INIT,
            payload: { dependencies: dependencies.current }
        })

        return () => {
            removeReducer(GAME_SETTINGS_STATE.BOARD)
            removeReducer(GAME_SETTINGS_STATE.BOARD_CONTROLLER)
            removeReducer(GAME_SETTINGS_STATE.GAME_STATE)
            removeReducer(GAME_SETTINGS_STATE.REFREE)
            removeReducer(GAME_SETTINGS_STATE.INPUT_PANEL)
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

        if (item.key === GAME_SETTINGS_KEYS.DARK_MODE) {
            switchTheme()
        }

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
            const categoryToggleValue = settingsCategory.hasToggle ?
                { value: settingsConfigsOnOffValue[settingsCategory.key] } : null
            return {
                ...settingsCategory,
                ...categoryToggleValue,
                items: settingsCategory.items?.map((item) => {
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
                    backgroundColor: _get(theme, ['colors', isLight ? 'surface' : 'surface-container-low']),
                }}
                disabled={item.disabled}
                CustomDropdownInput={() => {
                    return (
                        <View style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 40, height: 40, borderRadius: 8,
                            backgroundColor: getContainerBackgroundColor({
                                type: BUTTON_TYPES.TONAL,
                                state: item.disabled ? BUTTON_STATES.DISABLED : BUTTON_STATES.ENABLED
                            }, theme)
                        }}>
                            <Text style={{
                                color: getTextColor({
                                    type: BUTTON_TYPES.TONAL,
                                    state: item.disabled ? BUTTON_STATES.DISABLED : BUTTON_STATES.ENABLED
                                }, theme)
                            }}>{mistakesLimit}</Text>
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
        if (category.title === t('gameSettings.categories.visualHighlights', 'Visual Highlights')) {
            return (
                <Tooltip
                    ref={tooltipRef}
                    content={
                        <Text
                            style={styles.tooltipText}
                            withoutLineHeight
                        >
                            {t('gameSettings.tooltip', 'change settings and click here to see how the Game Experience changes')}
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
                                        <Text
                                            style={styles.categoryTitle}
                                            type={TEXT_VARIATIONS.TITLE_MEDIUM}
                                        >
                                            {category.title}
                                        </Text>
                                        {category.hasToggle ? renderInputView(category) : null}
                                        {
                                            category.hasPreview ?
                                                <PreviewTooltipWrapper category={category}>
                                                    <Button
                                                        type={BUTTON_TYPES.TEXT}
                                                        label={t('common:preview', 'Preview') as string}
                                                        onPress={() => onPreviewPress(category)}
                                                    />
                                                </PreviewTooltipWrapper>
                                                : null
                                        }
                                    </View>
                                    {
                                        category.items?.length ?
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
                                            : null
                                    }
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
                                                    <View style={styles.inputPanelContainer}>
                                                        <GameInputPanelView
                                                            numbersVisible={new Array(10).fill(true)}
                                                            onAction={onAction}
                                                            lockedNumber={lockedNumber}
                                                            allowNotesInputWithoutPencil={dependencies?.current?.gameSettingsAdapter?.fillNotesWithoutPencil?.()}
                                                            disableEraser={false}
                                                            disableNumbersInput={false}
                                                            cellWidth={30}
                                                            numbersTextType={TEXT_VARIATIONS.TITLE_LARGE}
                                                            remainingCountTextType={TEXT_VARIATIONS.LABEL_SMALL}
                                                            showRemainingCount={settingsConfigsOnOffValue[GAME_SETTINGS_KEYS.SHOW_REMAINING_COUNT] as boolean}
                                                            remainingCounts={getRemainingCounts(mainNumbers)}
                                                        />
                                                    </View>
                                                    <BoardControllerComp
                                                        containerStyles={styles.boardControllerContainerStyles}
                                                        textStyles={styles.boardControllerTextStyles}
                                                        onAction={onAction}
                                                        dependencies={dependencies?.current}
                                                        refFromParent={React.createRef()}
                                                        gameState={gameState}
                                                        pencilState={pencilState}
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
