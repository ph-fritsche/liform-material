import React, { useMemo } from 'react'
import clsx from 'clsx'
import { useMediaQuery, makeStyles } from '@material-ui/core'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker, PickersDay } from '@material-ui/pickers'
import { MobileKeyboardInput } from './MobileKeyboardInput'

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
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark,
        },
    },
    firstHighlight: {
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
    },
    endHighlight: {
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%',
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

    const renderDay = useMemo(() => {
        const hasWeek = value.input.find(v => v.placeholder && ['w','I'].indexOf(v.placeholder[0]) >= 0)
        const hasDay = value.input.find(v => v.placeholder && ['d','D','e','i'].indexOf(v.placeholder[0]) >= 0)
        if (hasWeek && !hasDay) {
            const weekStart = dateUtil.startOfWeek(value.parsed)
            const weekEnd = dateUtil.endOfWeek(value.parsed)
            return function Day(date, selectedDates, DayComponentProps) {
                return (
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
        }
    }, [dateUtil, value, style])

    return (
        <PickerComponent
            displayStaticWrapperAs={ isDesktop ? 'desktop' : 'mobile' }
            disableMaskedInput={true}
            dateAdapter={dateUtil}
            renderInput={({inputRef}) => (
                <MobileKeyboardInput inputRef={inputRef} dateUtil={dateUtil} value={value} onChange={onChange}/>
            )}
            renderDay={renderDay}
            showDaysOutsideCurrentMonth={!!renderDay}
            views={value.views}

            {...PickerProps}

            value={value.parsed}
            onDateChange={onDateChange}
        />
    )
}
