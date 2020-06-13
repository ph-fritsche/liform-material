import React, { useCallback } from 'react'
import { updateRef } from '../util/ref'

export const FieldInput = function FieldInput(props) {
    const {
        inputComponent: InputComponent = 'input',
        inputRef,

        isFocusLocked,
        focusRef,
        onBlur: onBlurProp,
        onFocus: onFocusProp,

        ...others
    } = props

    const onBlur = useCallback(event => {
        !isFocusLocked && onBlurProp && onBlurProp(event)
    }, [isFocusLocked, onBlurProp])

    const onFocus = useCallback(event => {
        !isFocusLocked && onFocusProp && onFocusProp(event)
    }, [isFocusLocked, onFocusProp])

    updateRef(focusRef, {blur: onBlur, focus: onFocus})

    return <InputComponent
        ref={inputRef}
        {...others}
        onBlur={onBlur}
        onFocus={onFocus}
    />
}

export default FieldInput