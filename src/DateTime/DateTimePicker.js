import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { useMediaQuery, makeStyles } from "@material-ui/core"
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker, PickersDay } from '@material-ui/pickers'
import { Field } from '../Field/Field'
import { useForkedRef } from '../util/ref'
import { DateTimeInput } from './DateTimeInput'

const guessPickerComponent = (views) => {
    const hasDate = views.indexOf('year') >= 0 || views.indexOf('month') >= 0 || views.indexOf('date') >= 0
    const hasTime = views.indexOf('hours') >= 0 || views.indexOf('minutes') >= 0 || views.indexOf('seconds') >= 0
    return hasDate && hasTime ? StaticDateTimePicker : hasTime ? StaticTimePicker : StaticDatePicker
}

const useStyle = makeStyles(theme => ({
    highlight: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        "&:hover, &:focus": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    firstHighlight: {
        borderTopLeftRadius: "50%",
        borderBottomLeftRadius: "50%",
    },
    endHighlight: {
        borderTopRightRadius: "50%",
        borderBottomRightRadius: "50%",
    },
}))

export const DateTimePicker = (props) => {
    const {
        dateUtil,
        value,
        onChange,

        mediaQueryDesktop = '@media (pointer: fine)',

        onClose = () => {},

        PickerComponent = guessPickerComponent(value.views),
        PickerProps,
    } = props

    const style = useStyle(props)

    const isDesktop = useMediaQuery(mediaQueryDesktop)

    const onDateChange = (value, variant, isFinished) => {
        onChange(value)
        isFinished === 'finish' && onClose()
    }

    const renderMobileKeyboardInput = useCallback(props => {
        const mobileKeyboardInputRef = useRef()
        const inputRef = useForkedRef(props.inputRef, mobileKeyboardInputRef)
    
        useEffect(() => 
            mobileKeyboardInputRef.current.focus()
        , [])
    
        return <Field
            variant='standard'
            fullWidth={true}
            onFocus={event => event.target !== mobileKeyboardInputRef.current && mobileKeyboardInputRef.current.focus() }

            helperText={value.input.map(p => p.placeholder).join('')}

            inputComponent={DateTimeInput}
            inputRef={inputRef}
            inputProps={{
                dateUtil,
                value,
                onChange,
            }}
        />
    }, [dateUtil, value, onChange])

    const renderDay = useMemo(() => {
        const hasWeek = value.input.find(v => v.placeholder && ['w','I'].indexOf(v.placeholder[0]) >= 0)
        const hasDay = value.input.find(v => v.placeholder && ['d','D','e','i'].indexOf(v.placeholder[0]) >= 0)
        if (hasWeek && !hasDay) {
            const weekStart = dateUtil.startOfWeek(value.parsed)
            const weekEnd = dateUtil.endOfWeek(value.parsed)
            return (date, selectedDates, DayComponentProps) => (
                <PickersDay
                    {...DayComponentProps}
                    className={clsx({
                        [style.highlight]: dateUtil.isWithinRange(date, [weekStart, weekEnd]),
                        [style.firstHighlight]: dateUtil.isSameDay(date, weekStart),
                        [style.endHighlight]: dateUtil.isSameDay(date, weekEnd),
                    })}
                />
            )
        }
    }, [dateUtil, value])

    return (
        <PickerComponent
            displayStaticWrapperAs={ isDesktop ? 'desktop' : 'mobile' }
            disableMaskedInput={true}
            dateAdapter={dateUtil}
            renderInput={renderMobileKeyboardInput}
            renderDay={renderDay}
            showDaysOutsideCurrentMonth={!!renderDay}
            views={value.views}

            {...PickerProps}

            value={value.parsed}
            onDateChange={onDateChange}
        />
    )
}