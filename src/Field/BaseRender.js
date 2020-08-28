import React from 'react'
import { Field } from '../Component/Field/Field'
import { FieldRenderProps } from 'liform-react-final'

export const BaseRender = props => {
    const {
        schema = true,
        meta,
        input,

        Component = Field,

        ...others
    } = props

    return (
        <Component
            label={schema.title}
            helperText={meta.error || schema.description}
            error={!!meta.error}
            {...others}
            {...input}
        />
    )
}

BaseRender.propTypes = FieldRenderProps
