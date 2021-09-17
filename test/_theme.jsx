import React from 'react'
import { createTheme, ThemeProvider } from '@mui/material'

const muiTheme = createTheme()

export function wrapInTheme(el) {
    return (
        <ThemeProvider theme={muiTheme}>
            {el}
        </ThemeProvider>
    )
}
