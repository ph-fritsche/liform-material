import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Object', () => {
    it('Render and change an object', () => {
        const { result, expectedFormValues, form, getLiformValue } = testLifield({
            schema: {
                type: 'object',
                title: 'foo',
                properties: {
                    a: {
                        type: 'string',
                        title: 'foo-a',
                    },
                },
            },
        })

        const fieldA = result.getByLabelText('foo-a')

        userEvent.type(fieldA, 'bar')

        expect(form).toHaveFormValues({...expectedFormValues, [fieldA.name]: 'bar'})
        expect(getLiformValue()).toEqual({a: 'bar'})
    })

    it('Render without title', () => {
        const { form } = testLifield({
            schema: {
                type: 'object',
                properties: {
                    a: {
                        type: 'string',
                    },
                },
            },
        })

        expect(form).toHaveFormValues({'form[a]': ''})
    })
})
