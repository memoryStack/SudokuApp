import React, { useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import PropTypes from 'prop-types'

import { useSelector } from 'react-redux'

import _noop from '@lodash/noop'
import _isEqual from '@lodash/isEqual'

import withActions from '../../../utils/hocs/withActions'

import { Inputpanel } from '../inputPanel'

import { useGameBoardInputs } from '../hooks/useGameBoardInputs'
import { GameState } from '@application/utils/gameState'
import { getGameState } from '../store/selectors/gameState.selectors'

import { ACTION_HANDLERS } from './actionHandlers'
import { MainNumbersRecord } from '@domain/board/records/mainNumbersRecord'
import { BoardIterators } from '@domain/board/utils/boardIterators'
import { MAX_INSTANCES_OF_A_NUMBER } from '@domain/board/board.constants'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import { useBoardElementsDimensions } from '../hooks/useBoardElementsDimensions'
import { getLockedNumber } from '../store/selectors/inputPanel.selectors'
import { INPUT_TYPE } from '@application/adapterInterfaces/stateManagers/inputPanelRepository'
import { useDependency } from 'src/hooks/useDependency'
import { useStyles } from '@utils/customHooks/useStyles'
import _get from '@lodash/get'

export const NOTES_INPUT_PANEL_TEST_ID = 'NOTES_INPUT_PANEL_TEST_ID'
export const MAIN_NUMBER_INPUT_PANEL_TEST_ID = 'MAIN_NUMBER_INPUT_PANEL_TEST_ID'

const getInstancesCounts = mainNumbers => {
    const instancesCount = new Array(10).fill(0)
    BoardIterators.forBoardEachCell(cell => {
        if (MainNumbersRecord.isCellFilledCorrectly(mainNumbers, cell)) {
            const value = MainNumbersRecord.getCellMainValue(mainNumbers, cell)
            instancesCount[value]++
        }
    })
    return instancesCount
}

const getStyles = (_, theme) => {
    return StyleSheet.create({
        separateInputPanel: {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
            },
            inputPanelContainer: {
                display: 'flex',
                flex: 1
            },
            text: {
                marginBottom: 8,
                textAlign: 'center',
                color: _get(theme, ['colors', 'on-surface-variant-low']),
            }


        }
    })
}

export const GameInputPanelView = ({
    allowNotesInputWithoutPencil,
    onAction,
    disableNumbersInput,
    disableEraser,
    cellWidth,
    lockedNumber,
    numbersVisible,
    numbersTextType
}) => {

    const styles = useStyles(getStyles)

    const { number: lockedNumberValue, type: lockedNumberInputType } = lockedNumber ?? { number: 0, type: '' }
    const shouldAddNumberInPanel = () => true
    const renderTwoPanels = () => {
        return (
            <View style={styles.separateInputPanel.container}>
                <View style={styles.separateInputPanel.inputPanelContainer} testID={NOTES_INPUT_PANEL_TEST_ID}>
                    <Text style={styles.separateInputPanel.text} type={TEXT_VARIATIONS.BODY_MEDIUM}>Notes</Text>
                    <Inputpanel
                        onAction={({ type, payload }) => {
                            return onAction({
                                type,
                                payload: {
                                    ...payload,
                                    notesInput: true
                                }
                            })
                        }}
                        disableNumbersInput={disableNumbersInput}
                        disableEraser={disableEraser}
                        shouldAddNumberInPanel={shouldAddNumberInPanel}
                        numOfRows={3}
                        addEraser={false}
                        cellWidth={cellWidth * 0.8}
                        textType={numbersTextType ?? TEXT_VARIATIONS.HEADING_MEDIUM}
                        lockedNumber={lockedNumberInputType === INPUT_TYPE.NOTES ? lockedNumberValue : 0}
                    />
                </View>
                <View style={styles.separateInputPanel.inputPanelContainer} testID={MAIN_NUMBER_INPUT_PANEL_TEST_ID}>
                    <Text style={styles.separateInputPanel.text} type={TEXT_VARIATIONS.BODY_MEDIUM}>Main Number</Text>
                    <Inputpanel
                        numbersVisible={numbersVisible}
                        onAction={onAction}
                        disableNumbersInput={disableNumbersInput}
                        disableEraser={disableEraser}
                        shouldAddNumberInPanel={shouldAddNumberInPanel}
                        numOfRows={3}
                        addEraser={false}
                        cellWidth={cellWidth * 0.8}
                        textType={numbersTextType ?? TEXT_VARIATIONS.HEADING_MEDIUM}
                        lockedNumber={lockedNumberInputType === INPUT_TYPE.MAIN_NUMBERS ? lockedNumberValue : 0}
                    />
                </View>
            </View>
        )
    }

    return (
        allowNotesInputWithoutPencil ? renderTwoPanels() : (
            <Inputpanel
                numbersVisible={numbersVisible}
                onAction={onAction}
                textType={numbersTextType}
                disableNumbersInput={disableNumbersInput}
                disableEraser={disableEraser}
                shouldAddNumberInPanel={shouldAddNumberInPanel}
                lockedNumber={lockedNumberValue}
                cellWidth={cellWidth}
            />
        )
    )
}

const GameInputPanel_ = ({ onAction }) => {
    const dependencies = useDependency()
    const { mainNumbers } = useGameBoardInputs()

    const lockedNumber = useSelector(getLockedNumber)

    const { CELL_WIDTH } = useBoardElementsDimensions()

    const gameState = useSelector(getGameState)
    const isGameActive = (new GameState(gameState).isGameActive())
    const [numbersVisible, setNumbersVisibility] = useState(new Array(10).fill(true))

    const getNumbersVisibilityStatus = instancesCount => {
        const numbersVisibility = [true]
        for (let i = 1; i <= MAX_INSTANCES_OF_A_NUMBER; i++)
            numbersVisibility.push(instancesCount[i] !== MAX_INSTANCES_OF_A_NUMBER)
        return numbersVisibility
    }

    useEffect(() => {
        const numbersNewVisibility = getNumbersVisibilityStatus(getInstancesCounts(mainNumbers))
        if (!_isEqual(numbersVisible, numbersNewVisibility)) setNumbersVisibility(numbersNewVisibility)
    }, [mainNumbers, numbersVisible])

    const allowNotesInputWithoutPencil = dependencies?.gameSettingsAdapter?.fillNotesWithoutPencil?.()

    return (
        <GameInputPanelView
            allowNotesInputWithoutPencil={allowNotesInputWithoutPencil}
            onAction={onAction}
            disableNumbersInput={!isGameActive}
            disableEraser={!isGameActive}
            cellWidth={CELL_WIDTH}
            numbersVisible={numbersVisible}
            lockedNumber={lockedNumber}
        />
    )
}

export const GameInputPanel = React.memo(withActions({ actionHandlers: ACTION_HANDLERS })(GameInputPanel_))

GameInputPanel_.propTypes = {
    onAction: PropTypes.func,
}

GameInputPanel_.defaultProps = {
    onAction: _noop,
}
