import React from 'react'
import { ColorField } from './ColorField'

export const Color = props => {
    const {
        schema = true,
        meta,
        input,
        ...others
    } = props

    return (
        <ColorField
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            error={!!meta.error}
            {...others}
        />
    )
}
