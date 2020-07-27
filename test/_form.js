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
            if (e instanceof HTMLSelectElement) {
                for (let i = 0; i < e.selectedOptions.length; i++) {
                    values.push({
                        key: e.getAttribute('name'),
                        value: e.selectedOptions.item(i).value,
                    })
                }
            } else if (e instanceof HTMLInputElement && e.getAttribute('type') === 'checkbox') {
                values.push({
                    key: e.getAttribute('name'),
                    value: e.checked,
                })
            } else if (e instanceof HTMLInputElement && e.getAttribute('type') === 'radio') {
                if (e.checked) {
                    values.push({
                        key: e.getAttribute('name'),
                        value: e.value,
                    })
                }
            } else if (e instanceof HTMLInputElement && e.getAttribute('type') === 'number') {
                values.push({
                    key: e.getAttribute('name'),
                    value: e.value !== '' ? Number(e.value) : null,
                })
            } else {
                values.push({
                    key: e.getAttribute('name'),
                    value: e.value,
                })
            }
        }
    })

    return values
}

function createExpectResult(expectObject, pass, expectationName, expected, received, expectedDiff, receivedDiff) {
    return {
        pass: Boolean(Number(expectObject.isNot) ^ Number(pass)),
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
            }
        )
    },
})
