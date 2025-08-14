import type {
    CoachMarksAdapter as ApplicationLayerCoachMarksAdapter,
    COACHMARKS
} from '@application/adapterInterfaces/coachMarks'

export interface CoachMarksAdapterUIInterface extends ApplicationLayerCoachMarksAdapter {
    setUserLearnedToGetHints: () => Promise<void>
    isCoachmarkShownInSession: (coachmark: COACHMARKS) => boolean
}
