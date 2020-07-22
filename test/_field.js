import React from 'react'
import { render, queries } from '@testing-library/react'
import { Liform, Lifield, htmlizeName } from 'liform-react-final'
import MaterialTheme from '../src'
import * as customQueries from './_query'

export function FieldTestLiform (props) {
    return (
        <Liform
            theme={MaterialTheme}
            name="form"
            render={{container: p => <form id="container">{p.children}</form>}}
            {...props}
        >
            { ({liform}) => <Lifield schema={liform.schema}/> }
        </Liform>
    )
}

export function renderLifield (props) {
    const result = render(FieldTestLiform(props), {queries: {...queries, ...customQueries}})
    return {
        result,
        form: result.container.querySelector('form#container'),
        expectedFormValues: expectedFormValues(props.value, props.name || 'form'),
    }
}

function expectedFormValues(value, rootName) {
    const expected = {}

    function traverseValue(value, path = []) {
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
    traverseValue(value)

    return expected
}

export function testLifield (props) {
    const rendered = renderLifield(props)

    expect(rendered.form).toHaveFormValues(rendered.expectedFormValues)

    if (props.schema && props.schema.title) {
        rendered.field = rendered.result.getbyL(props.schema.title)
    }

    return rendered
}
