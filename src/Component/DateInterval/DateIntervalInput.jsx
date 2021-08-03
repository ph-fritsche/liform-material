import React from 'react'
import PropTypes from 'prop-types'
import { validateAspect, commitAspect } from './handleAspect'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from 'liform-util'
import { CompiledValueProp } from './compileValue'

export const DateIntervalInput = React.forwardRef(function DateIntervalInput(props, ref) {
    const {
        name,
        value,

        onChange,
        valueObject,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, valueObject.input)

    const commit = useBoundFunction(commitAspect, valueObject.input, onChange)

    return <>
        <AspectInput
            ref={ref}
            {...others}
            validate={validate}
            commit={commit}
            aspects={valueObject.input}
            display={valueObject.display}
            placeholder={placeholder}
        />
        <input type="hidden" name={name} value={value}/>
    </>
})

DateIntervalInput.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    valueObject: CompiledValueProp,
    placeholder: PropTypes.string,
}
