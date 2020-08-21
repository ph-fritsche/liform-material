import React from 'react'
import { render, queries } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { Liform, Lifield, htmlizeName } from 'liform-react-final'
import * as customQueries from './_query'
import MaterialTheme from '../src'
import DateFnsUtils from '@date-io/date-fns'
import { moveFocus } from './_dom'
import { act } from 'react-dom/test-utils'

function FieldTestLiform (props) {
    return (
        <Liform
            theme={MaterialTheme}
            name="form"
            render={{container: p => <form id="container" data-values={JSON.stringify(p.form.getState().values._)}>{p.children}</form>}}
            {...props}
        >
            { ({liform}) => <Lifield schema={liform.schema}/> }
        </Liform>
    )
}

function renderLifield (props) {
    const result = render(FieldTestLiform(props), {queries: {...queries, ...customQueries}})
    return {
        result,
        form: result.container.querySelector('form#container'),
        expectedFormValues: expectedFormValues(props.value, props.name || 'form'),
    }
}

function expectedFormValues(value, rootName) {
    const expected = {}

    function traverseValue(value, path = ['_']) {
        if (typeof(value) === 'object') {
            if (Array.isArray(value)) {
                value.forEach((v,i) => traverseValue(v, [].concat(path, [i])))
            } else {
                for (const k in value) {
                    traverseValue(value[k], [].concat(path, k))
                }
            }
        } else {
            expected[htmlizeName(path.join('.'), rootName)] = value
        }
    }
    value !== undefined && traverseValue(value)

    return expected
}

export function testLifield (props) {
    const rendered = renderLifield(props)

    expect(rendered.form).toContainFormValues(rendered.expectedFormValues)

    if (props.schema && props.schema.title) {
        rendered.field = rendered.result.getbyL(props.schema.title)
    }

    return rendered
}

describe('Basic input', () => {
    it('Render and change string input', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
            },
            value: 'bar',
        })

        userEvent.clear(rendered.field)
        userEvent.type(rendered.field, 'baz')

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 'baz'})

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify('baz'))
    })

    it('Render and change number input', () => {
        const rendered = testLifield({
            schema: {
                type: 'number',
                title: 'foo',
                step: .2,
            },
            value: 456,
        })

        userEvent.type(rendered.field, '{backspace}{backspace}{backspace}')

        expect(rendered.form.getAttribute('data-values')).toBe(null)
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: null})

        userEvent.type(rendered.field, '456')
        
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456})

        fireEvent.change(rendered.field, {target: {value: 456.75}})

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: 456.75})
        
        userEvent.click(rendered.form)

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

        userEvent.type(rendered.field, '{backspace}{backspace}{backspace}')

        expect(rendered.form.getAttribute('data-values')).toBe(null)
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: null})

        userEvent.type(rendered.field, '456')

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

        userEvent.click(rendered.field)
    
        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, [rendered.field.name]: true})

        userEvent.click(rendered.field)
    
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

        userEvent.clear(field0)
        userEvent.type(field0, 'baz')

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

        userEvent.click(rendered.result.getByLabelText('Add entry'))

        expect(rendered.result.getAllByRole('textbox')).toHaveLength(2)

        userEvent.type(rendered.result.getAllByRole('textbox')[1], 'baz')

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['bar', 'baz']))

        userEvent.click(rendered.result.getByLabelText('Remove entry'))

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

        userEvent.click(rendered.result.getByLabelText('Remove entry'))
        
        expect(rendered.result.queryAllByRole('textbox')).toHaveLength(0)
        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify([]))
        
        userEvent.click(rendered.result.getByLabelText('Add entry'))
        
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

        userEvent.type(fieldA, 'bar')

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

    it('Render and change expanded choice', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
                choiceExpanded: true,
            },
            value: 'b',
        })

        userEvent.click(rendered.result.getByLabelText('Cde'))

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

    it('Render and change expanded multiple choice', () => {
        const rendered = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
                choiceExpanded: true,
            },
            value: ['b'],
        })

        userEvent.click(rendered.result.getByLabelText('Cde'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))

        userEvent.click(rendered.result.getByLabelText('Bcd'))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(['c']))
    })
})

