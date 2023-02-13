import { getNotesColors } from './remotePairs'

describe('getNotesColors()', () => {
    test('returns an object of notes as keys and their color as value', () => {
        const remotePairsNotes = [1, 2]
        const returnValueSchema = {
            1: expect.any(String),
            2: expect.any(String),
        }
        expect(getNotesColors(remotePairsNotes)).toEqual(returnValueSchema)
    })
})
