import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import Lifield, { liformizeName, finalizeName } from 'liform-react-final/dist/field'
import { Button, FormGroup, FormControl, FormLabel,FormHelperText } from '@material-ui/core'

import { getFieldError } from './error'

export const ArrayWidget = ({liform, name, schema, ...props}) => (
    <FieldArray
        name={finalizeName(name)}
        render={({fields, meta}) => {
            const error = getFieldError(liform, finalizeName(name), meta)
            return (
                <FormControl
                    component='fieldset'
                    error={!!error}
                >
                    <FormLabel component='legend'>{schema.title}</FormLabel>
                    <FormHelperText>{error || schema.description}</FormHelperText>
                    <FormGroup>
                        { fields.map((name, index) => (
                            <FormGroup key={name}>
                                <Lifield
                                    {...props}
                                    liform={liform}
                                    name={liformizeName(`${name}`)}
                                    schema={
                                        Array.isArray(schema.items) ?
                                            (index <= schema.items.length ? schema.items[index] : schema.additionalItems) : 
                                            schema.items
                                    }
                                />
                                { (schema.allowDelete || Array.isArray(meta.initial) && index >= meta.initial.length) &&
                                    <Button onClick={() => fields.remove(index)}>
                                        ❌
                                    </Button>
                                }
                            </FormGroup>
                        )) }
                        { schema.allowAdd &&
                            <Button onClick={() => fields.push()}>
                                ➕
                            </Button>
                        }
                    </FormGroup>
                </FormControl>
            )
        }}
    />
)

export default ArrayWidget
