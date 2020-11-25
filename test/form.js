import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Liform, Lifield } from 'liform-react-final'
import Theme from '../src'

const TestField = (name, render) => {
    const widget = { render }
    return function TestField() {
        return <Lifield name={name} Widget={widget}/>
    }
}

describe('Sections', () => {
    it('Call render.field', () => {
        const field = jest.fn(() => null)
        const schema = {a: 'foo', b: 'bar'}

        render(
            <Liform
                theme={Theme}
                schema={schema}
                render={{
                    field,
                }}
                sections={{
                    form: Theme.sections.form,
                }}
            />
        )

        expect(field).toBeCalled()
        expect(field.mock.calls[0][0]).toBeTruthy()
        expect(field.mock.calls[0][0]['schema']).toEqual(schema)
    })

    it('Render errors for unregistered field', () => {
        const rendered = render(
            <Liform
                theme={Theme}
                meta={{
                    errors: {
                        'bar': ['There is something wrong with bar.'],
                        'baz': ['There is something wrong with baz.'],
                    }
                }}
                sections={{
                    field: TestField('bar', () => 'This is bar.'),
                    errors: Theme.sections.errors
                }}
            />
        )

        expect(rendered.getByText('This is bar.')).toBeTruthy()
        expect(rendered.getByText('There is something wrong with baz.')).toBeTruthy()
        expect(rendered.queryAllByText('There is something wrong with bar.')).toHaveLength(0)
    })

    it('Reset', () => {
        const rendered = render(
            <Liform
                theme={Theme}
                sections={{
                    field: TestField('bar', ({input, meta: {dirty}}) => <label className={dirty ? 'dirty': 'pristine'}>TestField<input {...input}/></label>),
                    action: Theme.sections.action,
                }}
                value={{
                    bar: 'someValue',
                }}
            />
        )

        const field = rendered.getByLabelText('TestField')

        userEvent.clear(field)
        userEvent.type(field, 'anotherValue', {delay: 0})

        expect(field).toHaveValue('anotherValue')
        expect(field.parentElement).toHaveClass('dirty')

        userEvent.click(rendered.getByRole('button', {name: /reset/i}))

        expect(field).toHaveValue('someValue')
        expect(field.parentElement).toHaveClass('pristine')
    })

    it('Submit', () => {
        const rendered = render(
            <Liform
                theme={Theme}
                sections={{
                    field: TestField('bar', ({input, meta: {dirty}}) => <label className={dirty ? 'dirty': 'pristine'}>TestField<input {...input}/></label>),
                    action: Theme.sections.action,
                }}
                value={{
                    bar: 'someValue',
                }}
                buildSubmitHandler={({updateData}) => ((values) => { updateData({value: values._}) })}
            />
        )

        const field = rendered.getByLabelText('TestField')

        userEvent.clear(field)
        userEvent.type(field, 'anotherValue')

        expect(field).toHaveValue('anotherValue')
        expect(field.parentElement).toHaveClass('dirty')

        userEvent.click(rendered.getByRole('button', {name: /submit/i}))

        expect(field).toHaveValue('anotherValue')
        expect(field.parentElement).toHaveClass('pristine')
    })
})
