import React from 'react'
import PropTypes from 'prop-types'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from 'liform-util'
import { validateAspect, commitAspect, AspectsDateUtilProps } from './handleAspect'
import { CompiledValueProp } from './compileValue'

export const DateTimeInput = React.forwardRef(function DateTimeInput(props, ref) {
    const {
        name,
        value,

        dateUtil,
        onChange,
        valueObject,
        placeholder,

        ...others
    } = props

    const validate = useBoundFunction(validateAspect, dateUtil, valueObject)

    const commit = useBoundFunction(commitAspect, dateUtil, valueObject, onChange)

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

DateTimeInput.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    dateUtil: PropTypes.shape(AspectsDateUtilProps),
    onChange: PropTypes.func,
    valueObject: CompiledValueProp,
    placeholder: PropTypes.string,
}
