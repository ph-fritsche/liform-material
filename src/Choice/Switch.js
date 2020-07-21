import React from 'react'
import { FormControl, FormControlLabel, FormHelperText, Switch as MaterialSwitch } from '@material-ui/core'

export const Switch = props => {
    const {
        schema = true,
        meta,
        input,
    } = props

    return (
        <FormControl
            component='div'
            error={!!meta.error}
        >
            <FormControlLabel
                control={
                    <MaterialSwitch
                        onChange={e => input.onChange(e.target.checked)}
                        checked={!!input.value}
                        name={input.name}
                    />
                }
                label={schema.title}
            />
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}
