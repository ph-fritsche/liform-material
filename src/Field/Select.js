import React, { useMemo } from 'react'
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

    return (
        <BaseRender
            {...props}

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
