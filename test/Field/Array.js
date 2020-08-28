import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Array', () => {
    it('Render and change an array', () => {
        const { result, expectedFormValues, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                items: {
                    type: 'string',
                },
            },
            value: ['bar'],
        })

        const field0 = result.getByRole('textbox')

        userEvent.clear(field0)
        userEvent.type(field0, 'baz')

        expect(form).toHaveFormValues({...expectedFormValues, [field0.name]: 'baz'})
        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['baz']))
    })

    it('Add and remove extra elements of array', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                items: {
                    type: 'string',
                },
                allowAdd: true,
            },
            value: ['bar'],
        })

        result.getByRole('textbox')
        expect(result.queryAllByLabelText('Remove entry')).toHaveLength(0)

        userEvent.click(result.getByLabelText('Add entry'))

        expect(result.getAllByRole('textbox')).toHaveLength(2)

        userEvent.type(result.getAllByRole('textbox')[1], 'baz')

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['bar', 'baz']))

        userEvent.click(result.getByLabelText('Remove entry'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['bar']))
        expect(result.queryAllByLabelText('Remove entry')).toHaveLength(0)
    })

    it('Remove and add existing elements of array', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                items: {
                    type: 'string',
                },
                allowDelete: true,
            },
            value: ['bar'],
        })

        result.getByRole('textbox')
        expect(result.queryAllByLabelText('Add entry')).toHaveLength(0)

        userEvent.click(result.getByLabelText('Remove entry'))
        
        expect(result.queryAllByRole('textbox')).toHaveLength(0)
        expect(form.getAttribute('data-values')).toEqual(JSON.stringify([]))
        
        userEvent.click(result.getByLabelText('Add entry'))
        
        expect(result.getAllByRole('textbox')).toHaveLength(1)
        expect(result.queryAllByLabelText('Add entry')).toHaveLength(0)
    })
})
