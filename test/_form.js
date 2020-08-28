export function normalizeFormValues (values) {
    const normalized = {}
    const length = {}

    values.forEach(o => {
        let k = o.key

        const r = /\[(\d*)\]/g
        let m
        while (m = r.exec(k)) {
            const sub = k.substring(0, r.lastIndex - m[0].length)

            if (m[1] !== '') {
                length[sub] = Math.max(length[sub] ?? 0, Number(m[1]))
            } else {
                length[sub] = (length[sub] ?? -1) + 1
                k = k.substring(0, r.lastIndex - 1) + (length[sub] ?? 0) + k.substring(r.lastIndex -1)
            }
        }

        normalized[k] = o.value
    })

    return normalized
}

export function getInputValue (element) {
    if (element instanceof HTMLSelectElement) {
        return element.hasAttribute('multiple')
            ? Array.from(element.selectedOptions).map(i => i.value)
            : element.value
    } else if (element instanceof HTMLInputElement && element.getAttribute('type') === 'checkbox') {
        return (element.hasAttribute('value') && element.getAttribute('value') !== '')
            ? (element.checked ? element.getAttribute('value') : undefined)
            : element.checked
    } else if (element instanceof HTMLInputElement && element.getAttribute('type') === 'radio') {
        return element.checked ? element.value : undefined
    } else if (element instanceof HTMLInputElement && element.getAttribute('type') === 'number') {
        return element.value !== '' ? Number(element.value) : null
    } else if (element instanceof HTMLElement) {
        return element.value
    }
}

export function getFormValues (formElement) {
    if (!formElement instanceof HTMLFormElement) {
        throw new Error('Received element has to be a HTML form element')
    }

    let domain = formElement

    let parent = formElement
    while(parent = parent.parentNode) {
        if (parent instanceof HTMLBodyElement || parent instanceof DocumentFragment) {
            domain = parent
        }
    }

    const values = []

    domain.querySelectorAll('select,input,textarea').forEach(e => {
        if (e.form === formElement && e.getAttribute('name') !== '') {
            const v = getInputValue(e)
            if (v !== undefined) {
                if (Array.isArray(v) && e.getAttribute('name').includes('[]')) {
                    values.push(...v.map(v_ => ({
                        key: e.getAttribute('name'),
                        value: v_,
                    })))
                } else {
                    values.push({
                        key: e.getAttribute('name'),
                        value: v,
                    })
                }
            }
        }
    })

    return values
}

export function resemblesFormValue(expected, received) {
    if (typeof(expected) === 'string') {
        return expected === String(received ?? '')
    } else if (typeof(expected) === 'number') {
        return expected === Number(received) && ['string','number','array'].includes(typeof(received)) && received.length !== 0
    } else if (typeof(expected) === 'boolean') {
        return expected === (Boolean(received) && received !== '0' && received !== NaN && received !== 'false' && received.length !== 0)
    } else if (Array.isArray(expected)) {
        const convertedReceived = Array.isArray(received) ? received : String(received ?? '').split(',')
        for (let i = 0; i < Math.max(expected.length, convertedReceived.length); i++) {
            if (!resemblesFormValue(expected[i], convertedReceived[i])) {
                return false
            }
        }
        return true
    } else if (expected === null || expected === undefined) {
        return received === null || received === undefined || received.length === 0
    }
}

function createExpectResult(expectObject, pass, expectationName, expected, received, expectedDiff, receivedDiff) {
    return {
        pass,
        message: () => {
            const hint = expectObject.utils.matcherHint(expectationName, received, JSON.stringify(expected, null, 2), expectObject)
            const e = expectedDiff ? expectedDiff() : expected
            const r = receivedDiff ? receivedDiff() : received
            return `${hint}\n\n${expectObject.utils.printDiffOrStringify(e, r, 'Expected', 'Received')}`
        }
    }
}

expect.extend({
    toEqualFormValues (formElement, valueMap) {
        const formValues = normalizeFormValues(getFormValues(formElement))

        return createExpectResult(
            this,
            this.equals(formValues, valueMap, [], false),
            'toEqualFormValues',
            valueMap,
            formValues,
        )
    },
    toContainFormValues (formElement, valueMap) {
        const formValues = normalizeFormValues(getFormValues(formElement))

        return createExpectResult(
            this,
            this.equals(formValues, valueMap, [this.utils.subsetEquality], false),
            'toContainFormValues',
            valueMap,
            formValues,
            undefined,
            () => {
                const filtered = {}
                Object.keys(valueMap).forEach(k => {
                    if(Object.keys(formValues).includes(k)) {
                        filtered[k] = formValues[k]
                    }
                })
                return filtered
            },
        )
    },
    toResembleFormValues (formElement, valueMap) {
        const formValues = normalizeFormValues(getFormValues(formElement))

        const pass = Object.keys(Object.assign({}, valueMap, formValues)).every(k =>
            Object.keys(valueMap).includes(k) && Object.keys(formValues).includes(k) && resemblesFormValue(valueMap[k], formValues[k])
        )

        return createExpectResult(
            this,
            pass,
            'toResembleFormValues',
            valueMap,
            formValues,
            () => {
                const filtered = {}
                Object.keys(valueMap).forEach(k => {
                    if (true || !Object.keys(formValues).includes(k) || !resemblesFormValue(valueMap[k], formValues[k])) {
                        filtered[k] = valueMap[k]
                    }
                })
                return filtered
            },
            () => {
                const filtered = {}
                Object.keys(formValues).forEach(k => {
                    if (true || !Object.keys(valueMap).includes(k) || !resemblesFormValue(valueMap[k], formValues[k])) {
                        filtered[k] = formValues[k]
                    }
                })
                return filtered
            },
        )
    },
    toResembleInputValue (inputElement, expectedValue) {
        const value = getInputValue(inputElement)

        return createExpectResult(
            this,
            resemblesFormValue(expectedValue, value),
            'toResembleInputValue',
            expectedValue,
            value,
        )
    },
})
