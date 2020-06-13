import React from 'react'
import { FormControl, FormLabel, FormHelperText } from '@material-ui/core'

import { getFieldError } from './error'

export const renderHidden = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)
    if (!error) {
        return <input {...input} type='hidden'/>
    }

    return (
        <FormControl
            component='fieldset'
            error={!!error}
        >
            <FormLabel component='legend'>{schema.title}</FormLabel>
            <input {...input} type='hidden'/>
            <FormHelperText>{error || schema.description}</FormHelperText>
        </FormControl>
    )
}

export default renderHidden
