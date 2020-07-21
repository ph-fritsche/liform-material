import React from 'react'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from '../util/func'
import { validateAspect, commitAspect } from './handleAspect'

export const DateTimeInput = React.forwardRef(function DateTimeInput(props, ref) {
    const {
        dateUtil,
        onChange,
        value,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, dateUtil, value)

    const commit = useBoundFunction(commitAspect, dateUtil, value, onChange)

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
