import React from 'react'
import { FormGroup, FormControl, FormLabel, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core'

export const CheckboxGroup = props => {
    const {
        schema = true,
        meta,
        input,
    } = props

    return (
        <FormControl
            component='fieldset'
            error={!!meta.error}
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
                                onChange={(e) => { input.onChange(
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
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}
