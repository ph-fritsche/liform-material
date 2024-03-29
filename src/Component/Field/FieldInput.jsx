import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { updateRef } from 'liform-util'

export const FieldInput = React.forwardRef(function FieldInput(props, ref) {
    const {
        inputComponent: InputComponent = 'input',

        isFocusLocked,
        focusRef,
        onBlur: onBlurProp,
        onFocus: onFocusProp,
        value = typeof(InputComponent) === 'string' && props.onChange ? '' : undefined,

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
        ref={ref}
        {...others}
        onBlur={onBlur}
        onFocus={onFocus}
        value={value}
    />
})

FieldInput.propTypes = {
    inputComponent: PropTypes.elementType,
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocusLocked: PropTypes.bool,
    focusRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.any,
}
