import React, { useCallback } from 'react'
import { InputAdornment } from '@material-ui/core'
import { BaseRender } from './BaseRender'

export const NumberRender = props => {
    const {
        schema = true,
        input,

        InputProps,
    } = props

    const {
        onChange: onChangeProp,
        onBlur: onBlurProp,
        value: valueProp,
    } = input

    const type = input.type || (schema.type === 'number' || schema.type === 'integer' ? 'number' : undefined)
    const step = schema.step || (schema.type === 'integer' ? 1 : 0.1)

    const onChange = useCallback(event => {
        const v = event.target.value !== '' ? Number(event.target.value) : undefined
        // accept empty values if the change was triggered by deleting the only char
        if (v === undefined && event.nativeEvent.inputType === 'deleteContentBackward'
        // accept everything else if it is a valid number
            || v == event.target.value && (schema.type !== 'integer' || Number.isInteger(v))
        ) {
            onChangeProp(v)
        }
    }, [schema, onChangeProp])

    const onBlur = useCallback(event => {
        let v
        if (event.target.value !== '') {
            v = Number(event.target.value)
            const step = schema.step || schema.type === 'integer' && 1 || undefined
            if (step) {
                v = Math.round(v / step) * step
                const dotPos = String(step).indexOf('.')
                if (dotPos >= 0) {
                    v = Number(v.toFixed(String(step).length - dotPos - 1))
                }
            }
        } else {
            v = undefined
        }

        const oldVal = valueProp !== '' ? valueProp : undefined
        if (v !== oldVal) {
            onChangeProp(v)
        }

        onBlurProp(event)
    }, [schema, valueProp, onChangeProp, onBlurProp])

    const value = valueProp ?? ''

    return (
        <BaseRender
            step={step}
            type={type}

            {...props}

            input={{
                ...input,
                onChange,
                onBlur,
                value,
            }}
            InputProps={{
                endAdornment: schema.symbol && <InputAdornment position="end">{schema.symbol}</InputAdornment>,
                ...InputProps,
            }}
        />
    )
}