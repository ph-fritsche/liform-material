import React from 'react'
import { FormControl, FormControlLabel, FormHelperText, Switch } from '@material-ui/core'

import { getFieldError } from './error'

export const renderSwitch = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)

    return (
        <FormControl
            component='div'
            error={!!error}
        >
            <FormControlLabel
                control={
                    <Switch
                        onChange={e => {liform.form.change(name, e.target.checked)}}
                        checked={!!input.value}
                        name={input.name}
                    />
                }
                label={schema.title}
            />
            <FormHelperText>{error || schema.description}</FormHelperText>
        </FormControl>
    )
}

export default renderSwitch
