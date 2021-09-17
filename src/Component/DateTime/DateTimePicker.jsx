import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker, PickersDay } from '@mui/lab'
import { MobileKeyboardInput } from './MobileKeyboardInput'
import { CompiledValueProp } from './compileValue'

const guessPickerComponent = (views = []) => {
    const hasDate = views.includes('year') || views.includes('month') || views.includes('date')
    const hasTime = views.includes('hours') || views.includes('minutes') || views.includes('seconds')
    return hasDate && hasTime ? StaticDateTimePicker : hasTime ? StaticTimePicker : StaticDatePicker
}

const useStyle = makeStyles(theme => ({
    highlight: {
        borderRadius: 0,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover,&:focus': {
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
        valueObject,
        onChange,

        mediaQueryDesktop = '@media (pointer: fine)',

        onClose = () => {},

        PickerComponent = guessPickerComponent(valueObject.views),
        PickerProps,
    } = props

    const style = useStyle(props)

    const isDesktop = useMediaQuery(mediaQueryDesktop)

    const onDateChange = (valueObject, variant, isFinished) => {
        onChange(valueObject)
        isFinished === 'finish' && onClose()
    }

    const renderDay = useMemo(() => {
        const hasWeek = valueObject.input.find(v => v.placeholder && ['w', 'I'].includes(v.placeholder[0]))
        const hasDay = valueObject.input.find(v => v.placeholder && ['d', 'D', 'e', 'i'].includes(v.placeholder[0]))
        if (hasWeek && !hasDay) {
            const weekStart = dateUtil.startOfWeek(valueObject.parsed)
            const weekEnd = dateUtil.endOfWeek(valueObject.parsed)

            const getDayClassName = (date) => clsx({
                [style.highlight]: dateUtil.isWithinRange(date, [weekStart, weekEnd]),
                [style.firstHighlight]: dateUtil.isSameDay(date, weekStart),
                [style.endHighlight]: dateUtil.isSameDay(date, weekEnd),
            })

            return function Day(date, selectedDates, DayComponentProps) {
                return (
                    <PickersDay
                        {...DayComponentProps}
                        className={getDayClassName(date)}
                    />
                )
            }
        }
    }, [dateUtil, valueObject, style])

    return (
        <PickerComponent
            displayStaticWrapperAs={ isDesktop ? 'desktop' : 'mobile' }
            disableMaskedInput={true}
            renderInput={({inputRef}) => (
                <MobileKeyboardInput inputRef={inputRef} dateUtil={dateUtil} valueObject={valueObject} onChange={onChange}/>
            )}
            renderDay={renderDay}
            showDaysOutsideCurrentMonth={!!renderDay}
            allowSameDateSelection={true}
            views={valueObject.views}

            // prop is required - listen to changes per onDateChange
            onChange={() => {}}

            {...PickerProps}

            value={valueObject.parsed}
            onDateChange={onDateChange}
        />
    )
}

DateTimePicker.propTypes = {
    dateUtil: PropTypes.shape({
        startOfWeek: PropTypes.func.isRequired,
        endOfWeek: PropTypes.func.isRequired,
        isWithinRange: PropTypes.func.isRequired,
        isSameDay: PropTypes.func.isRequired,
    }).isRequired,
    valueObject: CompiledValueProp.isRequired,
    onChange: PropTypes.func.isRequired,
    mediaQueryDesktop: PropTypes.string,
    onClose: PropTypes.func,
    PickerComponent: PropTypes.elementType,
    PickerProps: PropTypes.object,
}
