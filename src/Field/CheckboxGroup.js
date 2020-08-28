import React from 'react'
import { FormGroup, FormControl, FormLabel, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core'
import { FieldRenderProps } from 'liform-react-final'

export const CheckboxGroup = props => {
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
            <FormGroup>
                {(schema.enum || schema.items && schema.items.enum).map((elValue, i) =>
                    <FormControlLabel
                        key={elValue}
                        control={
                            <Checkbox
                                name={name + '[]'}
                                value={elValue}
                                checked={value.indexOf(elValue) >= 0}
                                onChange={(e) => { onChange(
                                    e.target.checked ?
                                        value.concat([elValue]) :
                                        value.filter(v => v !== elValue)
                                )}}
                            />
                        }
                        label={
                            schema.enumTitles && schema.enumTitles[i]
                            || schema.items && schema.items.enumTitles && schema.items.enumTitles[i]
                            || elValue
                        }
                    />
                )}
            </FormGroup>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

CheckboxGroup.propTypes = FieldRenderProps
