import { COMPLETED_GAME_STATS } from "@application/adapterInterfaces/gameLevels"
import { PENCIL_STATE, ROUTES } from "@application/constants"

export type HintVisibleEventData = {
    hint: string,
    level: string,
    puzzle: string,
}

type GameStats = Omit<COMPLETED_GAME_STATS, 'level' | 'levelNum'>

export type PuzzleLifeCycleEvent = {
    puzzle: string,
    level: string,
    status: string,
    stats?: GameStats
}

export type HintTryoutUsedEventData = {
    hint: string, // TODO: use enums here
}

export type PencilClickEventData = {
    statusAfterClick: PENCIL_STATE
}

export type NoHintsFoundEventData = {
    originalPuzzle: string,
    puzzleCurrentState: {
        mainNumbers: string,
        notes: { [key: string]: number[] }
    }
}

export type CoachmarkStepChangeEventData = {
    name: string,
    position: number
}

export type HintsMenuTooltipShownEventData = {
    count: number
}

export type ArenaAnalyticsHandler = {
    sendSmartHintVisibleEvent: (data: HintVisibleEventData) => Promise<void>,
    sendPuzzleLifeCycleEvent: (data: PuzzleLifeCycleEvent) => Promise<void>,
    sendHintTryoutUsedEvent: (data: HintTryoutUsedEventData) => Promise<void>,
    sendPencilClickEvent: (data: PencilClickEventData) => Promise<void>,
    sendFastPencilClickEvent: () => Promise<void>,
    sendNoHintsFoundEvent: (data: NoHintsFoundEventData) => Promise<void>,
    sendUndoClickEvent: () => Promise<void>,
    sendHowToGetHintsCoachmarkVisibleEvent: () => Promise<void>,
    sendHowToGetHintsCoachmarkStepChangeEvent: (data: CoachmarkStepChangeEventData) => Promise<void>,
    sendHowToGetHintsCoachmarkCompletedEvent: () => Promise<void>,
    sendNeedHintSuggestionConfirmEvent: () => Promise<void>,
    sendDNDByHintSuggestionEvent: () => Promise<void>,
    sendHintsMenuTooltipShownEvent: (data: HintsMenuTooltipShownEventData) => Promise<void>,
}

export type PlayGuideEventData = {
    status: PlayGuideStates,
    percentageCompleted?: number,
}

export enum PlayGuideStates {
    OPENED = 'OPENED',
    READ_PERCENTAGE = 'READ_PERCENTAGE',
    READ_COMPLETE = 'READ_COMPLETE',
}

export type PlayGuideAnalyticsHandler = {
    sendPlayGuideOpenedEvent: () => Promise<void>,
}

export type HintVocabularyViewData = {
    vocabulary: string
}

export type HintsVocobularyAnalyticsHandler = {
    sendVocabularyViewEvent: (data: HintVocabularyViewData) => Promise<void>,
}

export type HomeAnalyticsHandlers = {
    sendUpdateCancelledEvent: () => Promise<void>,
    sendUpdateConfirmedEvent: () => Promise<void>,
}

export type GameSettingsAnalyticsHandlers = {
    sendScreenVisitedEvent: () => Promise<void>,
    sendOnChangeOptionEvent: ({ option, value }: { option: string, value: any }) => Promise<void>
}

export type ScreenAnalyticsHandlers = ArenaAnalyticsHandler
    | HomeAnalyticsHandlers
    | PlayGuideAnalyticsHandler
    | HintsVocobularyAnalyticsHandler
    | GameSettingsAnalyticsHandlers

export type AllAnalyticsHandlers = Partial<Record<ROUTES, ScreenAnalyticsHandlers>>
