import React, { useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DateTimeInput } from './DateTimeInput'
import { Field } from '../Field/Field'
import { useForkedRef } from 'liform-util'
import { CompiledValueProp } from './compileValue'

export function MobileKeyboardInput (props) {
    const {
        inputRef: inputRefProp,
        dateUtil,
        valueObject,
        onChange,
    } = props

    const mobileKeyboardInputRef = useRef()
    const inputRef = useForkedRef(inputRefProp, mobileKeyboardInputRef)

    useEffect(() =>
        mobileKeyboardInputRef.current.focus()
    , [])

    return <Field
        variant="standard"
        fullWidth={true}
        onFocus={event => event.target !== mobileKeyboardInputRef.current && mobileKeyboardInputRef.current.focus() }
        value={valueObject.display}

        helperText={valueObject.input.map(p => Object.keys(p).includes('value')? p.placeholder : p.text).join('')}

        inputComponent={DateTimeInput}
        inputRef={inputRef}
        inputProps={{
            dateUtil,
            valueObject,
            onChange,
        }}
    />
}

MobileKeyboardInput.propTypes = {
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    dateUtil: PropTypes.object,
    valueObject: CompiledValueProp,
    onChange: PropTypes.func,
}
