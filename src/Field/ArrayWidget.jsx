import React from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'
import { Lifield, liformizeName, finalizeName } from 'liform-react-final'
import { FormGroup, FormControl, FormLabel, FormHelperText, IconButton } from '@mui/material'
import { RemoveCircleOutline, AddCircleOutline } from '@mui/icons-material'

import { getFieldError } from './error'

export const ArrayWidget = props => {
    const {
        liform,
        name,
        schema = true,

        ...others
    } = props

    return (
        <FieldArray
            name={finalizeName(name)}
            render={({fields, meta}) => {
                const error = getFieldError(liform, name, meta)

                return (
                    <FormControl
                        component="fieldset"
                        error={!!error}
                    >
                        <FormLabel component="legend" error={!!error}>{schema.title}</FormLabel>
                        <FormHelperText error={!!error}>{error || schema.description}</FormHelperText>
                        <FormGroup>
                            { fields.map((name, index) => (
                                <div key={name} style={{display: 'flex'}}>
                                    <Lifield
                                        {...others}
                                        name={liformizeName(`${name}`)}
                                        placeholder={schema.placeholder}
                                        schema={
                                            Array.isArray(schema.items)
                                                ? (index <= schema.items.length ? schema.items[index] : schema.additionalItems)
                                                : schema.items
                                        }
                                    />
                                    { (schema.allowDelete || Array.isArray(meta.initial) && index >= meta.initial.length)
                                        && <IconButton onClick={() => fields.remove(index)} style={{fontSize: '.75em'}} aria-label="Remove entry">
                                            <RemoveCircleOutline/>
                                        </IconButton>
                                    }
                                </div>
                            )) }
                            { (schema.allowAdd || fields.length < (Array.isArray(meta.initial) ? meta.initial.length : 0))
                                && <IconButton onClick={() => fields.push()} style={{width: '3em', fontSize: '.75em'}} aria-label="Add entry">
                                    <AddCircleOutline/>
                                </IconButton>
                            }
                        </FormGroup>
                    </FormControl>
                )
            }}
        />
    )
}

ArrayWidget.propTypes = {
    liform: PropTypes.object.isRequired,
    schema: PropTypes.any,
    name: PropTypes.string,
}
