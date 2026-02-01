import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react'
import { View, TextInput, KeyboardAvoidingView } from 'react-native'

import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import Button from '@ui/molecules/Button'
import SelectablePill from '@ui/atoms/SelectablePill'
import { BUTTON_TYPES, BUTTON_STATES } from '@ui/molecules/Button/button.constants'
import { BottomDragger } from '../../components/BottomDragger'
import { useStyles } from '@utils/customHooks/useStyles'
import { useTranslation } from '../../../i18n/hooks/useTranslation'

import { getStyles } from './feedbackBottomSheet.styles'
import {
    FEEDBACK_BOTTOM_SHEET_TEST_ID,
    FEEDBACK_SUBMIT_BUTTON_TEST_ID,
    FEEDBACK_SKIP_BUTTON_TEST_ID,
    FEEDBACK_DND_BUTTON_TEST_ID,
    FEEDBACK_TEXT_INPUT_TEST_ID,
    MAX_FEEDBACK_TEXT_LENGTH,
} from './feedbackBottomSheet.constants'

const BORDER_HIGHLIGHT_DURATION_MS = 200
const BORDER_HIGHLIGHT_CYCLES = 2

export interface FeedbackBottomSheetRef {
    open: () => void
    close: () => void
}

interface Props {
    parentHeight: number
    onSubmit: (improvements: string[], additionalFeedback: string) => void
    onSkip: () => void
    onDND: () => void
    onClosed?: () => void
    onShowValidationMessage?: (message: string) => void
}

