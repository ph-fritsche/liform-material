import React from 'react'
import { Field } from 'react-final-form'
import { FormGroup, FormControl, FormLabel, FormHelperText } from '@material-ui/core'
import Lifield, { finalizeName } from 'liform-react-final/dist/field'
import { mapProperties } from 'liform-react-final/dist/properties'

import { getFieldError } from './error'

export const ObjectWidget = ({liform, name, schema, ...props}) => (
    <Field
        name={finalizeName(name)}
        subscription="error"
        render={({meta}) => {
            const error = getFieldError(liform, finalizeName(name), meta)
            return (
                <FormControl
                    component='fieldset'
                    error={!!error}
                >
                    <FormLabel component='legend'>{schema.title}</FormLabel>
                    <FormHelperText>{error || schema.description}</FormHelperText>
                    <FormGroup>
                        { mapProperties(schema.properties || {}, (propSchema, key) => (
                            <Lifield key={key}
                                {...props}
                                liform={liform}
                                name={ (name || '') + ((name && String(name).slice(-1) !== ']') ? '.' : '') + key }
                                schema={ propSchema }
                                required={ Array.isArray(schema.required) && schema.required.indexOf(key) >= 0 }
                            />
                        )) }
                    </FormGroup>
                </FormControl>
            )
        }}
    />
)

export default ObjectWidget
