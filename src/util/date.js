const units = {
    date: {Y: 'years', M: 'months', D: 'days', W: 'weeks'},
    time: {H: 'hours', M: 'minutes', S: 'seconds'},
}

export function intervalFromString (intervalString) {
    const m = intervalString.match(/^(?<sign>\+|-)?P(?<date>(?:-?\d+[YMWD])*)(?:T(?<time>(?:-?\d+[HMS])*))?$/)
    if (!m) {
        return undefined
    }

    const interval = {}

    if (m.groups.sign) {
        interval.sign = m.groups.sign
    }

    for (let s of ['date', 'time']) {
        for (const o of (m.groups[s] ?? '').match(/-?\d+\w/g) ?? []) {
            interval[ units[s][o.substr(-1)] ] = Number(o.substring(0, o.length -1))
        }
    }

    return interval
}

export function intervalToString (intervalObject) {
    let interval = {}
    for (const s of ['date', 'time']) {
        for (const u in units[s]) {
            if (intervalObject[ units[s][u] ]) {
                interval[s] = (interval[s] ?? '') + intervalObject[ units[s][u] ] + u
            }
        }
    }

    if (!interval['date'] && !interval['time']) {
        return ''
    }

    return (intervalObject.sign ?? '') + 'P' + (interval['date'] ?? '') + (interval['time'] ? 'T' + interval['time'] : '')
}
