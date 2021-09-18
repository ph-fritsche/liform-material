import React from 'react'
import { FormControl, FormControlLabel, FormHelperText, Switch as MaterialSwitch } from '@mui/material'
import { FieldRenderProps } from '../liform-props'

export const Switch = props => {
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

    return (
        <FormControl
            component="div"
            error={!!meta.error}
            onBlur={onBlur}
            onFocus={onFocus}
        >
            <FormControlLabel
                control={
                    <MaterialSwitch
                        onChange={e => onChange(e.target.checked)}
                        checked={!!value}
                        name={name}
                    />
                }
                label={schema.title}
            />
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

Switch.propTypes = FieldRenderProps
