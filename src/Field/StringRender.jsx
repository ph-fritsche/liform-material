import React from 'react'
import { Choice } from './Choice'
import { BaseRender } from './BaseRender'
import { FieldRenderProps } from 'liform-react-final'

export const StringRender = props => {
    const {
        schema = true,
    } = props

    return (schema.enum || schema.items)
        ? <Choice {...props}/>
        : <BaseRender maxRows={10} {...props}/>
}

StringRender.propTypes = FieldRenderProps
