import React from 'react'
import { LocalizationProvider } from '@mui/lab'
import Adapter from '@mui/lab/AdapterDateFns'

export function wrapInLocalization(el) {
    return (
        <LocalizationProvider dateAdapter={Adapter}>
            {el}
        </LocalizationProvider>
    )
}
