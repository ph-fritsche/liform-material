import { useContext } from 'react'
import { MuiPickersAdapterContext } from '@material-ui/lab'

export const useAdapter = () => {
    return useContext(MuiPickersAdapterContext)
}
