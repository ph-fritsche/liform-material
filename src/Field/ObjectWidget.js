import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'
import { FormLabel, FormHelperText, Grid } from '@material-ui/core'
import { Lifield, finalizeName, mapProperties } from 'liform-react-final'

import { getFieldError } from '../error'
import { LiformContextProp } from 'liform-react-final/dist/form'
import { SchemaProp } from 'liform-react-final/dist/schema'

export const ObjectWidget = props => {
    const {
        liform,
        name,
        schema,
        ...others
    } = props

    const gridSpacing = getAttrProp(schema, 'gridSpacing') ?? (name ? 1 : 3)

    return (
        <fieldset style={{margin: 0, padding: 0, border: 0}}>
            <legend style={{width: 0, height: 0, overflow: 'hidden'}}>
                {schema.title}
            </legend>
            <Grid container
                spacing={gridSpacing}
            >
                <Field
                    name={finalizeName(name)}
                    render={({meta}) => {
                        const error = getFieldError(liform, finalizeName(name), meta)

                        return (error || schema.title) && (
                            <Grid item xs={12}>
                                <div
                                    style={{marginTop: gridSpacing * .5 - .5 + 'em' }}
                                >
                                    <FormLabel error={!!error} aria-hidden="true">{schema.title}</FormLabel>
                                    <FormHelperText error={!!error}>{error || schema.description}</FormHelperText>
                                </div>
                            </Grid>
                        )
                    }}
                />
                { mapProperties(schema.properties || {}, (propSchema, key) => {
                    const gridSize = getAttrProp(propSchema, 'gridSize')
                    return (
                        <Grid item key={key}
                            { ...(typeof(gridSize) === 'object' ? gridSize : {xs: gridSize}) }
                        >
                            <Lifield key={key}
                                {...others}
                                name={ (name || '') + ((name && String(name).slice(-1) !== ']') ? '.' : '') + key }
                                schema={ propSchema }
                                required={ Array.isArray(schema.required) && schema.required.indexOf(key) >= 0 }
                            />
                        </Grid>
                    )
                }) }
            </Grid>
        </fieldset>
    )
}

ObjectWidget.propTypes = {
    liform: LiformContextProp,
    schema: SchemaProp,
    name: PropTypes.string,
}

function getAttrProp(schema, propName) {
    return schema.attr && schema.attr[propName]
}
