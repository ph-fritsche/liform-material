import { fireEvent } from '@testing-library/react'
import { renderLifield } from './_field'

describe('Hidden', () => {
    it('Render and change hidden input', () => {
        const { form, expectedFormValues, getLiformValue } = renderLifield({
            schema: {
                type: 'string',
                widget: 'hidden',
                title: 'foo',
            },
            value: 'bar',
        })

        expect(form).toEqualFormValues({'form': 'bar'})

        const input = form.querySelector('input[name=form]')

        fireEvent.change(input, {target: {value: 'baz'}})
        fireEvent.blur(input)

        expect(form).toHaveFormValues({...expectedFormValues, 'form': 'baz'})

        expect(getLiformValue()).toEqual('baz')
    })

    it('Render errors for hidden input', () => {
        const { form } = renderLifield({
            schema: {
                type: 'string',
                widget: 'hidden',
                title: 'foo',
            },
            value: 'bar',
            meta: {
                errors: {
                    '': ['This is invalid.'],
                },
            }
        })

        expect(form).toEqualFormValues({'form': 'bar'})

        expect(form).toHaveTextContent('This is invalid.')
    })
})
