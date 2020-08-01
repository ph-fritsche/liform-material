import React from 'react'
import PropTypes from 'prop-types'
import { validateAspect, commitAspect } from './handleAspect'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from '../../util/func'
import { CompiledValueProp } from './compileValue'

export const DateIntervalInput = React.forwardRef(function DateIntervalInput(props, ref) {
    const {
        onChange,
        value,
        valueObject,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, valueObject.input)

    const commit = useBoundFunction(commitAspect, valueObject.input, onChange)

    return (
        <AspectInput
            ref={ref}
            {...others}
            validate={validate}
            commit={commit}
            aspects={valueObject.input}
            display={valueObject.display}
            placeholder={placeholder}
        />
    )
})

DateIntervalInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any,
    valueObject: CompiledValueProp,
    placeholder: PropTypes.string,
}
