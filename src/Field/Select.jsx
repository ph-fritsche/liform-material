import React, { useMemo, useCallback } from 'react'
import clsx from 'clsx'
import { MenuItem, Chip, alpha } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { BaseRender } from './BaseRender'
import { FieldRenderProps } from 'liform-react-final'

function mapOptionsLabels (values, labels) {
    const o = {}
    for (var i in values) {
        o[values[i]] = labels && labels[i] || values[i]
    }
    return o
}

const useStyle = makeStyles(theme => ({
    'placeholderContainer': {
        '& $placeholderText': {
            opacity: 0,
        },
        '&:focus $placeholderText': {
            opacity: theme.palette.type === 'light' ? 0.42 : 0.5,
        },
    },
    'placeholderText': {},
    'placeholderSelect': {
        opacity: 0,
        '&:focus': {
            opacity: theme.palette.type === 'light' ? 0.42 : 0.5,
        },
    },
    'placeholderOption': {
        color: alpha(theme.palette.text.primary, theme.palette.type === 'light' ? 0.42 : 0.5),
    },
}))

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

    const style = useStyle()

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
                return <em className={style.placeholderText}>{placeholder}</em>
            }
            return selected.map(v =>
                <Chip key={v} label={options[v]}/>,
            )
        }
    }, [schema, selectNative, style.placeholderText, placeholder, options])

    const children = useMemo(() => {
        const el = Object.keys(options).map(v =>
            selectNative
                ? <option key={v} value={v}>{options[v]}</option>
                : <MenuItem key={v} value={v}>{options[v]}</MenuItem>,
        )

        if (selectNative) {
            el.unshift(<option key="" value="" className={style.placeholderOption}>{placeholder}</option>)
        }

        return el
    }, [options, selectNative, style.placeholderOption, placeholder])

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
                displayEmpty: true,
                renderValue,
                ...SelectProps,
                className: clsx(
                    SelectProps.className,
                    !selectNative && input.value.length === 0 && style.placeholderContainer,
                ),
            }}

            inputProps={{
                className: clsx(
                    selectNative && input.value.length === 0 && style.placeholderSelect,
                    !selectNative && style.placeholderContainer,
                ),
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