const FeedbackBottomSheet_ = forwardRef<FeedbackBottomSheetRef, Props>(({
    parentHeight,
    onSubmit,
    onSkip,
    onDND,
    onClosed = _noop,
    onShowValidationMessage = _noop,
}, ref) => {
    const styles = useStyles(getStyles)
    const { t } = useTranslation('arena')
    const bottomDraggerRef = useRef<{ openDragger: () => void; closeDragger: () => void }>(null)
    const borderHighlightTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

    const FEEDBACK_OPTIONS: { id: string; label: string }[] = [
        { id: 'hints', label: t('feedback.options.hints', 'Had trouble using hints') },
        { id: 'hard', label: t('feedback.options.hard', 'Too hard puzzles') },
    ]

    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [additionalFeedback, setAdditionalFeedback] = useState('')
    const [isTextInputFocused, setIsTextInputFocused] = useState(false)
    const [highlightBorders, setHighlightBorders] = useState(false)

    const hasInput = selectedOptions.length > 0 || additionalFeedback.trim().length > 0

    useImperativeHandle(ref, () => ({
        open: () => bottomDraggerRef.current?.openDragger(),
        close: () => bottomDraggerRef.current?.closeDragger(),
    }), [])

    useEffect(() => {
        return () => {
            borderHighlightTimeoutsRef.current.forEach(clearTimeout)
        }
    }, [])

    const triggerBorderHighlight = useCallback(() => {
        borderHighlightTimeoutsRef.current.forEach(clearTimeout)
        borderHighlightTimeoutsRef.current = []
        setHighlightBorders(true)
        const timeouts: ReturnType<typeof setTimeout>[] = []
        for (let i = 0; i < BORDER_HIGHLIGHT_CYCLES * 2 - 1; i++) {
            const delay = (i + 1) * BORDER_HIGHLIGHT_DURATION_MS
            timeouts.push(setTimeout(() => {
                setHighlightBorders(prev => !prev)
            }, delay))
        }
        borderHighlightTimeoutsRef.current = timeouts
    }, [])

    const resetState = useCallback(() => {
        setSelectedOptions([])
        setAdditionalFeedback('')
        setIsTextInputFocused(false)
        setHighlightBorders(false)
    }, [])

    const handleOptionPress = useCallback((optionId: string) => {
        setSelectedOptions(prev => {
            if (prev.includes(optionId)) {
                return prev.filter(id => id !== optionId)
            }
            return [...prev, optionId]
        })
    }, [])

    const handleSubmit = useCallback(() => {
        const improvements = selectedOptions.map(id => {
            const option = FEEDBACK_OPTIONS.find(opt => opt.id === id)
            return option?.label || ''
        }).filter(Boolean)

        onSubmit(improvements, additionalFeedback.trim())
        resetState()
        bottomDraggerRef.current?.closeDragger()
    }, [selectedOptions, additionalFeedback, onSubmit, resetState])

    const handleSubmitPress = useCallback(() => {
        if (hasInput) {
            handleSubmit()
        } else {
            triggerBorderHighlight()
            onShowValidationMessage(t('feedback.snackbar.pleaseProvideInput', 'Please provide your inputs here'))
        }
    }, [hasInput, handleSubmit, triggerBorderHighlight, onShowValidationMessage, t])

    const handleSkip = useCallback(() => {
        onSkip()
        resetState()
        bottomDraggerRef.current?.closeDragger()
    }, [onSkip, resetState])

    const handleDND = useCallback(() => {
        onDND()
        resetState()
        bottomDraggerRef.current?.closeDragger()
    }, [onDND, resetState])

    const handleDraggerClosed = useCallback(() => {
        resetState()
        onClosed()
    }, [resetState, onClosed])

    const renderPills = () => (
        <View style={[styles.pillsContainerWrapper, highlightBorders && styles.pillsContainerWrapperHighlight]}>
            <View style={styles.pillsContainer}>
                {FEEDBACK_OPTIONS.map(option => (
                    <SelectablePill
                        key={option.id}
                        label={option.label}
                        selected={selectedOptions.includes(option.id)}
                        onPress={() => handleOptionPress(option.id)}
                        testID={`FEEDBACK_PILL_${option.id.toUpperCase()}`}
                    />
                ))}
            </View>
        </View>
    )

    const renderTextInput = () => (
        <View style={styles.textInputContainer}>
            <TextInput
                style={[
                    styles.textInput,
                    isTextInputFocused && styles.textInputFocused,
                    highlightBorders && styles.textInputHighlight,
                ]}
                placeholder={t('feedback.inputPlaceholder', "Didn't know how to use hints") as string}
                placeholderTextColor={styles.placeholderTextColor.color}
                value={additionalFeedback}
                onChangeText={setAdditionalFeedback}
                onFocus={() => setIsTextInputFocused(true)}
                onBlur={() => setIsTextInputFocused(false)}
                multiline
                maxLength={MAX_FEEDBACK_TEXT_LENGTH}
                testID={FEEDBACK_TEXT_INPUT_TEST_ID}
            />
            <Text style={styles.characterCount} type={TEXT_VARIATIONS.LABEL_SMALL}>
                {additionalFeedback.length}/{MAX_FEEDBACK_TEXT_LENGTH}
            </Text>
        </View>
    )

    const renderButtons = () => (
        <View style={styles.buttonsContainer}>
            <View style={styles.noFeedbackButtonsContainer}>
                <Button
                    label={t('common:dontShowAgain', "Don't show again") as string}
                    onPress={handleDND}
                    type={BUTTON_TYPES.OUTLINED}
                    containerStyle={styles.outlinedButton}
                    testID={FEEDBACK_DND_BUTTON_TEST_ID}
                />
                <Button
                    label={t('common:nextTime', 'Next time') as string}
                    onPress={handleSkip}
                    type={BUTTON_TYPES.OUTLINED}
                    containerStyle={styles.outlinedButton}
                    testID={FEEDBACK_SKIP_BUTTON_TEST_ID}
                />
            </View>
            <Button
                label={t('common:submit', 'Submit') as string}
                onPress={handleSubmitPress}
                state={BUTTON_STATES.ENABLED}
                containerStyle={[styles.submitButton, !hasInput && styles.submitButtonVisuallyDisabled]}
                textStyles={!hasInput ? styles.submitButtonLabelVisuallyDisabled : undefined}
                testID={FEEDBACK_SUBMIT_BUTTON_TEST_ID}
            />
        </View>
    )

    return (
        <BottomDragger
            ref={bottomDraggerRef}
            parentHeight={parentHeight}
            onDraggerClosed={handleDraggerClosed}
            stopBackgroundClickClose
            testID={FEEDBACK_BOTTOM_SHEET_TEST_ID}
        >

            <View style={styles.container}>
                <Text style={styles.title} type={TEXT_VARIATIONS.TITLE_LARGE}>
                    {t('feedback.title', 'We are just one text away')}
                </Text>
                <Text style={styles.description} type={TEXT_VARIATIONS.BODY_LARGE}>
                    {t('feedback.description', 'We understand that you might have faced some difficulties. Let us know how we can help you solve your next puzzle.')}
                </Text>
                {renderPills()}
                <KeyboardAvoidingView behavior={'padding'}>
                    {renderTextInput()}
                </KeyboardAvoidingView>
                {renderButtons()}
            </View>

        </BottomDragger>
    )
})

export const FeedbackBottomSheet = React.memo(FeedbackBottomSheet_)
