function daysInMonth (dateUtil, ...args) {
    const d = typeof(args[0]) === 'object'
        ? args[0]
        : dateUtil.date(new Date(args[0], args[1] - 1))
    const end = dateUtil.endOfMonth(d)
    return Number(dateUtil.formatByString(end, 'dd'))
}

export function validateAspect (dateUtil, value, aspectValue, aspectIndex) {
    const placeholder = value.input[aspectIndex].placeholder

    aspectValue = Number(aspectValue)

    if (placeholder === 'yyyy') {
        // might want to use min and max date for autocorrection of small aspectValues
        return aspectValue < 100
            ? aspectValue + (aspectValue > 30 ? 1900 : 2000)
            : aspectValue <= 2100 ? aspectValue : undefined
    } else if (placeholder === 'MM') {
        return aspectValue >= 1 && aspectValue <= 12 ? aspectValue : undefined
    } else if (placeholder === 'dd') {
        return aspectValue >= 1 && aspectValue <= daysInMonth(dateUtil, value.parsed) ? aspectValue : undefined
    } else if (placeholder === 'HH') {
        return aspectValue >= 0 && aspectValue <= 23 ? aspectValue : undefined
    } else if (placeholder === 'mm' || placeholder === 'ss') {
        return aspectValue >= 0 && aspectValue <= 59 ? aspectValue : undefined
    }
}

export function commitAspect (dateUtil, value, onChange, aspectValue, aspectIndex) {
    const newDate = dateUtil.parse(
        value.input.map((p,i) => {
            if (p.type === 'formatter') {
                return p.placeholder
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
        }).join(''),
        value.input.map(p => p.placeholder).join(''),
    )

    if (String(newDate) !== 'Invalid Date') {
        onChange(newDate)
    }
}

