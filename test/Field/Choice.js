import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Choice', () => {
    it('Render and change small select', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
            },
            value: 'b',
        })

        expect(result.queryAllByText('Cde')).toHaveLength(0)

        userEvent.click(result.getByText('Bcd'))
        userEvent.click(result.getByText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify('c'))
    })

    it('Render and change big select', () => {
        const { field, result, form } = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
                enumTitles: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij', 'Ijk', 'Jkl', 'Klm', 'Lmn', 'Mno', 'Nop', 'Opq', 'Pqr', 'Qrs', 'Rst', 'Stu'],
            },
            value: 'b',
        })

        expect(field).toBeInstanceOf(HTMLSelectElement)

        userEvent.selectOptions(field, result.getByText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify('c'))
    })

    it('Render and change expanded choice', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
                choiceExpanded: true,
            },
            value: 'b',
        })

        userEvent.click(result.getByLabelText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify('c'))
    })

    it('Render and change small multiple select', () => {
        const { result, field, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
            },
            value: ['b'],
        })

        expect(result.queryAllByText('Cde')).toHaveLength(0)

        userEvent.click(field)
        userEvent.click(result.getByText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))
    })

    it('Render and change big multiple select', () => {
        const { field, result, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
                enumTitles: ['Abc', 'Bcd', 'Cde', 'Def', 'Efg', 'Fgh', 'Ghi', 'Hij', 'Ijk', 'Jkl', 'Klm', 'Lmn', 'Mno', 'Nop', 'Opq', 'Pqr', 'Qrs', 'Rst', 'Stu'],
            },
            value: ['b'],
        })

        expect(field).toBeInstanceOf(HTMLSelectElement)

        userEvent.selectOptions(field, result.getByText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))
    })

    it('Render and change expanded multiple choice', () => {
        const { result, form } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
                choiceExpanded: true,
            },
            value: ['b'],
        })

        userEvent.click(result.getByLabelText('Cde'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['b', 'c']))

        userEvent.click(result.getByLabelText('Bcd'))

        expect(form.getAttribute('data-values')).toEqual(JSON.stringify(['c']))
    })
})
