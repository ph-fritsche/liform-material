import DateFns from '@material-ui/pickers/adapter/date-fns'
import { placeholdersFromFormat, buildPickerViews, buildInputAspects, compileValue, aspectsFromPlaceholders, buildDisplayFormats } from '../../src/DateTime/compileValue'

const dateUtil = new DateFns()

const aspectsString = (aspects, showPlaceholders) => {
    return aspects
        .map(a => a.placeholder
            ? showPlaceholders
                ? '{' + a.placeholder + '}'
                : a.value
            : a.text
        )
        .join('')
}

describe('Compile value', () => {
    it('Get placeholders from format', () => {
        expect(placeholdersFromFormat("'foo'y-'bar'-MM-do")).toEqual(['y', 'MM', 'do'])
    })

    it('Get aspects from placeholders', () => {
        expect(aspectsFromPlaceholders(['yyy', 'MM', 'do'])).toEqual({date: ['yyyy', 'MM', 'dd'], time: []})

        /* @see https://github.com/dmtrKovalenko/date-io/issues/412
        expect(aspectsFromPlaceholders(['YYY', 'w', 's', 'SSS'])).toEqual({date: ['YYYY', 'ww'], time: ['ss', 'SSS']})
        expect(aspectsFromPlaceholders(['Y', 'D'])).toEqual({date: ['YYYY', 'DDD'], time: []})
        */

        expect(aspectsFromPlaceholders(['P'])).toEqual({date: ['yyyy', 'MM', 'dd'], time: []})
        expect(aspectsFromPlaceholders(['p'])).toEqual({date: [], time: ['HH', 'mm', 'ss']})
        expect(aspectsFromPlaceholders(['t'])).toEqual({date: ['yyyy', 'MM', 'dd'], time: ['HH', 'mm', 'ss']})
    })

    it('Build picker views', () => {
        expect(buildPickerViews(['y', 'M'])).toEqual(['year', 'month'])
        expect(buildPickerViews(['Y', 'w'])).toEqual(['year', 'month', 'date'])
        expect(buildPickerViews(['y', 'D'])).toEqual(['year', 'month', 'date'])
        expect(buildPickerViews(['y', 'H'])).toEqual(['year', 'hours'])
        expect(buildPickerViews(['t'])).toEqual(['year', 'month', 'date', 'hours', 'minutes', 'seconds'])
    })

    it('Build input aspects', () => {
        expect(aspectsString(buildInputAspects({date: ['yyyy', 'MM'], time: []}), true)).toBe('{yyyy}-{MM}')
        expect(aspectsString(buildInputAspects({date: ['YYYY', 'ww'], time: []}), true)).toBe('{YYYY}-W{ww}')
        expect(aspectsString(buildInputAspects({date: ['yyyy'], time: ['HH']}), true)).toBe('{yyyy}  {HH}')
    })

    it('Build display formats', () => {
        expect(buildDisplayFormats({date: ['yyyy', 'MM', 'dd'], time: []})).toEqual({date: 'fullDate', time: ''})
        expect(buildDisplayFormats({date: [], time: ['HH', 'mm', 'ss']})).toEqual({date: '', time: 'fullTime'})
        expect(buildDisplayFormats({date: ['YYYY', 'Q'], time: []})).toEqual({date: "YYYY', Q 'Q", time: ''})
    })

    it('Compile value', () => {
        let valueFormat
        let valueProp
        let value

        valueProp = '2010-11-12T09:08:07+06:30'
        valueFormat = undefined
        value = compileValue(dateUtil, valueProp, valueFormat)

        expect(typeof(value.parsed)).toBe('object')
        expect(Array.isArray(value.input)).toBe(true)
        expect(typeof(value.display)).toBe('string')
        expect(dateUtil.isEqual(value.parsed, dateUtil.date(valueProp))).toBe(true)
        expect(aspectsString(value.input, true)).toEqual('{yyyy}-{MM}-{dd}  {HH}:{mm}:{ss}')
        expect(aspectsString(value.input, false)).toMatch(/^\d{4}-\d{2}-\d{2}  \d{2}:\d{2}:\d{2}$/)
        expect(Date.parse(aspectsString(value.input, false))).toEqual(Date.parse(valueProp))
        // default locale is en-US
        expect(value.display).toMatch(/^\w{3} \d{1,2}, \d{4}\t\d{1,2}:\d{2} [AP]M$/)

        /* @see https://github.com/dmtrKovalenko/date-io/issues/412
        valueProp = '2010-W11'
        valueFormat = "YYYY-'W'ww"
        value = compileValue(dateUtil, valueProp, valueFormat)

        expect(dateUtil.isEqual(value.parsed, dateUtil.date(valueProp))).toBe(true)
        expect(aspectsString(value.input, true)).toEqual('{YYYY}-W{ww}')
        expect(aspectsString(value.input, false)).toMatch(/^\d{4}-W\d{2}$/)
        */
    })
})
