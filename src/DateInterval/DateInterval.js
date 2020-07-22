import React from 'react'
import { DateIntervalField } from './DateIntervalField'

export const DateInterval = props => {
    const {
        schema,
        meta,
        input,
        ...others
    } = props

    return (
        <DateIntervalField
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            {...others}
        />
    )
}
