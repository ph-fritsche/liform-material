import React, { useMemo } from 'react'
import { validateAspect, commitAspect } from './util'
import AspectInput from '../AspectInput/AspectInput'

export const DateIntervalInput = React.forwardRef(function DateIntervalInput(props, ref) {
    const {
        onChange,
        value,
        placeholder,

        ...others
    } = props

    const validate = useMemo(() => validateAspect.bind(undefined, value.input), [value])

    const commit = useMemo(() => commitAspect.bind(undefined, value.input, onChange), [value, onChange])

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