import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker } from '@material-ui/pickers'
import { DateTimeInput } from './DateTimeInput'
import Field from '../Field/Field'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined, ScheduleOutlined, FormatSize } from '@material-ui/icons';
import { useForkedRef } from '../util/ref'
import { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { DateTimeModal } from './DateTimeModal'
import { compileValue } from './util'

const adornmentIcon = {
    date: CalendarTodayOutlined,
    time: ScheduleOutlined,
}

const guessPickerComponent = (views) => {
    const hasDate = views.indexOf('year') >= 0 || views.indexOf('month') >= 0 || views.indexOf('date') >= 0
    const hasTime = views.indexOf('hours') >= 0 || views.indexOf('minutes') >= 0 || views.indexOf('seconds') >= 0
    return hasDate && hasTime ? StaticDateTimePicker : hasTime ? StaticTimePicker : StaticDatePicker
}

const useDateAdapter = () => {
    const pickersContext = useContext(MuiPickersAdapterContext)

    return pickersContext || new DateFns()
}

export const DateTime = React.forwardRef(function DateTime(props, ref) {
    const {
        InputProps = {},

        inputComponent = DateTimeInput,
        inputProps,

        value: valueProp,
        valueFormat,
        onChange: onChangeProp,

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

        <DateTimeModal
            anchorEl={rootRef.current}
            open={isPickerOpen}
            onClose={() => isPickerOpen && setPickerOpen(false)}

            PickerComponent={PickerComponent || guessPickerComponent(value.views)}
            PickerProps={{
                ...PickerProps,
                views: PickerProps.views || value.views,
            }}

            {...{
                dateUtil,
                value,
                onChange,
            }}
        />
    </>)
})
