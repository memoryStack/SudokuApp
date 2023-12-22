import React, {
    useCallback, useState, useEffect, useRef,
} from 'react'

import { View, BackHandler, BackPressEventName } from 'react-native'

import _get from '@lodash/get'
import _isNil from '@lodash/isNil'

import Button, { BUTTON_TYPES } from '@ui/molecules/Button'
import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Stack } from '@utils/classes/stack'

import SmartHintText from '@ui/molecules/SmartHintText'
import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../navigation/headerSection/headerSection.constants'
import { useTranslation } from '../../i18n/hooks/useTranslation'
import { ROUTES } from '../../navigation/route.constants'
import { EVENTS } from '../../constants/events'

import { NextGameMenu } from '../arena/nextGameMenu'

import { getStyles } from './hintsVocabulary.styles'
import { Page } from '../components/Page'
import { HINTS_VOCAB_TITLE, NAVIGATION_PARAMS } from './hintsVocabulary.constants'

/*
TODOs:
    centeralize vocabKeyword value
    read param from some kind of util so that updating navigation becomes easier
*/

const HintsVocabulary_ = ({ navigation, route }) => {
    const [currentVocabKeyword, setCurrentVocabKeyword] = useState('')

    const stack = useRef(new Stack<string>()).current

    const styles = useStyles(getStyles)

    useEffect(() => {
        const vocabKeyword = _get(route, ['params', NAVIGATION_PARAMS.VOCAB_KEYWORD])
        if (_isNil(vocabKeyword) || stack.peek() === vocabKeyword) return

        stack.push(vocabKeyword)
        setCurrentVocabKeyword(vocabKeyword)
    }, [route?.params?.vocabKeyword])

    useEffect(() => {
        if (!_isNil(currentVocabKeyword)) {
            navigation.setOptions({ title: HINTS_VOCAB_TITLE[currentVocabKeyword] || '' })
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

    const smartHintText = '<p>Please visit <a href="hidden_single">here</a>.'
    + ' some more bla blab bal and then a link <a href="naked_single">here</a> and some more text</p>'

    return (
        <Page>
            <SmartHintText
                text={smartHintText}
            />
        </Page>
    )
}

export default React.memo(HintsVocabulary_)
