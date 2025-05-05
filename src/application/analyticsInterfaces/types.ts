import { ROUTES } from "@application/constants"

export type HintVisibleEventData = {
    hint: string,
    level: string,
    puzzle: string,
}

export type PuzzleLifeCycleEvent = {
    puzzle: string,
    level: string,
    status: string,
}

export type HintTryoutUsedEventData = {
    hint: string, // TODO: use enums here
}

export type ArenaAnalyticsHandler = {
    sendSmartHintVisibleEvent: (data: HintVisibleEventData) => Promise<void>,
    sendPuzzleLifeCycleEvent: (data: PuzzleLifeCycleEvent) => Promise<void>,
    sendHintTryoutUsedEvent: (data: HintTryoutUsedEventData) => Promise<void>,
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

type HomeAnalyticsHandlers = {}

export type ScreenAnalyticsHandlers = ArenaAnalyticsHandler |
    HomeAnalyticsHandlers |
    PlayGuideAnalyticsHandler |
    HintsVocobularyAnalyticsHandler

export type AllAnalyticsHandlers = Partial<Record<ROUTES, ScreenAnalyticsHandlers>>
