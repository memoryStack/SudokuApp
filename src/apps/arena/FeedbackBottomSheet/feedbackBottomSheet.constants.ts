export const FEEDBACK_BOTTOM_SHEET_TEST_ID = 'FEEDBACK_BOTTOM_SHEET_TEST_ID'
export const FEEDBACK_SUBMIT_BUTTON_TEST_ID = 'FEEDBACK_SUBMIT_BUTTON_TEST_ID'
export const FEEDBACK_SKIP_BUTTON_TEST_ID = 'FEEDBACK_SKIP_BUTTON_TEST_ID'
export const FEEDBACK_DND_BUTTON_TEST_ID = 'FEEDBACK_DND_BUTTON_TEST_ID'
export const FEEDBACK_TEXT_INPUT_TEST_ID = 'FEEDBACK_TEXT_INPUT_TEST_ID'

export const FEEDBACK_OPTIONS = [
    { id: 'hints', label: 'Had trouble using hints' },
    { id: 'hard', label: 'Too hard puzzles' },
] as const

export const FEEDBACK_CONTENT = {
    title: 'We are just one text away',
    description: 'We understand that you might have faced some difficulties. Let us know how we can help you solve your next puzzle.',
    inputPlaceholder: "Didn't know how to use hints",
    submitButton: 'Submit',
    skipButton: 'Next time',
    dndButton: "Don't show again",
}

export const MAX_FEEDBACK_TEXT_LENGTH = 500

export const SNACKBAR_MESSAGES = {
    success: 'We have recorded your response and will act on it shortly.',
    error: 'Failed to submit feedback. We are on it!',
}
