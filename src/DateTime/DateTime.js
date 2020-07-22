import React from 'react'
import { DateTimeField } from './DateTimeField'

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

export const DateTime = props => {
    const {
        schema,
        meta,
        input,

        valueFormat = valueFormatFromSchema(schema),

        ...others
    } = props

    return (
        <DateTimeField
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            error={!!meta.error}
            onChange={input.onChange}
            valueFormat={valueFormat}
            {...others}
        />
    )
}
