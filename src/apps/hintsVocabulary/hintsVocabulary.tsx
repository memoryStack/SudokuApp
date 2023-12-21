import React, {
    useCallback, useState, useEffect, useRef,
} from 'react'

import { View, BackHandler, BackPressEventName } from 'react-native'

import PropTypes from 'prop-types'

import _get from '@lodash/get'
import _isNil from '@lodash/isNil'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Stack } from '@utils/classes/stack'

import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../navigation/headerSection/headerSection.constants'
import { useTranslation } from '../../i18n/hooks/useTranslation'
import { ROUTES } from '../../navigation/route.constants'
import { EVENTS } from '../../constants/events'

import { NextGameMenu } from '../arena/nextGameMenu'

import { getStyles } from './hintsVocabulary.styles'

/*
TODOs:
    centeralize vocabKeyword value
    read param from some kind of util so that updating navigation becomes easier
    listen to some event that will push more entries in vocab stack
*/

const HintsVocabulary_ = ({ navigation, route }) => {
    const [currentVocabKeyword, setCurrentVocabKeyword] = useState('')

    const stack = useRef(new Stack<string>()).current

    const { t } = useTranslation()

    const styles = useStyles(getStyles)

    useEffect(() => {
        const vocabKeyword = _get(route, ['params', 'vocabKeyword'])
        if (_isNil(vocabKeyword) || stack.peek() === vocabKeyword) return

        stack.push(vocabKeyword)
        setCurrentVocabKeyword(vocabKeyword)
    }, [route?.params?.vocabKeyword])

    useEffect(() => {
        if (!_isNil(currentVocabKeyword)) {
            navigation.setOptions({ title: currentVocabKeyword })
        }
    }, [navigation, currentVocabKeyword])

    useEffect(() => {
        const backPressHandler = () => {
            if (stack.length() === 1) {
                navigation.goBack()
            } else {
                stack.pop()
                setCurrentVocabKeyword(stack.peek() as string)
            }
            return true
        }

        if (_isNil(_get(route, ['params', HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.BACK]]))) {
            navigation.setParams({
                [HEADER_ITEMS_PRESS_HANDLERS_KEYS[HEADER_ITEMS.BACK]]: backPressHandler,
            })
        }

        // TODO: how to handle situations like this typecasting better ?
        // this type "BackPressEventName" is given a literal string value
        const backHandler = BackHandler.addEventListener(EVENTS.HARDWARE_BACK_PRESS as BackPressEventName, backPressHandler)
        return () => backHandler.remove()
    }, [navigation, route])

    return (
        <>
            <View style={{
                height: 100, width: 100, backgroundColor: 'red', marginTop: 100,
            }}
            />
            <Button onPress={() => {
                navigation.navigate('hints_vocabulary_explaination', {
                    vocabKeyword: 'naked single',
                })
            }}
            />
        </>
    )
}

export default React.memo(HintsVocabulary_)

HintsVocabulary_.propTypes = {
    navigation: PropTypes.object,
}

HintsVocabulary_.defaultProps = {
    navigation: {},
}
