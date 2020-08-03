import { normalizeFormValues, getFormValues } from './_form'
import './_form'

describe('Normalize form values', () => {
    it('Create key value map', () => {
        expect(normalizeFormValues([
            {key: 'foo', value: 'fooValue'},
            {key: 'bar', value: 'barValue'},
            {key: 'bar', value: 'bazValue'},
        ])).toEqual({
            'foo': 'fooValue',
            'bar': 'bazValue',
        })

        expect(normalizeFormValues([
            {key: 'foo', value: 'fooValue'},
            {key: 'bar', value: 'barValue'},
            {key: 'bar', value: 'bazValue'},
        ])).toEqual({
            'foo': 'fooValue',
            'bar': 'bazValue',
        })
    })

    it('Resolve []', () => {
        expect(normalizeFormValues([
            {key: 'foo[]', value: 'foo0'},
            {key: 'foo[]', value: 'foo1'},
            {key: 'foo[]', value: 'foo2'},
        ])).toEqual({
            'foo[0]': 'foo0',
            'foo[1]': 'foo1',
            'foo[2]': 'foo2',
        })

        expect(normalizeFormValues([
            {key: 'foo[]', value: 'foo0'},
            {key: 'foo[]bar[]', value: 'foo1'},
            {key: 'foo[]bar[]', value: 'foo2'},
        ])).toEqual({
            'foo[0]': 'foo0',
            'foo[1]bar[0]': 'foo1',
            'foo[2]bar[0]': 'foo2',
        })

        expect(normalizeFormValues([
            {key: 'foo[2]', value: 'foo0'},
            {key: 'foo[]bar[]', value: 'foo1'},
            {key: 'foo[2]bar[]', value: 'foo2'},
            {key: 'foo[0]bar[]', value: 'foo3'},
            {key: 'foo[2]bar[]', value: 'foo4'},
        ])).toEqual({
            'foo[2]': 'foo0',
            'foo[3]bar[0]': 'foo1',
            'foo[2]bar[0]': 'foo2',
            'foo[0]bar[0]': 'foo3',
            'foo[2]bar[1]': 'foo4',
        })
    })
})

describe('Get form values', () => {
    const body = document.createElement('body')

    it('Get input in form', () => {
        body.innerHTML = `
            <input type='text' name='foo' value='fooValue'/>
            <form id='testform'>
                <input type='text' name='bar' value='barValue'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'bar', value: 'barValue'},
        ])
    })

    it('Get associated input', () => {
        body.innerHTML = `
            <input form='testform' type='text' name='foo' value='fooValue'/>
            <form id='testform'>
                <input type='text' name='bar' value='barValue'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'foo', value: 'fooValue'},
            {key: 'bar', value: 'barValue'},
        ])

        body.innerHTML = `
            <input form='testform' type='text' name='foo' value='fooValue'/>
            <form id='testform'>
                <input form='anotherform' type='text' name='bar' value='barValue'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'foo', value: 'fooValue'},
        ])
    })

    it('Get textarea', () => {
        body.innerHTML = `
            <form id='testform'>
                <textarea name='foo'>bar</textarea>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'foo', value: 'bar'},
        ])
    })

    it('Get select value', () => {
        body.innerHTML = `
            <form id='testform'>
                <select name='field'>
                    <option>foo</option>
                    <option selected>bar</option>
                    <option value='baz'>BAZ</option>
                </select>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'field', value: 'bar'},
        ])

        body.innerHTML = `
            <form id='testform'>
                <select name='field'>
                    <option>foo</option>
                    <option>bar</option>
                    <option selected value='baz'>BAZ</option>
                </select>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'field', value: 'baz'},
        ])

        body.innerHTML = `
            <form id='testform'>
                <select name='field' multiple>
                    <option>foo</option>
                    <option selected>bar</option>
                    <option selected value='baz'>BAZ</option>
                </select>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'field', value: 'bar'},
            {key: 'field', value: 'baz'},
        ])
    })

    it('Get checkbox input', () => {
        body.innerHTML = `
            <form id='testform'>
                <input type='checkbox' name='fieldA' checked/>
                <input type='checkbox' name='fieldB'/>
                <input type='checkbox' name='fieldC' value='foo' checked/>
                <input type='checkbox' name='fieldD' value='bar'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'fieldA', value: true},
            {key: 'fieldB', value: false},
            {key: 'fieldC', value: 'foo'},
        ])
    })

    it('Get radio input', () => {
        body.innerHTML = `
            <form id='testform'>
                <input type='radio' name='fieldA' value='foo'/>
                <input type='radio' name='fieldA' value='bar'/>
                <input type='radio' name='fieldA' value='baz'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
        ])

        body.innerHTML = `
            <form id='testform'>
                <input type='radio' name='fieldA' value='foo'/>
                <input type='radio' name='fieldA' value='bar' checked/>
                <input type='radio' name='fieldA' value='baz'/>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'fieldA', value: 'bar'},
        ])
    })
})

describe('Expect extension toEqualFormValues', () => {
    const body = document.createElement('body')
    body.innerHTML = `
        <form id='testform'>
            <input type='text' name='foo' value='fooValue'/>
            <input type='text' name='bar' value='barValue'/>
        </form>
    `
    const form = body.querySelector('#testform')

    it('Passes for equal values', () => {
        expect(form).toEqualFormValues({
            'foo': 'fooValue',
            'bar': 'barValue',
        })
    })

    it('Fails for missing field', () => {
        expect(() => {
            expect(form).toEqualFormValues({
                'foo': 'fooValue',
                'bar': 'barValue',
                'baz': 'bazValue',
            })
        }).toThrowError()
    })

    it('Fails for wrong value', () => {
        expect(() => {
            expect(form).toEqualFormValues({
                'foo': 'fooValue',
                'bar': 'bazValue',
            })
        }).toThrowError()
    })

    it('Fails for extra field', () => {
        expect(() => {
            expect(form).toEqualFormValues({
                'foo': 'fooValue',
            })
        }).toThrowError()
    })
})

describe('Expect extension toContainFormValues', () => {
    const body = document.createElement('body')
    body.innerHTML = `
        <form id='testform'>
            <input type='text' name='foo' value='fooValue'/>
            <input type='text' name='bar' value='barValue'/>
        </form>
    `
    const form = body.querySelector('#testform')

    it('Passes for equal values', () => {
        expect(form).toContainFormValues({
            'foo': 'fooValue',
            'bar': 'barValue',
        })
    })

    it('Fails for missing field', () => {
        expect(() => {
            expect(form).toContainFormValues({
                'foo': 'fooValue',
                'bar': 'barValue',
                'baz': 'bazValue',
            })
        }).toThrowError()
    })

    it('Fails for wrong value', () => {
        expect(() => {
            expect(form).toContainFormValues({
                'foo': 'fooValue',
                'bar': 'bazValue',
            })
        }).toThrowError()
    })

    it('Passes for extra field', () => {
        expect(form).toContainFormValues({
            'foo': 'fooValue',
        })
    })
})
