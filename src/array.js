import React from 'react'
import { FieldArray } from 'react-final-form-arrays'
import Lifield, { liformizeName, finalizeName } from 'liform-react-final/dist/field'
import { FormGroup, FormControl, FormLabel,FormHelperText, IconButton } from '@material-ui/core'

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
                    <FormLabel component='legend' error={!!error}>{schema.title}</FormLabel>
                    <FormHelperText error={!!error}>{error || schema.description}</FormHelperText>
                    <FormGroup>
                        { fields.map((name, index) => (
                            <div key={name} style={{display: 'flex'}}>
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
                                    <IconButton onClick={() => fields.remove(index)} color="text.secondary" style={{fontSize: '.75em'}}>
                                        ❌
                                    </IconButton>
                                }
                            </div>
                        )) }
                        { schema.allowAdd &&
                            <IconButton onClick={() => fields.push()} color="text.secondary" style={{width: '3em', fontSize: '.75em'}}>
                                ➕
                            </IconButton>
                        }
                    </FormGroup>
                </FormControl>
            )
        }}
    />
)

export default ArrayWidget
