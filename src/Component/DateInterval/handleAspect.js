export function validateAspect (aspects, aspectValue, aspectIndex) {
    if (aspects[aspectIndex].key === 'sign') {
        if (/^(\+|-)?$/.test(aspectValue)) {
            return aspectValue
        }
        if (aspectValue.length === 1) {
            const c = aspectValue.charCodeAt(0)
            if (c === 46) {
                return '+'
            } else if (c === 42) {
                return '-'
            }
        }
        return undefined
    } else {
        return !Number.isNaN(Number(aspectValue)) ? aspectValue : undefined
    }
}

export function commitAspect (aspects, changeCallback, aspectValue, aspectIndex) {
    const interval = {}
    for (const i in aspects) {
        if (aspects[i].type !== 'value') {
            continue
        }
        interval[aspects[i].key] = aspectIndex == i ? aspectValue : aspects[i].value ?? 0
    }
    changeCallback(interval)
}
