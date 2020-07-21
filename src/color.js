import React, { useCallback } from 'react'
import { Color } from './Color/Color'

export const renderColor = ({name, schema, meta, input, ...props}) => {
    return (
        <Color
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            {...props}
        />
    )
}
