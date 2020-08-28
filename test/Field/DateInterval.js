import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { moveFocus } from '../_dom'
import { testLifield } from './_field'

describe('DateInterval', () => {
    it('Render and change DateInterval', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'string',
                widget: 'dateinterval',
                title: 'foo',
            },
        })

        userEvent.click(result.getByLabelText('foo'))

        userEvent.type(result.getByLabelText('Years'), '12', {skipClick: true})

        moveFocus(result.getByLabelText('Days'))

        userEvent.type(result.getByLabelText('Days'), '34', {skipClick: true})

        moveFocus(result.getByLabelText('Minutes'))

        userEvent.type(result.getByLabelText('Minutes'), '56', {skipClick: true})

        fireEvent.blur(result.getByLabelText('Minutes'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify("P12Y34DT56M"))
    })
})
