import React from 'react'
import PropTypes from 'prop-types'
import { Lifield, finalizeName } from 'liform-react-final'
import { Grid } from '@material-ui/core'
import { LiformContextProp } from 'liform-react-final/dist/form'

export const Form = (props) => (
    <Lifield
        schema={props.liform.schema}
    />
)

Form.propTypes = {
    liform: LiformContextProp.isRequired,
}

export const Action = ({liform: { schema }}) => (
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

Action.propTypes = {
    liform: LiformContextProp.isRequired,
}

const Errors = ({errors, title}) => (
    <div className="liform-error-group">
        { title && <strong>{title}</strong> }
        { errors.map((e,i) => <div key={i} className="liform-error">{e}</div>) }
    </div>
)

Errors.propTypes = {
    errors: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
}

export const FormErrors = (props) => {
    if (!props.liform.meta.errors) {
        return null
    }

    const registered = props.liform.form.getRegisteredFields()
    const errorPaths = Object.keys(props.liform.meta.errors).filter(key => registered.indexOf(finalizeName(key)) < 0)

    return <div className="liform-errors">
        { errorPaths.map(propertyPath => <Errors key={propertyPath} title={propertyPath} errors={props.liform.meta.errors[propertyPath]}/>) }
    </div>
}

FormErrors.propTypes = {
    liform: LiformContextProp.isRequired,
}
