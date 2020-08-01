import React, { useMemo, useCallback } from 'react'
import { MenuItem, Chip } from '@material-ui/core'
import { BaseRender } from './BaseRender'
import { FieldRenderProps } from 'liform-react-final/dist/field'

function mapOptionsLabels (values, labels) {
    const o = {}
    for (var i in values) {
        o[values[i]] = labels && labels[i] || values[i]
    }
    return o
}

export const Select = props => {
    const {
        schema = true,
        placeholder,

        input: {
            onChange: onChangeProp,
            ...input
        },

        SelectProps = {},
    } = props

    const options = useMemo(() => (
        schema.enum && mapOptionsLabels(schema.enum, schema.enumTitles)
            || schema.items && schema.items.enum && mapOptionsLabels(schema.items.enum, schema.items.enumTitles)
            || {}
    ), [schema])

    const selectNative = SelectProps.native ?? Object.keys(options).length > 10

    const renderValue = useMemo(() => {
        if (schema.type !== 'array' || selectNative) {
            return undefined
        }
        return selected => {
            if (selected.length === 0) {
                return <em>{placeholder}</em>
            }
            return selected.map(v =>
                <Chip key={v} label={options[v]}/>
            )
        }
    }, [schema, selectNative, placeholder, options])

    const children = useMemo(() => (
        Object.keys(options).map(v =>
            selectNative ?
                <option key={v} value={v}>{options[v]}</option> :
                <MenuItem key={v} value={v}>{options[v]}</MenuItem>
        )
    ), [options, selectNative])

    const onChange = useCallback(event => onChangeProp(extractNativeSelectValue(event)), [onChangeProp])

    return (
        <BaseRender
            {...props}

            input={{
                ...input,
                onChange,
            }}

            select={true}
            SelectProps={{
                multiple: schema.type === 'array',
                native: selectNative,
                renderValue,
                ...SelectProps,
            }}
        >
            { children }
        </BaseRender>
    )
}

Select.propTypes = FieldRenderProps

function extractNativeSelectValue (event) {
    if (!event || !(event.target instanceof HTMLSelectElement)) {
        return event
    }

    if (event.target.hasAttribute('multiple')) {
        const v = []
        for (let i = 0; i < event.target.selectedOptions.length; i++) {
            v.push(event.target.selectedOptions.item(i).value)
        }
        return v
    }

    return event.target.value
}
