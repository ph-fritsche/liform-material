import React, { useCallback, useRef } from 'react'

import { getFieldError } from './error'
import Drop from './Drop/Drop';

export const renderFile = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)

    const onChange = useCallback((value) => {
        liform.form.change(name, value)
    }, [liform, name])

    return (
        <Drop
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
