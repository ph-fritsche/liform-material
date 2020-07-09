import React, { useCallback, useMemo, useRef } from 'react'
import Field from '../Field/Field'
import { DateIntervalInput } from './DateIntervalInput'
import { InputAdornment, Typography } from '@material-ui/core'
import { CalendarTodayOutlined } from '@material-ui/icons'
import { compileValue } from './compileValue'
import { intervalToString } from '../util/date'

export const DateInterval = React.forwardRef(function DateInterval(props, ref) {
    const {
        InputProps = {},
        
        inputComponent = DateIntervalInput,
        inputProps = {},
        
        value: valueProp,
        valuePattern,
        onChange: onChangeProp,

        ...others
    } = props

    const value = useMemo(() => compileValue(valueProp, valuePattern), [valueProp, valuePattern])

    const onChange = useCallback(value => onChangeProp(intervalToString(value)), [onChangeProp])

    const inputRef = useRef()

    return (
        <Field
            ref={ref}
            {...others}

            onClick={() => inputRef.current.focus()}

            InputProps={{
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><CalendarTodayOutlined/></Typography></InputAdornment>,
                ...InputProps,
            }}

            inputComponent={inputComponent}
            inputProps={{
                ...inputProps,

                value,
                onChange,
            }}

            inputRef={inputRef}
        />
    )
})