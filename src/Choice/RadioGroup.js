import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup as MaterialRadioGroup, FormHelperText } from '@material-ui/core'

export const RadioGroup = props => {
    const {
        schema = true,
        meta,
        input,
    } = props

    return (
        <FormControl
            component="fieldset"
            error={!!meta.error}
        >
            <FormLabel component="legend">{schema.title}</FormLabel>
            <MaterialRadioGroup
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
            >
                {(schema.enum || schema.items && schema.items.enum).map(elValue =>
                    <FormControlLabel
                        key={elValue}
                        control={
                            <Radio value={elValue}/>
                        }
                        label={
                            schema.enumTitles && schema.enumTitles[elValue]
                            || schema.items && schema.items.enumTitles && schema.items.enumTitles[elValue]
                            || elValue
                        }
                    />
                )}
            </MaterialRadioGroup>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}
