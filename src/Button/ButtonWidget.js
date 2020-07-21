import React from 'react'
import { Button } from '@material-ui/core'

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
