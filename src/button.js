import React, { useMemo } from 'react'
import { Button } from '@material-ui/core'

export const ButtonWidget = ({name, schema, ...props}) => {
    return (
        <Button variant="contained" color="primary">
            {schema.title}
        </Button>
    )
}

export default ButtonWidget
