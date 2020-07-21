import React from 'react'
import { ColorPicker } from './ColorPicker'

export const Color = props => {
    const {
        name,
        schema = true,
        meta,
        input,
        ...others
    } = props

    return (
        <ColorPicker
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            {...others}
        />
    )
}
