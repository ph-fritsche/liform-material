import React from 'react'
import { LocalizationProvider } from '@material-ui/lab'
import Adapter from '@material-ui/lab/AdapterDateFns'

export function wrapInLocalization(el) {
    return (
        <LocalizationProvider dateAdapter={Adapter}>
            {el}
        </LocalizationProvider>
    )
}
