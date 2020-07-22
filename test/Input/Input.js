import { testLifield } from '../_field'
import { fireEvent } from '@testing-library/react'

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
})
