import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined, ScheduleOutlined } from '@material-ui/icons';
import { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { compileValue } from './compileValue'
import { DateTimeInput } from './DateTimeInput'
import { DateTimeModal } from './DateTimeModal'
import { Picker } from '../Picker/Picker';

const adornmentIcon = {
    date: CalendarTodayOutlined,
    time: ScheduleOutlined,
}

const useDateAdapter = () => {
    const pickersContext = useContext(MuiPickersAdapterContext)

    return pickersContext || new DateFns()
}

export const DateTimeField = React.forwardRef(function DateTimeField(props, ref) {
    const {
        InputProps = {},

        inputComponent = DateTimeInput,
        inputProps,

        value: valueProp,
        valueFormat,
        onChange: onChangeProp,

        PickerComponent = DateTimeModal,
        PickerProps = {},

        ...others
    } = props

    const dateUtil = useDateAdapter()

    const value = useMemo(() => compileValue(dateUtil, valueProp, valueFormat), [valueProp, valueFormat])

    const onChange = useCallback(newValue => {
        onChangeProp(dateUtil.formatByString(newValue, value.format))
    }, [dateUtil, value.format])

    const onPaste = useCallback(event => {
        event.preventDefault()
        let newValue = event.clipboardData.getData('Text')
        if (!newValue) {
            return
        }
        newValue = dateUtil.date(newValue)
        if (typeof(newValue) === 'object' && String(newValue) !== 'Invalid Date') {
            onChange(newValue)
        }
    }, [dateUtil, onChange])

    const AdornmentIcon = adornmentIcon['date']

    return (<>
        <Picker
            ref={ref}
            {...others}

            onPaste={onPaste}

            InputProps={{
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><AdornmentIcon/></Typography></InputAdornment>,
                ...InputProps,
            }}

            inputComponent={inputComponent}
            inputProps={{
                ...inputProps,

                dateUtil,
                value,
                onChange,
            }}

            PickerComponent={PickerComponent}
            PickerProps={{
                ...PickerProps,

                dateUtil,
                value,
                onChange,
            }}
        />
    </>)
})
