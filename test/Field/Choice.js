import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('Choice', () => {
    it('Render and change small select', () => {
        const { result, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
            },
            value: 'b',
        })

        expect(result.queryByText('Cde')).not.toBeInTheDocument()

        userEvent.click(result.getByText('Bcd'))
        userEvent.click(result.getByText('Cde'))

        expect(getLiformValue()).toEqual('c')
    })

    it('Render and change big select', () => {
        const { field, result, getLiformValue } = testLifield({
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

        expect(getLiformValue()).toEqual('c')
    })

    it('Render and change expanded choice', () => {
        const { result, getLiformValue } = testLifield({
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

        expect(getLiformValue()).toEqual('c')
    })

    it('Render and change small multiple select', () => {
        const { result, field, getLiformValue } = testLifield({
            schema: {
                type: 'array',
                title: 'foo',
                enum: ['a', 'b', 'c'],
                enumTitles: ['Abc', 'Bcd', 'Cde'],
                placeholder: 'myPlaceholderText',
            },
            value: ['b'],
        })

        expect(result.queryByText('Cde')).not.toBeInTheDocument()

        userEvent.click(field)
        userEvent.click(result.getByText('Cde', {selector: '[role=option]'}))

        expect(getLiformValue()).toEqual(['b', 'c'])

        userEvent.click(result.getByText('Bcd', {selector: '[role=option]'}))
        userEvent.click(result.getByText('Cde', {selector: '[role=option]'}))

        expect(getLiformValue()).toEqual([])

        expect(field).toHaveTextContent('myPlaceholderText')
    })

    it('Render and change big multiple select', () => {
        const { field, result, getLiformValue } = testLifield({
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

        expect(getLiformValue()).toEqual(['b', 'c'])
    })

    it('Render and change expanded multiple choice', () => {
        const { result, getLiformValue } = testLifield({
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

        expect(getLiformValue()).toEqual(['b', 'c'])

        userEvent.click(result.getByLabelText('Bcd'))

        expect(getLiformValue()).toEqual(['c'])
    })
})
