import React from 'react'

import { FileDropField } from './FileDropField';

export const FileDrop = props => {
    const {
        schema,
        meta,
        input,
        ...others
    } = props

    return (
        <FileDropField
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            error={!!meta.error}
            {...others}
        />
    )
}
