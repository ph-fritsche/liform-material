import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DateTimePicker } from '../../../src/Component/DateTime/DateTimePicker'
import DateFnsUtil from '@date-io/date-fns'

const dateUtil = new DateFnsUtil()

describe('DateTimePicker', () => {
    it('Render mobile keyboard input', () => {
        const valueObject = {
            input: [
                {value: '1', placeholder: 'a', label: 'aspect A'},
                {text: ';'},
                {value: '2', placeholder: 'b', label: 'aspect B'}
            ],
            parsed: new Date(),
            display: '',
        }
        const rendered = render(<DateTimePicker dateUtil={dateUtil} onChange={() => {}} valueObject={valueObject}/>)

        userEvent.click(rendered.getByLabelText('calendar view is open, go to text input view'))

        const aspectA = rendered.getByTitle('aspect A')
        expect(aspectA).toHaveFocus()

        expect(aspectA.closest("div.MuiFormControl-root")).toHaveTextContent('a;b')
    })

    it('Highlight calendar week if the value contains week but no day', () => {
        const valueObject = {
            input: [
                {value: '1', placeholder: 'w', label: 'Week'},
            ],
            parsed: new Date(2000, 0, 12),
            display: '',
        }
        const rendered = render(<DateTimePicker dateUtil={dateUtil} onChange={() => {}} valueObject={valueObject}/>)

        const parsedDay = rendered.getByLabelText(dateUtil.format(new Date(2000, 0, 12), 'fullDate'))
        const sameWeek = rendered.getByLabelText(dateUtil.format(new Date(2000, 0, 14), 'fullDate'))
        const otherWeek = rendered.getByLabelText(dateUtil.format(new Date(2000, 0, 19), 'fullDate'))

        // Comparing the background-color fails because getComputedStyle returns wrong value for
        // window.getComputedStyle(sameWeek)['background-color']

        const isHighLightClass = expect.stringMatching(/^makeStyles-highlight-/)
        expect(Array.from(parsedDay.classList)).toContainEqual(isHighLightClass)
        expect(Array.from(sameWeek.classList)).toContainEqual(isHighLightClass)
        expect(Array.from(otherWeek.classList)).not.toContainEqual(isHighLightClass)
    })
})
