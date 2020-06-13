import React, { useMemo } from 'react'
import { TextField, MenuItem, Chip, InputAdornment } from '@material-ui/core'

import { getFieldError } from './error'

export const renderInput = ({liform, name, schema, meta, input, ...props}) => {
    const error = getFieldError(liform, name, meta)

    const choice = useMemo(() => {
        const mapOptions = (values, labels) => {
            const o = {}
            for (var i in values) {
                o[values[i]] = labels && labels[i] || values[i]
            }
            return o
        }
        const options = schema.enum && mapOptions(schema.enum, schema.enumTitles)
            || schema.items && schema.items.enum && mapOptions(schema.items.enum, schema.items.enumTitles)

        if (!options) {
            return {}
        }

        const selectNative = (props.SelectProps && props.SelectProps.native !== undefined) ?
            props.SelectProps.native :
            Object.keys(options).length > 10

        return {
            props: {
                multiple: schema.type === 'array',
                native: selectNative,
                renderValue: (schema.type === 'array' || undefined) && !selectNative && (selected => {
                    if (selected.length === 0) {
                        return <em>{props.placeholder}</em>
                    }
                    return selected.map((v,i) => 
                        <Chip key={v} label={options[v]}/>
                    )
                }),
                ...props.SelectProps,
            },
            children: Object.keys(options).map(v =>
                selectNative ?
                    <option key={v} value={v}>{options[v]}</option> :
                    <MenuItem key={v} value={v}>{options[v]}</MenuItem>
            ),
        }
    }, [schema, props.SelectProps])

    const type = schema.type === 'number' || schema.type === 'integer' ? 'number' : undefined
    const step = schema.step || (schema.type === 'integer' ? 1 : 0.1)

    return (
        <TextField
            {...input}
            label={schema.title}
            helperText={error || schema.description}
            variant={'filled'}
            rowsMax={10}
            error={!!error}
            select={!!choice.children}
            step={step}
            type={type}
            {...props}
            InputProps={{
                endAdornment: schema.symbol && <InputAdornment position='end'>{schema.symbol}</InputAdornment>,
                ...props.InputProps,
            }}
            SelectProps={choice.props}
        >
            { choice.children }
        </TextField>
    )
}

export default renderInput
