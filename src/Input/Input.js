import React, { useCallback, useMemo } from 'react'
import { TextField, MenuItem, Chip, InputAdornment } from '@material-ui/core'
import { useId } from '../util/ref'

export const Input = props => {
    const {
        name,
        schema = true,
        meta,
        input: {
            onChange: onChangeProp,
            ...input
        },
        placeholder,

        SelectProps,
        InputProps,

        ...others
    } = props

    const id = useId()

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

        const selectNative = (SelectProps && SelectProps.native !== undefined)
            ? SelectProps.native
            : Object.keys(options).length > 10

        return {
            props: {
                multiple: schema.type === 'array',
                native: selectNative,
                renderValue: (schema.type === 'array' || undefined) && !selectNative && (selected => {
                    if (selected.length === 0) {
                        return <em>{placeholder}</em>
                    }
                    return selected.map((v,i) => 
                        <Chip key={v} label={options[v]}/>
                    )
                }),
                ...SelectProps,
            },
            children: Object.keys(options).map(v =>
                selectNative ?
                    <option key={v} value={v}>{options[v]}</option> :
                    <MenuItem key={v} value={v}>{options[v]}</MenuItem>
            ),
        }
    }, [schema, SelectProps])

    const type = input.type || (schema.type === 'number' || schema.type === 'integer' ? 'number' : undefined)
    const step = schema.step || (schema.type === 'integer' ? 1 : 0.1)

    const onChange = useMemo(() => {
        if (schema.type === 'number' || schema.type === 'integer') {
            return event => {
                const v = event.target.value !== '' ? Number(event.target.value) : undefined
                // accept empty values if the change was triggered by deleting the only char
                if (v === undefined && event.nativeEvent.inputType === 'deleteContentBackward'
                // accept everything else if it is a valid number
                    || v == event.target.value && (schema.type !== 'integer' || Number.isInteger(v))
                ) {
                    onChangeProp(v)
                }
            }
        }

        return onChangeProp
    }, [schema, onChangeProp])

    const onBlur = useCallback(event => {
        let v = event.target.value !== '' ? event.target.value : undefined

        if (event.target.value !== '' && (schema.type === 'number' || schema.type === 'integer')) {
            v = Number(event.target.value)
            const step = schema.step || schema.type === 'integer' && 1 || undefined
            if (step) {
                v = Math.round(v / step) * step
                const dotPos = String(step).indexOf('.')
                if (dotPos >= 0) {
                    v = Number(v.toFixed(String(step).length - dotPos - 1))
                }
            }
        }

        const oldVal = input.value !== '' ? input.value : undefined
        if (v !== oldVal) {
            onChangeProp(v)
        }
    }, [schema, input.value, onChangeProp])

    return (
        <TextField
            {...input}
            id={id}
            label={schema.title}
            helperText={meta.error || schema.description}
            variant={'filled'}
            rowsMax={10}
            error={!!meta.error}
            select={!!choice.children}
            step={step}
            type={type}

            onBlur={onBlur}
            onChange={onChange}
            value={input.value ?? ''}

            {...others}
            InputProps={{
                endAdornment: schema.symbol && <InputAdornment position='end'>{schema.symbol}</InputAdornment>,
                ...InputProps,
            }}
            SelectProps={choice.props}
        >
            { choice.children }
        </TextField>
    )
}
