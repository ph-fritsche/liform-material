import React from 'react'
import { Button } from '@material-ui/core'
import { SchemaProp } from 'liform-react-final'

export const ButtonWidget = props => {
    const {
        schema = true,
    } = props

    const types = ['submit', 'reset']
    let type = undefined
    if (typeof(schema.widget) === 'string') {
        type = types[types.indexOf(schema.widget)]
    } else if (Array.isArray(schema.widget)) {
        type = types.filter(t => schema.widget.indexOf(t) >= 0)[0]
    }

    return (
        <Button
            variant={ types.indexOf(type) >= 0 && 'contained' || 'text' }
            color={ type === 'submit' && 'primary' || 'default' }
            type={type}
        >
            {schema.title}
        </Button>
    )
}

ButtonWidget.propTypes = {
    schema: SchemaProp,
}
