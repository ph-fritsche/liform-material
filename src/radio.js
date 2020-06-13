import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@material-ui/core'

import { getFieldError } from './error'

export const renderRadioGroup = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)
    return (
        <FormControl
            component='fieldset'
            error={!!error}
        >
            <FormLabel component='legend'>{schema.title}</FormLabel>
            <RadioGroup
                value={input.value}
                onChange={(e) => liform.form.change(name, e.target.value)}
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
            </RadioGroup>
            <FormHelperText>{error || schema.description}</FormHelperText>
        </FormControl>
    )
}

export default renderRadioGroup
