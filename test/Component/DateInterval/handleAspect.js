import { validateAspect, commitAspect } from '../../../src/Component/DateInterval/handleAspect'

describe('Validate aspect', () => {
    const aspects = [
        {},
        {key: 'sign'},
    ]

    it('Validate numeric aspect', () => {
        expect(validateAspect(aspects, 123, 0)).toBe(123)
        expect(validateAspect(aspects, '123', 0)).toBe('123')
        expect(validateAspect(aspects, 'foo', 0)).toBe(undefined)
    })

    it('Validate sign aspect', () => {
        expect(validateAspect(aspects, '+', 1)).toBe('+')
        expect(validateAspect(aspects, '-', 1)).toBe('-')

        // rollover for toggling with arrow keys
        expect(validateAspect(aspects, String.fromCharCode('+'.charCodeAt() - 1), 1)).toBe('-')
        expect(validateAspect(aspects, String.fromCharCode('-'.charCodeAt() + 1), 1)).toBe('+')

        expect(validateAspect(aspects, '123', 1)).toBe(undefined)
        expect(validateAspect(aspects, 'f', 1)).toBe(undefined)
    })
})

describe('Commit aspect', () => {
    const aspects = [
        {key: 'formatter'},
        {key: 'foo', value: undefined},
        {key: 'bar', value: 123},
        {key: 'baz', value: undefined},
    ]

    it('Call onChange with object', () => {
        const onChange = jest.fn()

        commitAspect(aspects, onChange, 456, 3)

        expect(onChange).toHaveBeenLastCalledWith({foo: 0, bar: 123, baz: 456})
    })
})
