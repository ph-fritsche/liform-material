import React, { useCallback } from 'react'
import { Color } from './Color/Color'
import { getFieldError } from './error'

export const renderColor = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)

    const onChange = useCallback((value) => {
        liform.form.change(name, value)
    }, [liform, name])

    return (
        <Color
            {...input}
            label={schema.title}
            helperText={error || schema.description}
            variant={'filled'}
            error={!!error}
            onChange={onChange}
            {...props}
        />
    )
}
