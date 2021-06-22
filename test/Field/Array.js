import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Array', () => {
    it('Render and change an array', () => {
        const { result, expectedFormValues, form, getLiformValue } = testLifield({
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
        expect(getLiformValue()).toEqual(['baz'])
    })

    it('Add and remove extra elements of array', () => {
        const { result, getLiformValue } = testLifield({
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
        expect(result.queryByLabelText('Remove entry')).not.toBeInTheDocument()

        userEvent.click(result.getByLabelText('Add entry'))

        expect(result.getAllByRole('textbox')).toHaveLength(2)

        userEvent.type(result.getAllByRole('textbox')[1], 'baz')

        expect(getLiformValue()).toEqual(['bar', 'baz'])

        userEvent.click(result.getByLabelText('Remove entry'))

        expect(getLiformValue()).toEqual(['bar'])
        expect(result.queryByLabelText('Remove entry')).not.toBeInTheDocument()
    })

    it('Remove and add existing elements of array', () => {
        const { result, getLiformValue } = testLifield({
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
        expect(result.queryByLabelText('Add entry')).not.toBeInTheDocument()

        userEvent.click(result.getByLabelText('Remove entry'))

        expect(result.queryByRole('textbox')).not.toBeInTheDocument()
        expect(getLiformValue()).toEqual([])

        userEvent.click(result.getByLabelText('Add entry'))

        expect(result.getByRole('textbox')).toBeInTheDocument()
        expect(result.queryByLabelText('Add entry')).not.toBeInTheDocument()
    })
})
