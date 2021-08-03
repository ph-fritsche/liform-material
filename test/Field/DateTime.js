import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import DateFnsUtils from '@date-io/date-fns'
import { testLifield } from './_field'
import { FakeMouseEvent } from '../_mouseevent'

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

    it('Render and change date input per arrow keys', () => {
        const { result, getActiveElement, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
            value: '2003-04-05',
        })

        const d = new Date('2003-04-05')

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
    })

    it('Render and change date input per typing', () => {
        const { result, getActiveElement, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
            value: '2001-02-03',
        })

        const d = new Date('2001-02-03')

        userEvent.tab()
        userEvent.click(result.getByLabelText('Month'))

        expect(result.getByLabelText('Month')).toHaveFocus()

        // this should jump to the next aspect
        // can not use userEvent.type due to https://github.com/testing-library/user-event/issues/442
        // userEvent.type(getActiveElement(), '8')
        fireEvent.input(getActiveElement(), {target: {textContent: '8'}})
        d.setMonth(7)

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
        expect(result.getByLabelText('Day of the month')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + (d.getDate()) + '$'))

        // userEvent.type(getActiveElement(), '1')
        fireEvent.input(getActiveElement(), {target: {textContent: '1'}})

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
        expect(getActiveElement()).toHaveTextContent('01')

        // userEvent.type(getActiveElement(), '7')
        fireEvent.input(getActiveElement(), {target: {textContent: '17'}})
        d.setDate(17)

        expect(getLiformValue()).toEqual(dateUtil.formatByString(d, 'yyyy-MM-dd'))
    })

    it('Render and change time input', async () => {
        const { result, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'time',
                title: 'foo',
            },
            value: '13:14',
        })

        userEvent.click(result.getByLabelText('foo'))

        userEvent.click(result.getByText('AM'))

        // The material-ui clock determines the selected value only per mouse/touch position
        // The event target is the first sibling of the accessible element
        // https://github.com/mui-org/material-ui/blob/2748e3c37ccbe0d152f608f847090edd6228c76b/packages/material-ui-lab/src/ClockPicker/Clock.tsx#L248-L256
        fireEvent(
            result.getByLabelText(/Select hours/i).parentElement.firstElementChild,
            new FakeMouseEvent('mouseup', {
                offsetX: 31,
                offsetY: 156,
            },
            ))
        fireEvent(
            result.getByLabelText(/Select minutes/i).parentElement.firstElementChild,
            new FakeMouseEvent('mouseup', {
                offsetX: 18,
                offsetY: 110,
            },
            ))

        expect(getLiformValue()).toEqual('08:45')
    })
})
