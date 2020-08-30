import React from 'react'
import { FormControl, FormLabel, FormHelperText } from '@material-ui/core'
import { FieldRenderProps } from 'liform-react-final'

export const Hidden = props => {
    const {
        schema = true,
        meta,
        input: {
            name,
            onBlur,
            onFocus,
            value,
        },
    } = props

    const inputElement = <input type="hidden" name={name} value={value}/>

    if (!meta.error) {
        return inputElement
    }

    return (
        <FormControl
            component="fieldset"
            error={!!meta.error}
            onBlur={onBlur}
            onFocus={onFocus}
        >
            <FormLabel component="legend">{schema.title}</FormLabel>
            { inputElement }
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

Hidden.propTypes = FieldRenderProps
