import { intervalFromString } from "../util/date"
import { indexOfUnescaped } from "../util/string"

export function aspectsFromValue (parsedValue, valuePattern) {
    if (!parsedValue) {
        parsedValue = {}
    }
    if (!valuePattern) {
        valuePattern = 'P(-?\\d+[YMDW])*(T(-?\\d+[HMS])*)?'
    }

    const posP = indexOfUnescaped(valuePattern, 'P')
    const posT = indexOfUnescaped(valuePattern, 'T', posP)

    const aspects = []
    
    if (indexOfUnescaped(valuePattern, '-', 0, posP) >= 0) {
        aspects.push({type: 'value', key: 'sign', value: parsedValue.sign || '+', placeholder: '+', isNumeric: false})
    }

    for (const o of [
        [indexOfUnescaped(valuePattern, 'Y', posP, posT), 'Y', 'years'],
        [indexOfUnescaped(valuePattern, 'M', posP, posT), 'M', 'months'],
        [indexOfUnescaped(valuePattern, 'D', posP, posT), 'D', 'days'],
        [indexOfUnescaped(valuePattern, 'H', posT), 'h', 'hours'],
        [indexOfUnescaped(valuePattern, 'M', posT), 'm', 'minutes'],
        [indexOfUnescaped(valuePattern, 'S', posT), 's', 'seconds'],
    ]) {
        if (o[0] >= 0) {
            if (aspects.length > 0) {
                aspects.push({text: ' '})
            }
            let v = parsedValue[ o[2] ] ?? 0
            if (o[1] === 'D') {
                v += (parsedValue.weeks ?? 0) * 7
            }
            aspects.push(
                {type: 'value', key: o[2], value: v },
                {text: o[1]},
            )
        }
    }

    return aspects
}

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

export function compileValue (valueProp, valuePattern) {
    const parsed = intervalFromString(valueProp)

    const input = aspectsFromValue(parsed, valuePattern)

    let display = []
    for (const k in parsed) {
        if (k === 'sign') {
            display.push(parsed.sign)
        } else if (parsed[k] != 0) {
            display.push(parsed[k] + ' ' + k.substring(0,1).toUpperCase() + k.substring(1, parsed[k] === 1 || parsed[k] === -1 ? k.length - 1 : undefined))
        }
    }
    display = display.join(' ')

    return {parsed, input, display}
}
