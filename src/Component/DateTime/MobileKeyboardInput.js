import React, { useRef, useEffect } from 'react'
import { DateTimeInput } from './DateTimeInput'
import { Field } from 'react-final-form'
import { useForkedRef } from '../../util/ref'

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

        helperText={valueObject.input.map(p => p.placeholder).join('')}

        inputComponent={DateTimeInput}
        inputRef={inputRef}
        inputProps={{
            dateUtil,
            valueObject,
            onChange,
        }}
    />
}