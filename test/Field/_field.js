import React from 'react'
import { render, queries } from '@testing-library/react'
import { Liform, Lifield, htmlizeName } from 'liform-react-final'
import MaterialTheme from '../../src'
import { buildQueries, queryAllByLabelText, queryAllByText } from '@testing-library/react'

const [queryByL, getAllByL, getbyL, findAllByL, findByL] = buildQueries(
    (container, text, options) => {
        const input = queryAllByLabelText(container, text, options)
        const legend = queryAllByText(container, text, {...options, selector: 'legend'})
        const fieldset = legend.map(e => e.closest('fieldset')).filter(e => e !== null)

        return input.concat(fieldset)
    },
    (container, text) => `Found multiple elements for label/legend "${text}"`,
    (container, text) => `Unable to find an input for label or fieldset for legend "${text}"`,
)

const extendedQueries = {
    ...queries,
    getbyL,
}

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

export function renderLifield (props) {
    const result = render(FieldTestLiform(props), {queries: extendedQueries})
    return {
        result,
        form: result.container.querySelector('form#container'),
        expectedFormValues: expectedFormValues(props.value, props.name || 'form'),
        getActiveElement: () => result.container.ownerDocument.activeElement,
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

