import PropTypes from 'prop-types'

/**
 * @see https://date-fns.org/v2.14.0/docs/format
 */

export function placeholdersFromFormat (format) {
    return (format
        // remove quoted parts
        .replace(/'[^']*'/g, '')

        // get format patterns - repeated characters or ordinal
        .match(/([a-zA-Z])(o|\1*)/g)
    )
}

const pickerViewsForValueFormat = {
    year: ['P', 'R', 't', 'T', 'u', 'y', 'Y'],
    month: ['d', 'D', 'I', 'L', 'M', 'P', 'q', 'Q', 't', 'T', 'w'],
    date: ['c', 'd', 'D', 'e', 'E', 'i', 'I', 'P', 't', 'T', 'w'],
    hours: ['a', 'b', 'B', 'h', 'H', 'k', 'K', 'p', 't', 'T'],
    minutes: ['m', 'p', 't', 'T'],
    seconds: ['p', 's', 't', 'T'],
}

export function buildPickerViews (formatPlaceholders) {
    const views = []

    for (const k in pickerViewsForValueFormat) {
        if (formatPlaceholders.find(v => pickerViewsForValueFormat[k].indexOf(v[0]) >= 0)) {
            views.push(k)
        }
    }

    return views
}

const dateAspectsForValueFormat = {
    yyyy: ['P', 't', 'T', 'u', 'y', 'Y'],
    // https://github.com/dmtrKovalenko/date-io/issues/412
    // YYYY: ['Y'],
    RRRR: ['R'],
    Q: ['q', 'Q'],
    MM: ['d', 'L', 'M', 'P', 't', 'T'],
    ww: ['w'],
    II: ['I'],
    dd: ['c', 'd', 'D', 'e', 'E', 'i', 'P', 't', 'T'],
    // https://github.com/dmtrKovalenko/date-io/issues/412
    // DDD: ['D'],
    e: ['e'],
    i: ['i'],
}

const timeAspectsForValueFormat = {
    HH: ['a', 'b', 'B', 'h', 'H', 'k', 'K', 'p', 't', 'T'],
    mm: ['m', 'p', 't', 'T'],
    ss: ['p', 's', 't', 'T'],
    SSS: ['S', 'T'],
}

export function aspectsFromPlaceholders (placeholders) {
    const aspects = {date: [], time: []}

    for (const k in dateAspectsForValueFormat) {
        if (placeholders.find(v => dateAspectsForValueFormat[k].indexOf(v[0]) >= 0)) {
            aspects.date.push(k)
        }
    }

    for (const k in timeAspectsForValueFormat) {
        if (placeholders.find(v => timeAspectsForValueFormat[k].indexOf(v[0]) >= 0)) {
            aspects.time.push(k)
        }
    }

    return aspects
}

const aspectsLabel = {
    'y': 'Year',
    'Y': 'Year',
    'R': 'ISO year',
    'Q': 'Quarter',
    'M': 'Month',
    'w': 'Week',
    'I': 'ISO week',
    'd': 'Day of the month',
    'D': 'Day of the year',
    'e': 'Day of the week',
    'i': 'ISO day of the week',
    'H': 'Hours',
    'm': 'Minutes',
    's': 'Seconds',
}

export function buildInputAspects (aspects) {
    const dateAspects = []

    for (const k of aspects.date) {
        if (dateAspects.length) {
            dateAspects.push({text: '-'})
        }
        if (k[0] === 'Q') {
            dateAspects.push({text: 'Q'})
        } else if (k[0] === 'w' || k[0] === 'I') {
            dateAspects.push({text: 'W'})
        }
        dateAspects.push({placeholder: k, label: aspectsLabel[k.substr(0,1)]})
    }

    const timeAspects = []
    for (const k of aspects.time) {
        if (k[0] === 'S') {
            timeAspects.push({text: '.'})
        } else if (timeAspects.length) {
            timeAspects.push({text: ':'})
        }
        timeAspects.push({placeholder: k, label: aspectsLabel[k.substr(0,1)]})
    }

    return [].concat(
        dateAspects,
        dateAspects.length && timeAspects.length ? [{text: '  '}] : [],
        timeAspects
    )
}

const displayFormatsForAspects = {
    'YQ': "YYYY', Q 'Q",
    'RI': "RRRR', W 'II",
}

export function buildDisplayFormats (aspects) {
    const dateAspects = aspects.date.map(k => k[0]).join('')
    const timeAspects = aspects.time.map(k => k[0]).join('')

    return {
        date: dateAspects === '' ? '' : displayFormatsForAspects[dateAspects] ?? 'fullDate',
        time: timeAspects === '' ? '' : displayFormatsForAspects[timeAspects] ?? 'fullTime',
    }
}

function formatDate(dateUtil, date, format) {
    return dateUtil[ dateUtil.formats[format] ? 'format' : 'formatByString' ](date, format)
}

export function compileValue (dateUtil, valueProp, valueFormat) {
    const parsed = valueProp && valueFormat ? dateUtil.parse(valueProp, valueFormat) : dateUtil.date(valueProp || new Date())

    if (String(parsed) === 'Invalid Date') {
        throw new Error('Invalid date/time supplied')
    }

    const format = String(valueFormat || "yyyy-MM-dd'T'HH:mm:ssxxx")
    const placeholders = placeholdersFromFormat(format)
    const valueAspects = aspectsFromPlaceholders(placeholders)

    const views = buildPickerViews(placeholders)

    const input = buildInputAspects(valueAspects)
    for (const a of input) {
        if (a.placeholder) {
            a.value = dateUtil.formatByString(parsed, a.placeholder)
        }
    }

    const displayFormats = buildDisplayFormats(valueAspects)
    const display = valueProp
        ? [
            displayFormats.date && formatDate(dateUtil, parsed, displayFormats.date),
            displayFormats.time && formatDate(dateUtil, parsed, displayFormats.time),
        ].filter(v => Boolean(v)).join('\t')
        : ''

    return {format, parsed, views, input, display}
}

export const CompiledValueProp = PropTypes.exact({
    format: PropTypes.string,
    parsed: PropTypes.object.isRequired,
    views: PropTypes.arrayOf(PropTypes.string),
    input: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.exact({
            value: PropTypes.string,
            placeholder: PropTypes.string,
            label: PropTypes.string,
        }),
        PropTypes.exact({
            text: PropTypes.string,
        }),
    ])).isRequired,
    display: PropTypes.string,
})
