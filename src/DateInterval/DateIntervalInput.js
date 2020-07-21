import React from 'react'
import { validateAspect, commitAspect } from './handleAspect'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from '../util/func'

export const DateIntervalInput = React.forwardRef(function DateIntervalInput(props, ref) {
    const {
        onChange,
        value,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, value.input)

    const commit = useBoundFunction(commitAspect, value.input, onChange)

    return (
        <AspectInput
            ref={ref}
            {...others}
            validate={validate}
            commit={commit}
            aspects={value.input}
            display={value.display}
            placeholder={placeholder}
        />
    )
})