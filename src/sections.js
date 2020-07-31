import React from 'react'
import { Lifield, finalizeName } from 'liform-react-final'
import { Grid } from '@material-ui/core'

export const Form = (props) => (
    <Lifield
        schema={props.liform.schema}
    />
)

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

export const FormErrors = (props) => {
    if (!props.liform.meta.errors) {
        return null
    }

    const registered = props.liform.form.getRegisteredFields()
    const errorPaths = Object.keys(props.liform.meta.errors).filter(key => registered.indexOf(finalizeName(key)) < 0)
    const Errors = ({errors, title}) => (
        <div className="liform-error-group">
            { title && <strong>{title}</strong> }
            { errors.map((e,i) => <div key={i} className="liform-error">{e}</div>) }
        </div>
    )

    return <div className="liform-errors">
        { errorPaths.map(propertyPath => <Errors key={propertyPath} title={propertyPath} errors={props.liform.meta.errors[propertyPath]}/>) }
    </div>
}
