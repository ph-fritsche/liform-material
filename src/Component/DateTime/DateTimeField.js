import React, { useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined, ScheduleOutlined } from '@material-ui/icons';
import { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { compileValue } from './compileValue'
import { DateTimeInput } from './DateTimeInput'
import { DateTimePicker } from './DateTimePicker'
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

        value,
        valueFormat,
        onChange: onChangeProp,

        PickerComponent = DateTimePicker,
        PickerProps = {},

        ...others
    } = props

    const dateUtil = useDateAdapter()

    const valueObject = useMemo(() => compileValue(dateUtil, value, valueFormat), [dateUtil, value, valueFormat])

    const onChange = useCallback(newValue => {
        onChangeProp(dateUtil.formatByString(newValue, valueObject.format))
    }, [onChangeProp, dateUtil, valueObject.format])

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
            value={value}
            {...others}

            onPaste={onPaste}

            InputProps={{
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><AdornmentIcon/></Typography></InputAdornment>,
                ...InputProps,
            }}

            inputComponent={inputComponent}
            inputProps={{
                ...inputProps,

                dateUtil,
                valueObject,
                onChange,
            }}

            PickerComponent={PickerComponent}
            PickerProps={{
                ...PickerProps,

                dateUtil,
                valueObject,
                onChange,
            }}
        />
    </>)
})

DateTimeField.propTypes = {
    InputProps: PropTypes.object,
    inputComponent: PropTypes.elementType,
    inputProps: PropTypes.object,
    value: PropTypes.string,
    valueFormat: PropTypes.string,
    onChange: PropTypes.func,
    PickerComponent: PropTypes.elementType,
    PickerProps: PropTypes.object,
}
