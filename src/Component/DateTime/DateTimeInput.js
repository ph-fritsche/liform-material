import React from 'react'
import PropTypes from 'prop-types'
import { AspectInput } from '../AspectInput/AspectInput'
import { useBoundFunction } from '../../util/func'
import { validateAspect, commitAspect, AspectsDateUtilProps } from './handleAspect'
import { CompiledValueProp } from './compileValue'

export const DateTimeInput = React.forwardRef(function DateTimeInput(props, ref) {
    const {
        dateUtil,
        onChange,
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

DateTimeInput.propTypes = {
    dateUtil: PropTypes.shape(AspectsDateUtilProps),
    onChange: PropTypes.func,
    valueObject: CompiledValueProp,
    placeholder: PropTypes.string,
}
