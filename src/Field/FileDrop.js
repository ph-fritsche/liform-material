import React from 'react'

import { FileDropField } from '../Component/FileDrop/FileDropField';
import { FieldRenderProps } from 'liform-react-final/dist/field';

export const FileDrop = props => {
    const {
        schema,
        meta,
        input,
        ...others
    } = props

    return (
        <FileDropField
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            error={!!meta.error}
            {...others}
        />
    )
}

FileDrop.propTypes = FieldRenderProps
