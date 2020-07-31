import React from 'react'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from '../../util/func'
import { validateAspect, commitAspect } from './handleAspect'

export const DateTimeInput = React.forwardRef(function DateTimeInput(props, ref) {
    const {
        dateUtil,
        onChange,
        value,
        valueObject,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, dateUtil, valueObject)

    const commit = useBoundFunction(commitAspect, dateUtil, valueObject, onChange)

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
