import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { SchemaProp } from 'liform-react-final'

export const ButtonWidget = props => {
    const {
        schema = true,
        type = schema.widget && ['submit','reset'].find(t =>
            Array.isArray(schema.widget)
                ? schema.widget.includes(t)
                : schema.widget === t
        ) || 'button',
        ...others
    } = props

    return (
        <Button
            variant={ type && 'contained' || 'text' }
            color={ type === 'submit' && 'primary' || 'inherit' }
            type={type}
            aria-label={schema.title}
            {...others}
        >
            {schema.title}
        </Button>
    )
}

ButtonWidget.propTypes = {
    schema: SchemaProp,
    type: PropTypes.string,
}
