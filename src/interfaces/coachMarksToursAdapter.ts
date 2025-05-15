import type {
    CoachMarksAdapter as ApplicationLayerCoachMarksAdapter
} from '@application/adapterInterfaces/coachMarks'

export interface CoachMarksAdapterUIInterface extends ApplicationLayerCoachMarksAdapter {
    setUserLearnedToGetHints: () => Promise<void>
}
