import React, { useState, useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { View, TextInput, KeyboardAvoidingView } from 'react-native'

import _noop from '@lodash/noop'

import Text, { TEXT_VARIATIONS } from '@ui/atoms/Text'
import Button from '@ui/molecules/Button'
import SelectablePill from '@ui/atoms/SelectablePill'
import { BUTTON_TYPES } from '@ui/molecules/Button/button.constants'
import { BottomDragger } from '../../components/BottomDragger'
import { useStyles } from '@utils/customHooks/useStyles'

import { getStyles } from './feedbackBottomSheet.styles'
import {
    FEEDBACK_BOTTOM_SHEET_TEST_ID,
    FEEDBACK_SUBMIT_BUTTON_TEST_ID,
    FEEDBACK_SKIP_BUTTON_TEST_ID,
    FEEDBACK_DND_BUTTON_TEST_ID,
    FEEDBACK_TEXT_INPUT_TEST_ID,
    FEEDBACK_OPTIONS,
    FEEDBACK_CONTENT,
    MAX_FEEDBACK_TEXT_LENGTH,
} from './feedbackBottomSheet.constants'

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
}

const FeedbackBottomSheet_ = forwardRef<FeedbackBottomSheetRef, Props>(({
    parentHeight,
    onSubmit,
    onSkip,
    onDND,
    onClosed = _noop,
}, ref) => {
    const styles = useStyles(getStyles)
    const bottomDraggerRef = useRef<{ openDragger: () => void; closeDragger: () => void }>(null)

    const [selectedOptions, setSelectedOptions] = useState<string[]>([])
    const [additionalFeedback, setAdditionalFeedback] = useState('')
    const [isTextInputFocused, setIsTextInputFocused] = useState(false)

    useImperativeHandle(ref, () => ({
        open: () => bottomDraggerRef.current?.openDragger(),
        close: () => bottomDraggerRef.current?.closeDragger(),
    }), [])

    const resetState = useCallback(() => {
        setSelectedOptions([])
        setAdditionalFeedback('')
        setIsTextInputFocused(false)
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
    )

    const renderTextInput = () => (
        <View style={styles.textInputContainer}>
            <TextInput
                style={[
                    styles.textInput,
                    isTextInputFocused && styles.textInputFocused,
                ]}
                placeholder={FEEDBACK_CONTENT.inputPlaceholder}
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
                    label={FEEDBACK_CONTENT.dndButton}
                    onPress={handleDND}
                    type={BUTTON_TYPES.OUTLINED}
                    containerStyle={styles.outlinedButton}
                    testID={FEEDBACK_DND_BUTTON_TEST_ID}
                />
                <Button
                    label={FEEDBACK_CONTENT.skipButton}
                    onPress={handleSkip}
                    type={BUTTON_TYPES.OUTLINED}
                    containerStyle={styles.outlinedButton}
                    testID={FEEDBACK_SKIP_BUTTON_TEST_ID}
                />
            </View>
            <Button
                label={FEEDBACK_CONTENT.submitButton}
                onPress={handleSubmit}
                containerStyle={styles.submitButton}
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
                    {FEEDBACK_CONTENT.title}
                </Text>
                <Text style={styles.description} type={TEXT_VARIATIONS.BODY_LARGE}>
                    {FEEDBACK_CONTENT.description}
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
