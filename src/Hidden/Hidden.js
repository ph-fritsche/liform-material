import React from 'react'
import { FormControl, FormLabel, FormHelperText } from '@material-ui/core'

export const Hidden = props => {
    const {
        schema = true,
        meta,
        input,
    } = props

    if (!meta.error) {
        return <input {...input} type='hidden'/>
    }

    return (
        <FormControl
            component='fieldset'
            error={!!meta.error}
        >
            <FormLabel component='legend'>{schema.title}</FormLabel>
            <input {...input} type='hidden'/>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}
