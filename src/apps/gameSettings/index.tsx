import React, {
    useEffect, useMemo,
} from 'react'
import { View, ScrollView } from 'react-native'

import _noop from '@lodash/noop'

import { useStyles } from '@utils/customHooks/useStyles'

import { Page } from '../components/Page'
import { Switch } from 'react-native-paper'; // TODO: import it from UI folder
import { Dropdown } from 'react-native-paper-dropdown';

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
import { fetchRefreeDataFromFromLocalStorage } from '../arena/store/reducers/refree.reducers'

enum INPUT_TYPES {
    TOGGLE = 'TOGGLE',
    DROPDOWN = 'DROPDOWN'
}

const SETTINGS_ = [
    {
        title: 'Visuals',
        items: [
            {
                key: GAME_SETTINGS_KEYS.HIGHLIGHT_CELLS,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Highlight related cells when selecting a number'
            },
            {
                key: GAME_SETTINGS_KEYS.HIGHLIGHT_NUMBERS_FONTS,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Highlight numbers with different fonts or styles'
            }
        ]
    },
    {
        title: 'Fill Numbers',
        items: [
            {
                key: GAME_SETTINGS_KEYS.ALLOW_ANY_NOTE_IN_CELL,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Allow filling multiple notes in a single cell'
            },
            {
                key: GAME_SETTINGS_KEYS.FILL_NOTE_ON_SHORT_CLICK,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Fill notes with a short click instead of requiring a long press'
            }
        ]
    },
    {
        title: 'Sounds',
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
        items: [
            {
                key: GAME_SETTINGS_KEYS.REMIND_TO_TAKE_HINT,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Show reminders to use hints when stuck'
            }
        ]
    },
    {
        title: 'Game Analytics',
        items: [
            {
                key: GAME_SETTINGS_KEYS.SHOW_TIMER,
                inputType: INPUT_TYPES.TOGGLE,
                value: false,
                description: 'Display a timer showing your current game duration'
            },
            {
                key: GAME_SETTINGS_KEYS.MISTAKES_LIMIT,
                inputType: INPUT_TYPES.DROPDOWN,
                value: 0,
                description: 'Number of mistake allowed in game',
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
            },
        ]
    },
]

const GameSettings_ = () => {
    const dependencies = useDependency()

    const [settingsConfigsOnOffValue, setSettingsConfigsOnOffValue] = React.useState<AllGameSettingsValues>({} as AllGameSettingsValues);

    const styles = useStyles(getStyles)

    const mistakesLimit = useSelector(getMaxMistakesLimit)

    const theme = useThemeValues()

    const dispatch = useDispatch()

    useEffect(() => {
        fetchGameSettingsValues()
    }, [])

    const fetchGameSettingsValues = () => {
        const { gameSettingsAdapter } = dependencies
        gameSettingsAdapter.getAllGameSettingsValues()
            .then((settings: AllGameSettingsValues) => {
                if (_isEmpty(settings)) setSettingsConfigsOnOffValue({} as AllGameSettingsValues)
                else setSettingsConfigsOnOffValue(settings)
            })
        dispatch(fetchRefreeDataFromFromLocalStorage());
    }

    const updateValue = async (newValue, item) => {
        const { gameSettingsAdapter } = dependencies
        await gameSettingsAdapter.updateGameSettingValue({
            key: item.key,
            value: newValue
        })
        fetchGameSettingsValues()
    }

    const SETTINGS = useMemo(() => {
        return SETTINGS_.map((settingsCategory) => {
            return {
                ...settingsCategory,
                items: settingsCategory.items.map((item) => {
                    return {
                        ...item,
                        value: settingsConfigsOnOffValue[item.key] ?? false
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
                    bottom: 50
                }}
                CustomDropdownInput={() => {
                    return (
                        <View style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: 40, height: 40, borderRadius: 8, borderWidth: 1,
                            borderColor: theme.colors['outline-variant']
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

    return (
        <Page style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {SETTINGS.map((category, index) => (
                    <View key={index}>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryTitle} type={TEXT_VARIATIONS.TITLE_MEDIUM}>{category.title}</Text>
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
                        </View>
                        {index < SETTINGS.length - 1 && <Divider style={styles.divider} />}
                    </View>
                ))}
            </ScrollView>

        </Page>
    )
}

export const GameSettings = React.memo(GameSettings_)
