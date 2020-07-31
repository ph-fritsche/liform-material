import React, { useCallback, useMemo, useRef } from 'react'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined } from '@material-ui/icons'
import { Field } from '../Field/Field'
import { intervalToString } from '../../util/date'
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

    const onChange = useCallback(value => onChangeProp(intervalToString(value)), [onChangeProp])

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