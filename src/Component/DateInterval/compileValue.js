import PropTypes from 'prop-types'
import { intervalFromString } from '../../util/date'
import { indexOfUnescaped, hasUnescaped } from '../../util/string'

export function aspectsFromValue (parsedValue, valuePattern) {
    if (!parsedValue) {
        parsedValue = {}
    }
    if (!valuePattern) {
        valuePattern = 'P(-?\\d+[YMDW])*(T(-?\\d+[HMS])*)?'
    }

    const posP = indexOfUnescaped(valuePattern, 'P') ?? valuePattern.length
    const posT = indexOfUnescaped(valuePattern, 'T', posP) ?? valuePattern.length

    const aspects = []

    if (hasUnescaped(valuePattern, '-', 0, posP)) {
        aspects.push({key: 'sign', value: parsedValue.sign || '+', placeholder: '+', isNumeric: false})
    }

    const has = {
        years: parsedValue.years || hasUnescaped(valuePattern, 'Y', posP, posT),
        months: parsedValue.months || hasUnescaped(valuePattern, 'M', posP, posT),
        weeks: parsedValue.weeks || hasUnescaped(valuePattern, 'W', posP, posT),
        days: parsedValue.days || hasUnescaped(valuePattern, 'D', posP, posT),
        hours: parsedValue.hours || posT >= 0 && hasUnescaped(valuePattern, 'H', posT),
        minutes: parsedValue.minutes || posT >= 0 && hasUnescaped(valuePattern, 'M', posT),
        seconds: parsedValue.seconds || posT >= 0 && hasUnescaped(valuePattern, 'S', posT),
    }

    for (const [key, unit] of [
        ['years', 'Y'],
        ['months', 'M'],
        ['weeks', 'W'],
        ['days', 'D'],
        ['hours', 'h'],
        ['minutes', 'm'],
        ['seconds', 's'],
    ]) {
        if (!has[key]) {
            continue
        }

        let v = parsedValue[ key ] ?? 0

        // days and weeks should not both be present - but they might be
        if (key === 'days') {
            v += (parsedValue.weeks ?? 0) * 7
        } else if (key === 'weeks' && has.days) {
            continue
        }

        // put a space between aspects for readability
        if (aspects.length > 0) {
            aspects.push({text: ' '})
        }

        aspects.push(
            {key, value: v, label: key.substr(0, 1).toUpperCase() + key.substr(1)},
            {text: unit},
        )
    }

    return aspects
}

export function compileValue (valueProp, valuePattern) {
    const parsed = intervalFromString(valueProp)

    const input = aspectsFromValue(parsed, valuePattern)

    let display = []
    for (const a of input) {
        if (a.key === 'sign') {
            display.push(a.value)
        } else if (Object.keys(a).includes('value') && a.value !== 0) {
            // display weeks if possible
            if (a.key === 'days' && (a.value % 7) === 0) {
                display.push(a.value / 7, 'Weeks')
            } else {
                display.push(a.value, a.label)
            }
        }
    }
    display = display.join(' ')

    return {parsed, input, display}
}

export const CompiledValueProp = PropTypes.exact({
    parsed: PropTypes.object,
    input: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.exact({
            key: PropTypes.string,
            value: PropTypes.oneOfType([PropTypes.oneOf(['+', '-']), PropTypes.number]),
            label: PropTypes.string,
            isNumeric: PropTypes.bool,
        }),
        PropTypes.exact({
            text: PropTypes.string,
        }),
    ])),
    display: PropTypes.string,
})
