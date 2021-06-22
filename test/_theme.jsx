import React from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core'

const muiTheme = createTheme()

export function wrapInTheme(el) {
    return (
        <ThemeProvider theme={muiTheme}>
            {el}
        </ThemeProvider>
    )
}
