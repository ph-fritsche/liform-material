import React, { useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { InputAdornment, Typography } from '@mui/material'
import { CalendarTodayOutlined } from '@mui/icons-material'
import { Field } from '../Field/Field'
import { Interval } from 'liform-util'
import { compileValue } from './compileValue'
import { DateIntervalInput } from './DateIntervalInput'

export const DateIntervalField = React.forwardRef(function DateIntervalField(props, ref) {
    const {
        InputProps = {},

        inputComponent = DateIntervalInput,
        inputProps = {},

        value,
        valuePattern,
        onChange: onChangeProp,

        ...others
    } = props

    const valueObject = useMemo(() => compileValue(value, valuePattern), [value, valuePattern])

    const onChange = useCallback(value => {
        const interval = new Interval()
        for (const k in value) {
            interval[k] = value[k]
        }
        onChangeProp(String(interval))
    }, [onChangeProp])

    const inputRef = useRef()

    return (
        <Field
            ref={ref}
            value={value}
            {...others}

            onClick={() => inputRef.current.focus()}

            InputProps={{
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><CalendarTodayOutlined/></Typography></InputAdornment>,
                ...InputProps,
            }}

            inputComponent={inputComponent}
            inputProps={{
                ...inputProps,

                value,
                valueObject,
                onChange,
            }}

            inputRef={inputRef}
        />
    )
})

DateIntervalField.propTypes = {
    InputProps: PropTypes.object,
    inputComponent: PropTypes.elementType,
    inputProps: PropTypes.object,
    value: PropTypes.string,
    valuePattern: PropTypes.string,
    onChange: PropTypes.func,
}
