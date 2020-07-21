import React, { useCallback, useRef } from 'react'

import Drop from './Drop/Drop';

export const renderFile = ({name, schema, meta, input, ...props}) => {
    return (
        <Drop
            {...input}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            error={!!meta.error}
            {...props}
        />
    )
}
