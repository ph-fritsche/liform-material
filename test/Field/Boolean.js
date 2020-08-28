import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Boolean', () => {
    it('Render and change a check input', () => {
        const { field, form, expectedFormValues } = testLifield({
            schema: {
                type: 'boolean',
                title: 'foo',
            },
            value: false,
        })

        userEvent.click(field)
    
        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: true})

        userEvent.click(field)
    
        expect(form).toHaveFormValues({...expectedFormValues, [field.name]: false})
    })
})
