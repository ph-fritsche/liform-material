import { intervalFromString, intervalToString } from '../../src/util/date'

describe('Date interval objects from string', () => {
    it('ISO 8601 intervals', () => {
        expect(intervalFromString('P12Y')).toEqual({years: 12})
        expect(intervalFromString('P12M')).toEqual({months: 12})
        expect(intervalFromString('P12W')).toEqual({weeks: 12})
        expect(intervalFromString('P12D')).toEqual({days: 12})
        expect(intervalFromString('PT12H')).toEqual({hours: 12})
        expect(intervalFromString('PT12M')).toEqual({minutes: 12})
        expect(intervalFromString('PT12S')).toEqual({seconds: 12})

        expect(intervalFromString('P1Y3M5D7WT2H4M6S')).toEqual({years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })
    })

    it('Signed intervals', () => {
        expect(intervalFromString('P-12Y')).toEqual({years: -12})
        expect(intervalFromString('P-12M')).toEqual({months: -12})
        expect(intervalFromString('P-12W')).toEqual({weeks: -12})
        expect(intervalFromString('P-12D')).toEqual({days: -12})
        expect(intervalFromString('PT-12H')).toEqual({hours: -12})
        expect(intervalFromString('PT-12M')).toEqual({minutes: -12})
        expect(intervalFromString('PT-12S')).toEqual({seconds: -12})

        expect(intervalFromString('+P1Y3M5D7WT2H4M6S')).toEqual({sign: '+', years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })
        expect(intervalFromString('-P1Y3M5D7WT2H4M6S')).toEqual({sign: '-', years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })
    })

    it('Return undefined for invalid strings', () => {
        expect(intervalFromString('foo')).toEqual(undefined)
    })
})

describe('Date interval objects to string', () => {
    it('ISO 8601 intervals', () => {
        expect(intervalToString({years: 12})).toEqual('P12Y')
        expect(intervalToString({months: 12})).toEqual('P12M')
        expect(intervalToString({days: 12})).toEqual('P12D')
        expect(intervalToString({weeks: 12})).toEqual('P12W')
        expect(intervalToString({hours: 12})).toEqual('PT12H')
        expect(intervalToString({minutes: 12})).toEqual('PT12M')
        expect(intervalToString({seconds: 12})).toEqual('PT12S')

        expect(intervalToString({years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })).toEqual('P1Y3M5D7WT2H4M6S')
    })

    it('Signed intervals', () => {
        expect(intervalToString({years: -12})).toEqual('P-12Y')
        expect(intervalToString({months: -12})).toEqual('P-12M')
        expect(intervalToString({days: -12})).toEqual('P-12D')
        expect(intervalToString({weeks: -12})).toEqual('P-12W')
        expect(intervalToString({hours: -12})).toEqual('PT-12H')
        expect(intervalToString({minutes: -12})).toEqual('PT-12M')
        expect(intervalToString({seconds: -12})).toEqual('PT-12S')

        expect(intervalToString({sign: '+', years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })).toEqual('+P1Y3M5D7WT2H4M6S')
        expect(intervalToString({sign: '-', years: 1, months: 3, days: 5, weeks: 7, hours: 2, minutes: 4, seconds: 6, })).toEqual('-P1Y3M5D7WT2H4M6S')
    })

    it('Return empty string for 0 values', () => {
        expect(intervalToString({years: 0})).toEqual('')
        expect(intervalToString({sign: '-', years: 0})).toEqual('')
    })
})
