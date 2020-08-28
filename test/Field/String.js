import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('String', () => {
    it('Render and change string input', () => {
        const { field, form, expectedFormValues } = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
            },
            value: 'bar',
        })

        userEvent.clear(field)
        userEvent.type(field, 'baz')

        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 'baz'})

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify('baz'))
    })
})
