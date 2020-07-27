import React, { useCallback } from 'react'
import { Choice } from './Choice'
import { BaseRender } from './BaseRender'

export const StringRender = props => {
    const {
        schema = true,
    } = props

    return (schema.enum || schema.items)
        ? <Choice {...props}/>
        : <TextRender {...props}/>
}

const TextRender = props => {
    const {
        input,
    } = props
    
    const {
        onBlur: onBlurProp,
        onChange: onChangeProp,
        value: valueProp,
    } = input

    const onBlur = useCallback(event => {
        let v = event.target.value !== '' ? event.target.value : undefined
        const oldVal = valueProp !== '' ? valueProp : undefined
        if (v !== oldVal) {
            onChangeProp(v)
        }
        onBlurProp(event)
    }, [valueProp, onChangeProp, onBlurProp])

    return (
        <BaseRender
            rowsMax={10}

            {...props}

            input={{
                ...input,
                onBlur,
            }}
        />
    )
}