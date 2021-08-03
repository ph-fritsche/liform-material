import { compileValue } from '../../../src/Component/DateInterval/compileValue'

describe('Compile value', () => {
    it('Compile from string value', () => {
        const compiled = compileValue('P2Y3WT456M')

        expect(compiled.parsed).toEqual(expect.objectContaining({years: 2, weeks: 3, minutes: 456}))

        expect(compiled.input).toContainEqual({key: 'years', value: 2, label: 'Years'})
        expect(compiled.input).toContainEqual({key: 'months', value: 0, label: 'Months'})
        expect(compiled.input).toContainEqual({key: 'days', value: 21, label: 'Days'})
        expect(compiled.input).toContainEqual({key: 'hours', value: 0, label: 'Hours'})
        expect(compiled.input).toContainEqual({key: 'minutes', value: 456, label: 'Minutes'})
        expect(compiled.input).toContainEqual({key: 'seconds', value: 0, label: 'Seconds'})

        expect(compiled.display).toBe('2 Years 3 Weeks 456 Minutes')
    })

    it('Compile from string value with pattern', () => {
        const compiled = compileValue('-P3M', '(+|-)P(\\d+M)?(\\d+D)?')

        expect(compiled.parsed).toEqual(expect.objectContaining({sign: '-', months: 3}))

        expect(compiled.input).toContainEqual({key: 'sign', value: '-', placeholder: '+', isNumeric: false})
        expect(compiled.input).toContainEqual({key: 'months', value: 3, label: 'Months'})
        expect(compiled.input).toContainEqual({key: 'days', value: 0, label: 'Days'})

        expect(compiled.display).toBe('- 3 Months')
    })
})
