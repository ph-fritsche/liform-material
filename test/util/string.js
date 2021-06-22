import { indexOfUnescaped, isEscaped, countUnescaped, hasUnescaped } from '../../src/util/string'

describe('Escaped characters', () => {
    it('Check if character is escaped', () => {
        expect(
            isEscaped('abc', 1),
        ).toEqual(false)

        expect(
            isEscaped('a\\bc', 2),
        ).toEqual(true)

        expect(
            isEscaped('a\\\\bc', 3),
        ).toEqual(false)

        expect(
            isEscaped('a\\\\\\bc', 4),
        ).toEqual(true)
    })

    it('Find unescaped character', () => {
        expect(
            indexOfUnescaped('abc', 'b'),
        ).toEqual(1)

        expect(
            indexOfUnescaped('a\\bcabc', 'b'),
        ).toEqual(5)

        expect(
            indexOfUnescaped('abca\\bcabc', 'b', 3),
        ).toEqual(8)
    })

    it('Return undefined if unescaped character cannot be found', () => {
        expect(
            indexOfUnescaped('abca\\bc', 'd'),
        ).toEqual(undefined)

        expect(
            indexOfUnescaped('abca\\bc', 'b', 3),
        ).toEqual(undefined)

        expect(
            indexOfUnescaped('a\\bcabc', 'b', 0, 3),
        ).toEqual(undefined)
    })

    it('Test for unescaped characters', () => {
        expect(hasUnescaped('abca\\bc', 'd')).toBe(false)
        expect(hasUnescaped('abca\\bc', 'b')).toBe(true)
        expect(hasUnescaped('a\\bcabc', 'b', 0, 3)).toBe(false)
    })

    it('Count unescaped characters', () => {
        expect(
            countUnescaped('abcabcabc', 'b'),
        ).toEqual(3)

        expect(
            countUnescaped('abcabcabc', 'b', 2),
        ).toEqual(2)

        expect(
            countUnescaped('abcabcabc', 'b', 2, 5),
        ).toEqual(1)

        expect(
            countUnescaped('abca\\bcabc', 'b'),
        ).toEqual(2)
    })
})
