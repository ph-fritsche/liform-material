import React, { useCallback } from 'react'
import { DateTime } from './DateTime/DateTime'
import { DateInterval } from './DateInterval/DateInterval'

const valueFormatFromSchema = (schema) => {
    if (schema.dateFormat) {
        return schema.dateFormat
    }

    if (schema.format === 'datetime-local') {
        return "yyyy-MM-dd'T'HH:mm:sszzz"
    } else if (schema.format === 'date') {
        return 'yyyy-MM-dd'
    } else if (schema.format === 'time') {
        return 'HH:mm:sszzz'
    }

    const widget = Array.isArray(schema.widget) ? schema.widget : [schema.widget]
    if (widget.indexOf('datetime') >= 0) {
        return "yyyy-MM-dd'T'HH:mm"
    } else if (widget.indexOf('date') >= 0) {
        return 'yyyy-MM-dd'
    } else if (widget.indexOf('time') >= 0) {
        return 'HH:mm'
    } else if (widget.indexOf('week') >= 0) {
        // https://github.com/dmtrKovalenko/date-io/issues/412
        // return "YYYY-'W'ww"
        return "RRRR-'W'II"
    }
}

export const renderDate = ({name, schema, meta, input, ...props}) => {
    return (
        <DateTime
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            onChange={input.onChange}
            {...props}
            valueFormat={props.valueFormat || valueFormatFromSchema(schema)}
        />
    )
}

export const renderDateInterval = ({name, schema, meta, input, ...props}) => {
    return (
        <DateInterval
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            {...props}
        />
    )
}
