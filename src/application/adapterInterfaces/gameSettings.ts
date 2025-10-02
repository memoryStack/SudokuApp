export type GameSettingsAdapter = {
    allowAnyNoteInCell: () => boolean
    soundsEnabled: () => boolean
    showFeedbackOnMistake: () => boolean
}
