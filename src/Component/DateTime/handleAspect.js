import PropTypes from 'prop-types'

function daysInMonth (dateUtil, ...args) {
    const d = typeof(args[0]) === 'object'
        ? args[0]
        : dateUtil.date(new Date(args[0], args[1] - 1))
    const end = dateUtil.endOfMonth(d)
    return Number(dateUtil.formatByString(end, 'dd'))
}

const aspectLimits = {
    yyyy: [0,2100],
    YYYY: [0,2100],
    RRRR: [0,2100],
    Q: [1,4],
    MM: [1,12],
    ww: [1,53],
    II: [1,53],
    dd: [1,31],
    DDD: [1,366],
    e: [1,7],
    i: [1,7],
    HH: [0,23],
    mm: [0,59],
    ss: [0,59],
    SSS: [0,999],
}

export function validateAspect (dateUtil, value, aspectValue, aspectIndex) {
    const placeholder = value.input[aspectIndex].placeholder

    aspectValue = Number(aspectValue)

    if (aspectLimits[placeholder] && (
        aspectLimits[placeholder][0] !== undefined && aspectValue < aspectLimits[placeholder][0]
        || aspectLimits[placeholder][1] !== undefined && aspectValue > aspectLimits[placeholder][1]
    )) {
        return undefined
    }

    if (placeholder === 'dd' && aspectValue > daysInMonth(dateUtil, value.parsed)) {
        return undefined
    }

    return aspectValue
}

export function commitAspect (dateUtil, value, onChange, aspectValue, aspectIndex) {
    if (['yyyy','YYYY','RRRR'].indexOf(value.input[aspectIndex].placeholder) >= 0) {
        // might want to use min and max date for autocorrection of small aspectValues
        if(aspectValue < 100) {
            aspectValue = Number(aspectValue) + (aspectValue > 30 ? 1900 : 2000)
        }
    }

    const valueString = value.input.map((p,i) => {
        if (!Object.keys(p).includes('value')) {
            return p.text
        }
        if (i === aspectIndex) {
            return aspectValue
        }

        // when switching to a month with less days, date might need correction
        if (p.placeholder === 'dd'
            && value.input[aspectIndex].placeholder === 'MM'
        ) {
            const y = value.input.find(p => p.placeholder[0] === 'y')
            return Math.min(daysInMonth(dateUtil, y && y.value, aspectValue), p.value)
        }

        return p.value
    }).join('')
    const valueFormat = value.input.map(p => Object.keys(p).includes('value') ? p.placeholder : "'" + p.text + "'").join('')

    const newDate = dateUtil.parse(valueString, valueFormat)

    if (String(newDate) !== 'Invalid Date') {
        onChange(newDate)
    }
}

export const AspectsDateUtilProps = {
    date: PropTypes.func,
    endOfMonth: PropTypes.func,
    formatByString: PropTypes.func,
    parse: PropTypes.func,
}
