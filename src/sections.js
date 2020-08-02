import React from 'react'
import PropTypes from 'prop-types'
import { Lifield, finalizeName } from 'liform-react-final'
import { Grid, FormControl, FormLabel, FormHelperText } from '@material-ui/core'
import { FormRenderProps } from 'liform-react-final'

export const Form = props => {
    const {
        liform: {
            schema = true,
        },
    } = props
    return <Lifield schema={schema}/>
}

Form.propTypes = FormRenderProps

export const Action = props => {
    const {
        liform: {
            schema = true,
        },
    } = props

    return (
        <Grid container
            spacing={ schema.attr && schema.attr.gridSpacing || 3 }
            justify="space-evenly"
        >
            <Grid item>
                <Lifield
                    schema={{        
                        widget: ['reset','button'],
                        title: 'Reset',
                    }}
                />
            </Grid>
            <Grid item>
                <Lifield
                    schema={{        
                        widget: ['submit','button'],
                        title: 'Submit',
                    }}
                />
            </Grid>
        </Grid>
    )
}

Action.propTypes = FormRenderProps

const Errors = ({errors, title}) => (
    <Grid item xs={12}>
        <FormControl error={true}>
            <FormLabel error={true}>{title}</FormLabel>
            { errors.map((e,i) => <FormHelperText key={i} error={true}>{e}</FormHelperText>) }
        </FormControl>
    </Grid>
)

Errors.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
}

export const FormErrors = (props) => {
    const {
        liform: {
            form,
            schema = true,
            meta: {
                errors = {},
            },
        },
    } = props

    const registered = form.getRegisteredFields()
    const errorPaths = Object.keys(errors).filter(key => registered.indexOf(finalizeName(key)) < 0)

    return errorPaths.length === 0
        ? null
        : (
            <Grid container
                spacing={ schema.attr && schema.attr.gridSpacing || 3 }
                justify="space-evenly"
            >
                { errorPaths.map(propertyPath => <Errors key={propertyPath} title={propertyPath} errors={errors[propertyPath]}/>) }
            </Grid>
        )
}

FormErrors.propTypes = FormRenderProps
