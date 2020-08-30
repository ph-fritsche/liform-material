import { renderLifield, testLifield } from './_field'

describe('Hidden', () => {
    it('Render hidden input', () => {
        const { form } = renderLifield({
            schema: {
                type: 'string',
                widget: 'hidden',
                title: 'foo',
            },
            value: 'bar',
        })

        expect(form).toEqualFormValues({'form': 'bar'})
    })

    it('Render errors for hidden input', () => {
        const { field } = testLifield({
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

        expect(field).toHaveTextContent('This is invalid.')
    })
})
