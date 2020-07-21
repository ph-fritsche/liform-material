import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined, ScheduleOutlined } from '@material-ui/icons';
import { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { Field } from '../Field/Field'
import { useForkedRef } from '../util/ref'
import { compileValue } from './compileValue'
import { DateTimeInput } from './DateTimeInput'
import { DateTimeModal } from './DateTimeModal'

const adornmentIcon = {
    date: CalendarTodayOutlined,
    time: ScheduleOutlined,
}

const useDateAdapter = () => {
    const pickersContext = useContext(MuiPickersAdapterContext)

    return pickersContext || new DateFns()
}

export const DateTimePicker = React.forwardRef(function DateTimePicker(props, ref) {
    const {
        InputProps = {},

        inputComponent = DateTimeInput,
        inputProps,

        value: valueProp,
        valueFormat,
        onChange: onChangeProp,

        ModalComponent = DateTimeModal,

        PickerComponent,
        PickerProps = {},

        ...others
    } = props

    const rootRef = useRef()
    const forkedRootRef = useForkedRef(ref, rootRef)

    const dateUtil = useDateAdapter()

    const value = useMemo(() => compileValue(dateUtil, valueProp, valueFormat), [valueProp, valueFormat])

    const onChange = useCallback(newValue => {
        onChangeProp(dateUtil.formatByString(newValue, value.format))
    }, [dateUtil, value.format])
    const onPaste = event => {
        event.preventDefault()
        let newValue = event.clipboardData.getData('Text')
        if (!newValue) {
            return
        }
        newValue = dateUtil.date(newValue)
        if (typeof(newValue) === 'object' && String(newValue) !== 'Invalid Date') {
            onChange(newValue)
        }
    }

    const [isPickerOpen, setPickerOpen] = useState(false)

    const AdornmentIcon = adornmentIcon['date']

    return (<>
        <Field
            ref={forkedRootRef}
            {...others}

            onClick={() => !isPickerOpen && setPickerOpen(true)}
            onPaste={onPaste}

            isFocusLocked={isPickerOpen}

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
        />

        <ModalComponent
            anchorEl={rootRef.current}
            open={isPickerOpen}
            onClose={() => isPickerOpen && setPickerOpen(false)}

            PickerComponent={PickerComponent}
            PickerProps={PickerProps}

            {...{
                dateUtil,
                value,
                onChange,
            }}
        />
    </>)
})
