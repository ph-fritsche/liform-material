import { testLifield } from './_field'
import { fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Basic input', () => {
    it('Render and change string input', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
            },
            value: 'bar',
        })

        fireEvent.change(rendered.field, {target: {value: 'baz'}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 'baz'})
    })

    it('Render and change number input', () => {
        const rendered = testLifield({
            schema: {
                type: 'number',
                title: 'foo',
                step: .2,
            },
            value: 123,
        })

        fireEvent.change(rendered.field, {target: {value: 456}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456})

        fireEvent.change(rendered.field, {target: {value: 456.75}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456.75})
        
        fireEvent.blur(rendered.field)

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456.8})
    })

    it('Render and change integer input', () => {
        const rendered = testLifield({
            schema: {
                type: 'integer',
                title: 'foo',
            },
            value: 123,
        })

        fireEvent.change(rendered.field, {target: {value: 456}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456})

        fireEvent.change(rendered.field, {target: {value: 456.7}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456})
    })

    it('Render and change a check input', () => {
        const rendered = testLifield({
            schema: {
                type: 'boolean',
                title: 'foo',
            },
            value: false,
        })

        fireEvent.click(rendered.field)
    
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: true})

        fireEvent.click(rendered.field)
    
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: false})
    })
})

describe('Complex types', () => {
    it('Render and change an array', () => {
        const rendered = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                items: {
                    type: 'string',
                },
            },
            value: ['bar'],
        })

        const field0 = rendered.result.getByRole('textbox')

        fireEvent.change(field0, {target: {value: 'baz'}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [field0.name]: 'baz'})
        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['baz']))
    })

    it('Add and remove extra elements of array', () => {
        const rendered = testLifield({
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

        rendered.result.getByRole('textbox')
        expect(rendered.result.queryAllByLabelText('Remove entry')).toHaveLength(0)

        fireEvent.click(rendered.result.getByLabelText('Add entry'))

        expect(rendered.result.getAllByRole('textbox')).toHaveLength(2)

        fireEvent.change(rendered.result.getAllByRole('textbox')[1], {target: {value: 'baz'}})

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['bar', 'baz']))

        fireEvent.click(rendered.result.getByLabelText('Remove entry'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['bar']))
        expect(rendered.result.queryAllByLabelText('Remove entry')).toHaveLength(0)
    })

    it('Remove and add existing elements of array', () => {
        const rendered = testLifield({
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

        rendered.result.getByRole('textbox')
        expect(rendered.result.queryAllByLabelText('Add entry')).toHaveLength(0)

        fireEvent.click(rendered.result.getByLabelText('Remove entry'))
        
        expect(rendered.result.queryAllByRole('textbox')).toHaveLength(0)
        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify([]))
        
        fireEvent.click(rendered.result.getByLabelText('Add entry'))
        
        expect(rendered.result.getAllByRole('textbox')).toHaveLength(1)
        expect(rendered.result.queryAllByLabelText('Add entry')).toHaveLength(0)
    })

    it('Render and change an object', () => {
        const rendered = testLifield({
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

        const fieldA = rendered.result.getByLabelText('foo-a')

        fireEvent.change(fieldA, {target: {value: 'bar'}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [fieldA.name]: 'bar'})
        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify({a: 'bar'}))
    })
})

describe('Choice', () => {
    it('Render and change small select', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
            },
            value: 'b',
        })

        expect(rendered.result.queryAllByText('Cde')).toHaveLength(0)

        userEvent.click(rendered.result.getByText('Bcd'))
        userEvent.click(rendered.result.getByText('Cde'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify('c'))
    })

    it('Render and change big select', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
                enumTitles: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij', 'Ijk', 'Jkl', 'Klm', 'Lmn', 'Mno', 'Nop', 'Opq', 'Pqr', 'Qrs', 'Rst', 'Stu'],
            },
            value: 'b',
        })

        expect(rendered.field).toBeInstanceOf(HTMLSelectElement)

        userEvent.selectOptions(rendered.field, rendered.result.getByText('Cde'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify('c'))
    })

    it('Render and change small multiple select', () => {
        const rendered = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
            },
            value: ['b'],
        })

        expect(rendered.result.queryAllByText('Cde')).toHaveLength(0)

        userEvent.click(rendered.field)
        userEvent.click(rendered.result.getByText('Cde'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))
    })

    it('Render and change big multiple select', () => {
        const rendered = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
                enumTitles: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij', 'Ijk', 'Jkl', 'Klm', 'Lmn', 'Mno', 'Nop', 'Opq', 'Pqr', 'Qrs', 'Rst', 'Stu'],
            },
            value: ['b'],
        })

        expect(rendered.field).toBeInstanceOf(HTMLSelectElement)

        userEvent.selectOptions(rendered.field, rendered.result.getByText('Cde'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))
    })
})