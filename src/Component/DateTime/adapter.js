import { useContext } from 'react'
import { MuiPickersAdapterContext } from '@mui/lab'

export const useAdapter = () => {
    return useContext(MuiPickersAdapterContext)
}
