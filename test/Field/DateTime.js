import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import DateFnsUtils from '@date-io/date-fns'
import { testLifield } from './_field'

describe('DateTime', () => {
    const dateUtil = new DateFnsUtils()

    it('Render and change date input per picker', () => {
        const { field, result, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
        })

        userEvent.click(field)

        // since the value is undefined current month should be displayed in the picker
        const d = new Date()
        userEvent.click(result.getByLabelText(dateUtil.format(d, 'fullDate')))

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
    })

    it('Render and change date input per keyboard', () => {
        const { result, getActiveElement, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
        })

        const d = new Date()

        userEvent.tab()

        expect(result.getByLabelText('Year')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + d.getFullYear() + '$'))

        // next year
        fireEvent.keyDown(getActiveElement(), {key: 'ArrowUp'})
        d.setFullYear(d.getFullYear() +1)

        // next aspect
        fireEvent.keyDown(getActiveElement(), {key: 'ArrowRight'})

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
        expect(result.getByLabelText('Month')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + (d.getMonth()+1) + '$'))

        // this should jump to the next aspect
        userEvent.type(getActiveElement(), '8')
        d.setMonth(7)

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
        expect(result.getByLabelText('Day of the month')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + (d.getDate()) + '$'))

        userEvent.type(getActiveElement(), '1')

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
        expect(getActiveElement()).toHaveTextContent('01')

        userEvent.type(getActiveElement(), '7')
        d.setDate(17)

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
    })

    it('Render and change time input', () => {
        const { result, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'time',
                title: 'foo',
            },
        })

        userEvent.click(result.getByLabelText('foo'))

        userEvent.click(result.getByText('AM'))

        // ClockNumbers do not handle click events
        fireEvent.keyDown(result.getByLabelText('8 hours'), {key: ' '})
        fireEvent.keyDown(result.getByLabelText('45 minutes'), {key: ' '})

        expect(getLiformValue()).toEqual("08:45")
    })
})
