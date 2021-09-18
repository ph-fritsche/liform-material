import { commitAspect, validateAspect } from '../../../src/Component/DateTime/handleAspect'
import DateFnsUtils from '@date-io/date-fns'

const dateUtil = new DateFnsUtils()

describe('Validate aspect', () => {
    const value = {
        input: [
            {value: '2015', placeholder: 'yyyy'},
            {text: '-'},
            {value: '02', placeholder: 'MM'},
            {text: '-'},
            {value: '18', placeholder: 'dd'},
            {text: 'T'},
            {value: '19', placeholder: 'HH'},
            {text: ':'},
            {value: '20', placeholder: 'mm'},
            {text: ':'},
            {value: '21', placeholder: 'ss'},
        ],
        parsed: dateUtil.date('2015-02-18T19:20:21'),
    }

    it('Accept only values in aspect limits', () => {
        expect(validateAspect(dateUtil, value, '0003', value.input.findIndex(p => p.placeholder === 'MM'))).toBe(3)

        expect(validateAspect(dateUtil, value, '0013', value.input.findIndex(p => p.placeholder === 'MM'))).toBe(undefined)
    })

    it('Accept only valid days in the month', () => {
        expect(validateAspect(dateUtil, value, '0020', value.input.findIndex(p => p.placeholder === 'dd'))).toBe(20)

        expect(validateAspect(dateUtil, value, '0031', value.input.findIndex(p => p.placeholder === 'dd'))).toBe(undefined)
    })
})

describe('Commit aspect', () => {
    const value = {
        input: [
            {value: '2010', placeholder: 'yyyy'},
            {text: '-'},
            {value: '03', placeholder: 'MM'},
            {text: '-'},
            {value: '30', placeholder: 'dd'},
            {text: 'T'},
            {value: '12', placeholder: 'HH'},
            {text: ':'},
            {value: '13', placeholder: 'mm'},
            {text: ':'},
            {value: '14', placeholder: 'ss'},
        ],
    }

    it('Call onchange with parsed date', () => {
        const onChange = jest.fn()

        commitAspect(dateUtil, value, onChange, 20, value.input.findIndex(p => p.placeholder === 'dd'))

        expect(onChange).toBeCalledWith(dateUtil.date('2010-03-20T12:13:14'))
    })

    it('Ignore invalid dates', () => {
        const onChange = jest.fn()

        commitAspect(dateUtil, value, onChange, 32, value.input.findIndex(p => p.placeholder === 'dd'))

        expect(onChange).not.toBeCalled()
    })

    it('Correct days when month is changed', () => {
        const onChange = jest.fn()

        commitAspect(dateUtil, value, onChange, 2, value.input.findIndex(p => p.placeholder === 'MM'))

        expect(onChange).toBeCalledWith(dateUtil.date('2010-02-28T12:13:14'))
    })

    it('Expand small year numbers', () => {
        const onChange = jest.fn()

        commitAspect(dateUtil, value, onChange, 13, value.input.findIndex(p => p.placeholder === 'yyyy'))

        expect(onChange).toBeCalledWith(dateUtil.date('2013-03-30T12:13:14'))
    })
})
