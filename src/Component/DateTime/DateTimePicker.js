import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { useMediaQuery, makeStyles } from '@material-ui/core'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker, PickersDay } from '@material-ui/pickers'
import { MobileKeyboardInput } from './MobileKeyboardInput'
import { CompiledValueProp } from './compileValue'

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
        const hasWeek = valueObject.input.find(v => v.placeholder && ['w','I'].indexOf(v.placeholder[0]) >= 0)
        const hasDay = valueObject.input.find(v => v.placeholder && ['d','D','e','i'].indexOf(v.placeholder[0]) >= 0)
        if (hasWeek && !hasDay) {
            const weekStart = dateUtil.startOfWeek(valueObject.parsed)
            const weekEnd = dateUtil.endOfWeek(valueObject.parsed)
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
    }, [dateUtil, valueObject, style])

    return (
        <PickerComponent
            displayStaticWrapperAs={ isDesktop ? 'desktop' : 'mobile' }
            disableMaskedInput={true}
            dateAdapter={dateUtil}
            renderInput={({inputRef}) => (
                <MobileKeyboardInput inputRef={inputRef} dateUtil={dateUtil} valueObject={valueObject} onChange={onChange}/>
            )}
            renderDay={renderDay}
            showDaysOutsideCurrentMonth={!!renderDay}
            views={valueObject.views}

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
    valueObject: CompiledValueProp,
    onChange: PropTypes.func.isRequired,
    mediaQueryDesktop: PropTypes.string,
    onClose: PropTypes.func,
    PickerComponent: PropTypes.elementType,
    PickerProps: PropTypes.object,
}
