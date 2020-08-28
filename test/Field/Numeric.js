import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { testLifield } from './_field'

describe('Numeric input', () => {
    it('Render and change number input', () => {
        const { field, form, expectedFormValues } = testLifield({
            schema: {
                type: 'number',
                title: 'foo',
                step: .2,
            },
            value: 456,
        })

        userEvent.type(field, '{backspace}{backspace}{backspace}')

        expect(form.getAttribute('data-values')).toBe(null)
        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: null})

        userEvent.type(field, '456')
        
        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 456})

        fireEvent.change(field, {target: {value: 456.75}})

        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 456.75})
        
        userEvent.click(form)

        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 456.8})
    })

    it('Render and change integer input', () => {
        const { field, form, expectedFormValues } = testLifield({
            schema: {
                type: 'integer',
                title: 'foo',
            },
            value: 123,
        })

        userEvent.type(field, '{backspace}{backspace}{backspace}')

        expect(form.getAttribute('data-values')).toBe(null)
        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: null})

        userEvent.type(field, '456')

        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 456})

        fireEvent.change(field, {target: {value: 456.7}})

        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: 456})
    })
})
