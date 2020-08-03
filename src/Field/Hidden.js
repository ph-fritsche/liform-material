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
            onChange,
            value,
        },
    } = props

    if (!meta.errors) {
        return <input type="hidden" name={name} value={value} onChange={e => onChange(e.target.value)} onBlur={e => onChange(e.target.value)}/>
    }

    return (
        <FormControl
            component="fieldset"
            error={!!meta.error}
            onBlur={onBlur}
            onFocus={onFocus}
        >
            <FormLabel component="legend">{schema.title}</FormLabel>
            <input type="hidden" name={name} value={value} onChange={e => onChange(e.target.value)} onBlur={e => onChange(e.target.value)}/>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

Hidden.propTypes = FieldRenderProps
