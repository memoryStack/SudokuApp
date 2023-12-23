import React, { useState, useEffect, useRef } from 'react'

import {
    BackHandler, BackPressEventName, ScrollView, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native'

import _get from '@lodash/get'
import _isNil from '@lodash/isNil'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'

import { useStyles } from '@utils/customHooks/useStyles'
import { Stack } from '@utils/classes/stack'

import _noop from '@lodash/noop'
import { HEADER_ITEMS, HEADER_ITEMS_PRESS_HANDLERS_KEYS } from '../../navigation/headerSection/headerSection.constants'

import { EVENTS } from '../../constants/events'

import { getStyles } from './hintsVocabulary.styles'
import { Page } from '../components/Page'
import { HINTS_VOCAB_TITLE, NAVIGATION_PARAMS } from './hintsVocabulary.constants'

import { VOCAB_COMPONENTS } from './vocabExplainations'

type ScrollEventType = NativeSyntheticEvent<NativeScrollEvent>;

type StackEntry = {
    keyword: string
    scrollPosition: number
}

const HintsVocabulary_ = ({ navigation, route }) => {
    const [currentVocab, setCurrentVocabKeyword] = useState<StackEntry>({ keyword: '', scrollPosition: 0 })

    const scrollViewRef = useRef(null)
    const scrollPosition = useRef(0)

    const stack = useRef(new Stack<StackEntry>()).current

    const styles = useStyles(getStyles)

    useEffect(() => {
        const vocabKeyword = _get(route, ['params', NAVIGATION_PARAMS.VOCAB_KEYWORD])
        if (_isNil(vocabKeyword) || stack.peek()?.keyword === vocabKeyword) return

        const previousVocab = stack.pop()
        if (!_isNil(previousVocab)) {
            stack.push({
                ...previousVocab,
                scrollPosition: scrollPosition.current,
            } as StackEntry)
        }

        const newVocab = { keyword: vocabKeyword, scrollPosition: 0 }
        stack.push(newVocab)
        setCurrentVocabKeyword(newVocab)
    }, [route?.params?.[NAVIGATION_PARAMS.VOCAB_KEYWORD]])

    useEffect(() => {
        if (currentVocab.keyword) {
            navigation.setOptions({ title: HINTS_VOCAB_TITLE[currentVocab.keyword] || 'Not Found' })
            const scrollHandler = _get(scrollViewRef, 'current.scrollTo', _noop)
            scrollHandler({ x: 0, y: currentVocab.scrollPosition, animated: true })
        }
    }, [navigation, currentVocab])

    useEffect(() => {
        const backPressHandler = () => {
            if (stack.length() === 1) {
                navigation.goBack()
            } else {
                stack.pop()
                setCurrentVocabKeyword(stack.peek() as StackEntry)
                navigation.setParams({
                    [NAVIGATION_PARAMS.VOCAB_KEYWORD]: stack.peek()?.keyword,
                })
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

    const renderNoExplainationFound = () => (
        <Text type={TEXT_VARIATIONS.DISPLAY_SMALL} style={styles.notFoundText}>
            {'Oops! Couldn\'t find what you were looking for.'}
        </Text>
    )

    const renderVocabularyExplaination = () => {
        const VocabComponent = VOCAB_COMPONENTS[currentVocab.keyword]
        if (_isNil(VocabComponent)) return renderNoExplainationFound()
        return <VocabComponent />
    }

    const handleOnScroll = ({ nativeEvent: { contentOffset: { y = 0 } = {} } = {} } = {} as ScrollEventType) => {
        scrollPosition.current = y
    }

    return (
        <Page style={styles.page}>
            <ScrollView ref={scrollViewRef} onScroll={handleOnScroll}>
                {renderVocabularyExplaination()}
            </ScrollView>
        </Page>
    )
}

export default React.memo(HintsVocabulary_)
