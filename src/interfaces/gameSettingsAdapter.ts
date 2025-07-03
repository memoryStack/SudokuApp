import type {
    GameSettingsAdapter as ApplicationLayerGameSettingsAdapter
} from "@application/adapterInterfaces/gameSettings";

export interface GameSettingsAdapter extends ApplicationLayerGameSettingsAdapter {
    fillNoteOnShortClick: () => Promise<boolean>
    highlightCells: () => boolean
    highlightNumbersFonts: () => boolean
    soundsEnabled: () => boolean
    showTimer: () => boolean
    getMistakesLimit: () => number
    remindToTakeHint: () => boolean
}
