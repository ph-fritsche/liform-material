import React from 'react'
import { FormControl, FormLabel, FormControlLabel, Radio, RadioGroup, FormHelperText } from '@material-ui/core'

export const renderRadioGroup = ({name, schema, meta, input, ...props}) => {
    return (
        <FormControl
            component='fieldset'
            error={!!meta.error}
        >
            <FormLabel component='legend'>{schema.title}</FormLabel>
            <RadioGroup
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
            </RadioGroup>
            <FormHelperText>{meta.error || schema.description}</FormHelperText>
        </FormControl>
    )
}

export default renderRadioGroup
