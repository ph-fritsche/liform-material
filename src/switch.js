import React from 'react'
import { FormControl, FormControlLabel, FormHelperText, Switch } from '@material-ui/core'

export const renderSwitch = ({name, schema, meta, input, ...props}) => {
    return (
        <FormControl
            component='div'
            error={!!meta.error}
        >
            <FormControlLabel
                control={
                    <Switch
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

export default renderSwitch
