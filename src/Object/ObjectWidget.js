import React from 'react'
import { Field } from 'react-final-form'
import { FormLabel, FormHelperText, Grid } from '@material-ui/core'
import { Lifield, finalizeName, mapProperties } from 'liform-react-final'

import { getFieldError } from '../error'

export const ObjectWidget = props => {
    const {
        liform,
        name,
        schema,
        ...others
    } = props

    return (
        <Grid container
            spacing={ schema.attr.gridSpacing || (name ? 1 : 3) }
        >
            <Field
                name={finalizeName(name)}
                render={({meta}) => {
                    const error = getFieldError(liform, finalizeName(name), meta)

                    return (error || schema.title) && (
                        <Grid item xs={12}>
                            <div
                                style={{marginTop: (schema.attr.gridSpacing || (name ? 1 : 3)) * .5 - .5 + 'em' }}
                            >
                                <FormLabel component='legend' error={!!error}>{schema.title}</FormLabel>
                                <FormHelperText error={!!error}>{error || schema.description}</FormHelperText>
                            </div>
                        </Grid>
                    )
                }}
            />
            { mapProperties(schema.properties || {}, (propSchema, key) => (
                <Grid item key={key}
                    { ...(typeof(propSchema.attr.gridSize) === 'object' ? propSchema.attr.gridSize : {xs: propSchema.attr.gridSize}) }
                >
                    <Lifield key={key}
                        {...others}
                        liform={liform}
                        name={ (name || '') + ((name && String(name).slice(-1) !== ']') ? '.' : '') + key }
                        schema={ propSchema }
                        required={ Array.isArray(schema.required) && schema.required.indexOf(key) >= 0 }
                    />
                </Grid>
            )) }
        </Grid>
    )
}
