import React from 'react'
import PropTypes from 'prop-types'
import { DateTimeField } from '../Component/DateTime/DateTimeField'
import { BaseRender } from './BaseRender'
import { FieldRenderProps } from '../liform-props'

const jsonFormats = {
    'datetime-local': "yyyy-MM-dd'T'HH:mm:sszzz",
    'date': 'yyyy-MM-dd',
    'time': 'HH:mm:sszzz',
}

const widgetFormats = {
    'datetime': "yyyy-MM-dd'T'HH:mm",
    'date': 'yyyy-MM-dd',
    'time': 'HH:mm',

    // https://github.com/dmtrKovalenko/date-io/issues/412
    // "YYYY-'W'ww"
    'week': "RRRR-'W'II",
}

export const DateTime = props => {
    const {
        schema = true,
        valueFormat = schema.dateFormat
            || schema.format && jsonFormats[schema.format]
            || widgetFormats[Object.keys(widgetFormats).find(k =>
                Array.isArray(schema.widget)
                    ? schema.widget.includes(k)
                    : schema.widget === k,
            )],
    } = props

    return (
        <BaseRender
            {...props}
            Component={DateTimeField}
            valueFormat={valueFormat}
        />
    )
}

DateTime.propTypes = {
    ...FieldRenderProps,

    valueFormat: PropTypes.string,
}
