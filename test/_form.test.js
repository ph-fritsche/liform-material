import { normalizeFormValues, getFormValues, resemblesFormValue } from './_form'
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
            {key: 'field', value: ['bar', 'baz']},
        ])

        body.innerHTML = `
            <form id='testform'>
                <select name='field[]' multiple>
                    <option>foo</option>
                    <option selected>bar</option>
                    <option selected value='baz'>BAZ</option>
                </select>
            </form>
        `

        expect(getFormValues(body.querySelector('#testform'))).toEqual([
            {key: 'field[]', value: 'bar'},
            {key: 'field[]', value: 'baz'},
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

describe('Resembling comparison', () => {
    it.each([
        ['foo', 'foo', true],
        ['1', 1, true],
        ['0', 0, true],
        ['false', false, true],
        ['', '', true],
        ['', null, true],
        ['', undefined, true],
        ['', [], true],
        ['', 'foo', false],
        ['', 1, false],
        ['', 0, false],
        ['', false, false],
        ['', ['0'], false],
        [0, 0, true],
        [0, '0', true],
        [0, '', false],
        [0, false, false],
        [1, 1, true],
        [1, '1', true],
        [1, 'foo', false],
        [1, true, false],
        [true, true, true],
        [true, 'true', true],
        [true, '1', true],
        [true, 1, true],
        [true, 'foo', true],
        [true, ['a'], true],
        [true, '0', false],
        [true, 0, false],
        [true, [], false],
        [true, '', false],
        [false, false, true],
        [false, 'false', true],
        [false, '', true],
        [false, [], true],
        [false, 0, true],
        [false, null, true],
        [false, '0', true],
        [null, null, true],
        [null, undefined, true],
        [null, '', true],
        [null, '0', false],
        [null, false, false],
        [null, 0, false],
        [undefined, null, true],
        [undefined, undefined, true],
        [undefined, '', true],
        [undefined, '0', false],
        [undefined, false, false],
        [undefined, 0, false],
        [[], '', true],
        [[], null, true],
        [[], undefined, true],
        [[], true, false],
        [[], 0, false],
        [['a','b'], 'a,b', true],
        [['a','b'], true, false],
    ])('Compare to %p - %p should result in %p', (expectedValue, receivedValue, expectedComparison) => {
        expect(resemblesFormValue(expectedValue, receivedValue)).toBe(expectedComparison)
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

describe('Expect extention toResembleInputValue', () => {
    it.each([
        [`<input value=""/>`, [null, undefined, '', false, []], ['0', 0]],
        [`<input value="0"/>`, [0, false, '0'], [null, undefined, []]],
        [`<input value="1"/>`, [1, true, '1'], ['foo']],
        [`<input value="fooValue"/>`, ['fooValue', true], [1]],
        [`<input type="checkbox" value="fooValue" checked/>`, ['fooValue', true], [1, 'true']],
        [`<input type="checkbox" checked/>`, [true, 'true'], ['foo']],
        [`<input type="checkbox" value="fooValue"/>`, ['', null, undefined, false, []], [0]],
        [`<input type="number" value=""/>`, [null, undefined, '', false], [0]],
        [`<input type="number" value="0"/>`, [0, false, '0'], [null, undefined, '']],
        [`<input type="number" value="1"/>`, [1, true, '1'], [1.2]],
        [`<select><option selected>bar</option></select>`, ['bar', ['bar'], true], [[], null, undefined, '', false]],
        [`<select multiple><option selected>bar</option><option selected>baz</option></select>`, [['bar', 'baz'], 'bar,baz', true], [1]],
        [`<select multiple></select>`, [[], false, null, undefined, ''], [0]],
    ])('Compare input values %p', (field, expectedValues, unexpectedValues) => {
        const container = document.createElement('div')
        container.innerHTML = field

        for (const v of expectedValues) {
            expect(container.firstChild).toResembleInputValue(v)
        }

        for (const v of unexpectedValues) {
            expect(() => {
                expect(container.firstChild).toResembleInputValue(v)
            }).toThrowError(JSON.stringify(v))
        }
    })
})

describe('Expect extension toResembleFormValues', () => {
    const body = document.createElement('body')
    body.innerHTML = `
        <form id='testform'>
            <input type='text' name='foo' value='fooValue'/>
            <input type='number' name='bar' value=''/>
            <input type='checkbox' name='baz' value='fooValue' checked/>
            <select multiple name='choice'><option value='foo'/><option selected value='bar'/><option selected value='baz'/></select>
            <select multiple name='choiceB[]'><option value='foo'/><option selected value='bar'/><option selected value='baz'/></select>
        </form>
    `
    const form = body.querySelector('#testform')

    it('Passes for resembling values', () => {
        expect(form).toResembleFormValues({
            'foo': true,
            'bar': undefined,
            'baz': true,
            'choice': 'bar,baz',
            'choiceB[0]': true,
            'choiceB[1]': 'baz',
        })

        expect(form).toResembleFormValues({
            'foo': 'fooValue',
            'bar': '',
            'baz': 'fooValue',
            'choice': ['bar', 'baz'],
            'choiceB[0]': 'bar',
            'choiceB[1]': 'baz',
        })
    })

    it('Fails for missing field', () => {
        expect(() => {
            expect(form).toResembleFormValues({
                'foo': 'fooValue',
                'bar': '',
                'baz': 'fooValue',
                'choice': ['bar', 'baz'],
                'choiceB[0]': 'bar',
                'choiceB[1]': 'baz',
                'anotherField': 'fooValue',
            })
        }).toThrowError()
    })

    it('Fails for wrong value', () => {
        expect(() => {
            expect(form).toResembleFormValues({
                'foo': 'fooValue',
                'bar': 0,
                'baz': 'fooValue',
                'choice': ['bar', 'baz'],
                'choiceB[0]': 'bar',
                'choiceB[1]': 'baz',
            })
        }).toThrowError()
    })

    it('Fails for extra field', () => {
        expect(() => {
            expect(form).toResembleFormValues({
                'foo': 'fooValue',
            })
        }).toThrowError()
    })
})
