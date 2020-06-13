import React from 'react'
import { FormGroup, FormControl, FormLabel, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core'

import { getFieldError } from './error'

export const renderCheckboxGroup = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)
    return (
        <FormControl
            component='fieldset'
            error={!!error}
        >
            <FormLabel component='legend'>{schema.title}</FormLabel>
            <FormGroup>
                {(schema.enum || schema.items && schema.items.enum).map(elValue =>
                    <FormControlLabel
                        key={elValue}
                        control={
                            <Checkbox
                                name={input.name + '[]'}
                                value={elValue}
                                checked={input.value.indexOf(elValue) >= 0}
                                onChange={(e) => { liform.form.change(
                                    name,
                                    e.target.checked ?
                                        input.value.concat([elValue]) :
                                        input.value.filter(v => v !== elValue)
                                )}}
                            />
                        }
                        label={
                            schema.enumTitles && schema.enumTitles[elValue]
                            || schema.items && schema.items.enumTitles && schema.items.enumTitles[elValue]
                            || elValue
                        }
                    />
                )}
            </FormGroup>
            <FormHelperText>{error || schema.description}</FormHelperText>
        </FormControl>
    )
}

export default renderCheckboxGroup
