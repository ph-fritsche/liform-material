import React from 'react'
import { Button } from '@material-ui/core'
import { SchemaProp } from 'liform-react-final/dist/schema'

export const ButtonWidget = props => {
    const {
        schema = true,
    } = props

    return (
        <Button variant="contained" color="primary">
            {schema.title}
        </Button>
    )
}

ButtonWidget.propTypes = {
    schema: SchemaProp,
}
