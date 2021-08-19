import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup as MaterialRadioGroup, FormHelperText } from '@material-ui/core'
import { FieldRenderProps } from '../liform-props'

export const RadioGroup = props => {
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
            component="fieldset"
            error={!!meta.error}
            onBlur={onBlur}
            onFocus={onFocus}
        >
            <FormLabel component="legend">{schema.title}</FormLabel>
            <MaterialRadioGroup
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {(schema.enum || schema.items && schema.items.enum).map((elValue, i) =>
                    <FormControlLabel
                        key={elValue}
                        control={
                            <Radio value={elValue}/>
                        }
                        label={
                            schema.enumTitles && schema.enumTitles[i]
                            || schema.items && schema.items.enumTitles && schema.items.enumTitles[i]
                            || elValue
                        }
                    />,
                )}
            </MaterialRadioGroup>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

RadioGroup.propTypes = FieldRenderProps
