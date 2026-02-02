import { act, renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { COACHMARKS } from '@application/adapterInterfaces/coachMarks'
import { CUSTOMIZE_EXPERIENCE_TOOLTIP_ID } from '../../home.constants'
import { useCustomizeExperienceTooltip } from '../useCustomizeExperienceTooltip'

jest.mock('src/i18n/hooks/useTranslation', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}))

const mockGetGamesSolvedCount = jest.fn()
jest.mock('src/adapters/inAppReviewAdapter', () => ({
    inAppReviewAdapter: {
        getGamesSolvedCount: (...args) => mockGetGamesSolvedCount(...args),
    },
}))

const createMockDependencies = (overrides = {}) => {
    const mockMarkKnown = jest.fn().mockResolvedValue(undefined)
    const mockGetState = jest.fn().mockResolvedValue({ knownTooltipIds: [] })
    return {
        coachMarksAdapter: {
            isCoachmarkShownInSession: jest.fn(() => false),
            getCustomizeExperienceTooltipState: mockGetState,
            markCustomizeExperienceTooltipKnown: mockMarkKnown,
            markCustomizeExperienceTooltipShownInSession: jest.fn(),
        },
        gameSettingsAdapter: {
            isDarkMode: jest.fn(() => false),
            fillNotesWithoutPencil: jest.fn(() => false),
            showFeedbackOnMistake: jest.fn(() => false),
            soundsEnabled: jest.fn(() => true),
            fillNumberOnCellClick: jest.fn(() => false),
        },
        ...overrides,
    }
}

describe('useCustomizeExperienceTooltip', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockGetGamesSolvedCount.mockResolvedValue(1)
    })

    test('returns show: false when dependencies is null', async () => {
        const { result, waitForNextUpdate } = renderHook(() =>
            useCustomizeExperienceTooltip(null)
        )
        await act(async () => {
            await new Promise((r) => setTimeout(r, 0))
        })
        expect(result.current.show).toBe(false)
        expect(result.current.message).toBe('')
    })

    test('returns show: false when tooltip already shown in session', async () => {
        const deps = createMockDependencies()
        deps.coachMarksAdapter.isCoachmarkShownInSession.mockReturnValue(true)

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await act(async () => {
            await new Promise((r) => setTimeout(r, 50))
        })

        expect(result.current.show).toBe(false)
        expect(deps.coachMarksAdapter.getCustomizeExperienceTooltipState).not.toHaveBeenCalled()
    })

    test('returns show: false when user has solved fewer than 1 game', async () => {
        mockGetGamesSolvedCount.mockResolvedValue(0)
        const deps = createMockDependencies()

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await act(async () => {
            await new Promise((r) => setTimeout(r, 50))
        })

        expect(result.current.show).toBe(false)
    })

    test('returns show: true with darkMode message when dark mode is off and not known', async () => {
        const deps = createMockDependencies()
        deps.gameSettingsAdapter.isDarkMode.mockReturnValue(false)

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await waitFor(() => {
            expect(result.current.show).toBe(true)
        }, { timeout: 2000 })

        expect(result.current.message).toBe(`coachmarks.customizeExperience.${CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE}`)
        expect(result.current.tooltipId).toBe(CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE)
    })

    test('skips darkMode and shows fillNotesWithoutPencil when dark mode already on', async () => {
        const deps = createMockDependencies()
        deps.gameSettingsAdapter.isDarkMode.mockReturnValue(true)
        deps.gameSettingsAdapter.fillNotesWithoutPencil.mockReturnValue(false)

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await waitFor(() => {
            expect(result.current.show).toBe(true)
        }, { timeout: 2000 })

        expect(result.current.tooltipId).toBe(CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NOTES_WITHOUT_PENCIL)
        expect(deps.coachMarksAdapter.markCustomizeExperienceTooltipKnown).toHaveBeenCalledWith(CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE)
    })

    test('returns show: false when all tooltips are already known', async () => {
        const deps = createMockDependencies()
        deps.coachMarksAdapter.getCustomizeExperienceTooltipState.mockResolvedValue({
            knownTooltipIds: [
                CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE,
                CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NOTES_WITHOUT_PENCIL,
                CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SHOW_FEEDBACK_ON_MISTAKE,
                CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.SOUNDS_ENABLED,
                CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.FILL_NUMBER_ON_CELL_CLICK,
            ],
        })

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await act(async () => {
            await new Promise((r) => setTimeout(r, 50))
        })

        expect(result.current.show).toBe(false)
    })

    test('markShown calls adapter and clears result', async () => {
        const deps = createMockDependencies()
        deps.gameSettingsAdapter.isDarkMode.mockReturnValue(false)

        const { result } = renderHook(() => useCustomizeExperienceTooltip(deps))

        await waitFor(() => {
            expect(result.current.show).toBe(true)
        }, { timeout: 2000 })

        expect(result.current.tooltipId).toBe(CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE)

        await act(async () => {
            await result.current.markShown()
        })

        expect(deps.coachMarksAdapter.markCustomizeExperienceTooltipKnown).toHaveBeenCalledWith(CUSTOMIZE_EXPERIENCE_TOOLTIP_ID.DARK_MODE)
        expect(deps.coachMarksAdapter.markCustomizeExperienceTooltipShownInSession).toHaveBeenCalled()
        expect(result.current.show).toBe(false)
        expect(result.current.tooltipId).toBe(null)
    })
})
