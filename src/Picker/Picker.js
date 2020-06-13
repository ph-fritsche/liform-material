import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker } from '@material-ui/pickers'
import { PickerInput } from './PickerInput'
import Field from '../Field/Field'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined, ScheduleOutlined, FormatSize } from '@material-ui/icons';
import { useForkedRef } from '../util/ref'
import { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { PickerModal } from './PickerModal'

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

const formatDisplayDate = (dateUtil, valueFormat, parsedDate) => {
    if (valueFormat.indexOf('d') >= 0) {
        return valueFormat.indexOf('y') >= 0
            ? dateUtil.format(parsedDate, 'fullDate')
            : valueFormat.indexOf('M') >= 0
                ? dateUtil.format(parsedDate, 'normalDate')
                : dateUtil.format(parsedDate, 'dayOfMonth')
    } else if (valueFormat.indexOf('y') >= 0) {
        return valueFormat.indexOf('W')
            ? dateUtil.formatByString(parsedDate, 'yyyy \\WWW')
            : valueFormat.indexOf('M') >= 0
                ? dateUtil.format(parsedDate, 'monthAndYear')
                : dateUtil.format(parsedDate, 'month')
    }
    return ''
}

const formatDisplayTime = (dateUtil, valueFormat, parsedDate) => {
    let display = valueFormat.indexOf('H') >= 0
        ? dateUtil.format(parsedDate, 'fullTime')
        : valueFormat.indexOf('m') >= 0
            ? ':' + dateUtil.format(parsedDate, 'minutes')
            : ''
    if (valueFormat.indexOf('s') >= 0) {
        const displaySeconds = ':' + dateUtil.format(parsedDate, 'seconds')
        display = display.indexOf(' ') >= 0
            ? display.replace(' ', displaySeconds + ' ')
            : display + displaySeconds
    }
    return display
}

const formatDisplay = (dateUtil, valueFormat, parsedDate) => {
    const displayDate = formatDisplayDate(dateUtil, valueFormat, parsedDate)
    const displayTime = formatDisplayTime(dateUtil, valueFormat, parsedDate)
    return displayDate + (displayDate && displayTime ? '\t' : '') + displayTime
}

export const Picker = React.forwardRef(function Picker(props, ref) {
    const {
        InputProps = {},

        inputComponent = PickerInput,
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
    const value = useMemo(() => {
        const parsed = valueProp && valueFormat ? dateUtil.parse(valueProp, valueFormat) : dateUtil.date(valueProp || new Date())

        if (parsed === 'Invalid date') {
            throw new Error('Invalid date supplied')
        }

        const format = String(valueFormat || "yyyy-MM-dd'T'HH:mm:ssxxx")

        const valueParts = format.match(/([a-zA-Z])\1*/g)
    
        const views = [
            valueParts.find(v => v[0] === 'y') && 'year',
            valueParts.find(v => v[0] === 'M') && 'month',
            valueParts.find(v => v[0] === 'd') && 'date',
            valueParts.find(v => v[0].toUpperCase() === 'H') && 'hours',
            valueParts.find(v => v[0] === 'm') && 'minutes',
            valueParts.find(v => v[0] === 's') && 'seconds',
        ].filter(v => Boolean(v))

        const inputFormat = [
            [
                valueParts.find(v => v[0] === 'y') && 'yyyy',
                valueParts.find(v => v[0] === 'M') && 'MM',
                valueParts.find(v => v[0] === 'd') && 'dd',    
            ].filter(v => v !== undefined).join('-'),
            [
                valueParts.find(v => v[0].toUpperCase() === 'H') && 'HH',
                valueParts.find(v => v[0] === 'm') && 'mm',
                valueParts.find(v => v[0] === 's') && 'ss',
            ].filter(v => v !== undefined).join(':'),
        ].filter(v => v !== '').join(' ')

        const input = String(inputFormat).match(/([a-zA-Z])\1*|[^a-zA-Z]+/g).map(v => (
            /[a-zA-Z]/.test(v[0])
                ? { type: 'value', placeholder: v, value: dateUtil.formatByString(parsed, v) }
                : { type: 'formatter', placeholder: v }
        ))

        const display = valueProp ? formatDisplay(dateUtil, format, parsed) : ''

        return {format, parsed, views, input, display}
    }, [valueProp, valueFormat])
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

    const [isFocusLocked, lockFocus] = useState(false)
    const [isPickerOpen, setPickerOpen] = useState(false)
    const togglePicker = open => {
        if (open === isPickerOpen) {
            return
        }
        lockFocus(open === undefined ? !isPickerOpen : open)
        setPickerOpen(open == undefined ? !isPickerOpen : open)
    }

    const AdornmentIcon = adornmentIcon['date']

    return (<>
        <Field
            ref={forkedRootRef}
            {...others}

            onClick={() => togglePicker(true)}
            onPaste={onPaste}

            isFocusLocked={isFocusLocked}

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

        <PickerModal
            anchorEl={rootRef.current}
            open={isPickerOpen}
            onClose={() => togglePicker(false)}

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