describe('Hidden', () => {
    it('Render and change hidden input', () => {
        const rendered = renderLifield({
            schema: {
                type: 'string',
                widget: 'hidden',
                title: 'foo',
            },
            value: 'bar',
        })

        expect(rendered.form).toEqualFormValues({'form': 'bar'})

        const input = rendered.form.querySelector('input[name=form]')

        fireEvent.change(input, {target: {value: 'baz'}})
        fireEvent.blur(input)

        expect(rendered.form).toHaveFormValues({...rendered.expectedFormValues, 'form': 'baz'})

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify('baz'))
    })

    it('Render errors for hidden input', () => {
        const rendered = renderLifield({
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

        expect(rendered.form).toEqualFormValues({'form': 'bar'})

        expect(rendered.form).toHaveTextContent('This is invalid.')
    })
})

describe('Date', () => {
    const dateUtil = new DateFnsUtils()

    it('Render and change date input per picker', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
        })

        userEvent.click(rendered.field)

        // since the value is undefined current month should be displayed in the picker
        const d = new Date()
        userEvent.click(rendered.result.getByLabelText(dateUtil.format(d, 'fullDate')))

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(dateUtil.formatByString(d, 'yyyy-MM-dd')))
    })

    it('Render and change date input per keyboard', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                widget: 'date',
                title: 'foo',
            },
        })

        const getActiveElement = (document => document.activeElement).bind(undefined, rendered.form.ownerDocument)

        const d = new Date()

        userEvent.tab()

        expect(rendered.result.getByLabelText('Year')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + d.getFullYear() + '$'))

        // next year
        fireEvent.keyDown(getActiveElement(), {key: 'ArrowUp'})
        d.setFullYear(d.getFullYear() +1)

        // next aspect
        fireEvent.keyDown(getActiveElement(), {key: 'ArrowRight'})

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(dateUtil.formatByString(d, 'yyyy-MM-dd')))
        expect(rendered.result.getByLabelText('Month')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + (d.getMonth()+1) + '$'))

        // this should jump to the next aspect
        userEvent.type(getActiveElement(), '8')
        d.setMonth(7)

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(dateUtil.formatByString(d, 'yyyy-MM-dd')))
        expect(rendered.result.getByLabelText('Day of the month')).toHaveFocus()
        expect(getActiveElement()).toHaveTextContent(new RegExp('^0*' + (d.getDate()) + '$'))

        userEvent.type(getActiveElement(), '1')

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(dateUtil.formatByString(d, 'yyyy-MM-dd')))
        expect(getActiveElement()).toHaveTextContent('01')

        userEvent.type(getActiveElement(), '7')
        d.setDate(17)

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify(dateUtil.formatByString(d, 'yyyy-MM-dd')))
    })

    it('Render and change time input', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                widget: 'time',
                title: 'foo',
            },
        })

        userEvent.click(rendered.result.getByLabelText('foo'))

        userEvent.click(rendered.result.getByText('AM'))

        // ClockNumbers do not handle click events
        fireEvent.keyDown(rendered.result.getByLabelText('8 hours'), {key: ' '})
        fireEvent.keyDown(rendered.result.getByLabelText('45 minutes'), {key: ' '})

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify("08:45"))
    })
})

describe('DateInterval', () => {
    it('Render and change DateInterval', () => {
        const rendered = testLifield({
            schema: {
                type: 'string',
                widget: 'dateinterval',
                title: 'foo',
            },
        })

        userEvent.click(rendered.result.getByLabelText('foo'))

        userEvent.type(rendered.result.getByLabelText('Years'), '12', {skipClick: true})

        moveFocus(rendered.result.getByLabelText('Days'))

        userEvent.type(rendered.result.getByLabelText('Days'), '34', {skipClick: true})

        moveFocus(rendered.result.getByLabelText('Minutes'))

        userEvent.type(rendered.result.getByLabelText('Minutes'), '56', {skipClick: true})

        userEvent.tab()

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify("P12Y34DT56M"))
    })
})

describe('File', () => {
    it('Render and change file drop', async () => {
        const rendered = testLifield({
            schema: {
                widget: 'file',
                title: 'foo',
            },
        })

        const files = [
            new File(['foo'], 'foo.txt', {type: 'text/plain'}),
            new File(['bar'], 'bar.txt', {type: 'text/plain'}),
            new File(['baz'], 'baz.png', {type: 'image/png'}),
        ]

        const field = rendered.result.getByLabelText('foo')
        const clickListener = jest.fn()
        const input = field.querySelector('input')
        input.addEventListener('click', clickListener)

        userEvent.click(field)

        expect(clickListener).toBeCalled()

        await act(async () => {
            await userEvent.upload(input, files)
        })

        expect(field).toHaveTextContent('foo.txt')
        expect(field).toHaveTextContent('bar.txt')
        expect(field).toHaveTextContent('baz.png')

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        userEvent.click(rendered.result.getByLabelText('foo.txt').querySelector('.MuiChip-deleteIcon'))

        expect(field).not.toHaveTextContent('foo.txt')
        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        rendered.result.getByLabelText('baz.png').focus()
        fireEvent.keyUp(rendered.result.getByLabelText('baz.png'), {key: 'Delete'})

        expect(field).not.toHaveTextContent('baz.png')
        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify([files[1]]))
    })

    it('Move focus with keyboard', async () => {
        const rendered = testLifield({
            schema: {
                widget: 'file',
                title: 'foo',
            },
        })

        const files = [
            new File(['foo'], 'foo.txt', {type: 'text/plain'}),
            new File(['bar'], 'bar.txt', {type: 'text/plain'}),
            new File(['baz'], 'baz.png', {type: 'image/png'}),
        ]

        const field = rendered.result.getByLabelText('foo')
        const input = field.querySelector('input')

        await act(async () => {
            await userEvent.upload(input, files)
        })

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowRight'})

        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowLeft'})

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowUp'})

        expect(rendered.result.getByLabelText('baz.png')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowDown'})

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()
    })
})
