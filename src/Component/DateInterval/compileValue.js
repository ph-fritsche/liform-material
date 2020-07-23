import { intervalFromString } from '../../util/date'
import { indexOfUnescaped } from '../../util/string'

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
