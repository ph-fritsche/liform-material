import React from 'react'
import PropTypes from 'prop-types'
import { TextField, TextareaAutosize, alpha } from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { FieldInput } from './FieldInput'
import { useId } from 'liform-util'
import NativeSelectInput from '@mui/material/NativeSelect/NativeSelectInput'
import SelectInput from '@mui/material/Select/SelectInput'

const useStyle = makeStyles(theme => ({
    'fitcontent': {
        height: 'fit-content',
    },
    'targetActive': {
        background: (theme.palette.type === 'light' ? alpha(theme.palette.secondary.light, 0.09) : alpha(theme.palette.secondary.dark, 0.09)) + ' !important',
    },
    'placeholderContainer': {
        '& .placeholder': {
            color: 'currentColor',
            opacity: 0,
            transition: theme.transitions.create('opacity', {
                duration: theme.transitions.duration.shorter,
            }),
            display: 'inline-block',
            'min-height': '1.1876em',
        },
        '& .Mui-focused .placeholder': {
            opacity: theme.palette.type === 'light' ? 0.42 : 0.5,
        },
    },
}))

/**
 * Shared wrapper for TextField-like inputs
 */
export const Field = React.forwardRef(function Field(props, ref) {
    const {
        name,

        // className for the TextField component
        className,

        // Will get the ref to the InputBase element
        inputBaseRef,

        // Will get the ref to the nativ input
        inputRef,

        // Do not pass blur/focus events to TextField
        isFocusLocked,

        // Highlight the field as target of an action
        isTarget,

        select = false,
        multiline = false,
        rows,

        // These will be passed to the InputBase variant
        InputProps: InputPropsProp = {},

        // These will be passed to Select component if select=true
        SelectProps: SelectPropsProp = {},

        // These will be passed to InputProps.inputComponent
        inputProps: inputPropsProp = {},

        // Custom component for rendering the input
        // Defaults to native input
        inputComponent = !select
            ? (multiline
                ? (rows ? 'textarea' : TextareaAutosize)
                : undefined
            )
            : SelectPropsProp.native ? NativeSelectInput : SelectInput,

        ...others
    } = props

    const id = useId()

    const style = useStyle(props)

    const InputProps = {
        ...InputPropsProp,
        className: clsx(
            InputPropsProp.className,
            isTarget && style.targetActive,
        ),
        inputComponent: FieldInput,
        ref: inputBaseRef,
        inputRef: inputRef,
    }

    const inputProps = {
        ...inputPropsProp,
        className: clsx(
            inputPropsProp.className,
            style.fitcontent,
        ),
        isFocusLocked,
        inputComponent,
    }

    return <TextField
        ref={ref}
        id={id}
        name={ select && SelectPropsProp.multiple ? name + '[]' : name }
        {...others}

        className={clsx(
            className,
            style.placeholderContainer,
        )}

        {...(select
            ? {
                select,
                SelectProps: {
                    ...InputProps,
                    inputProps,
                    ...SelectPropsProp,
                },
            }
            : {
                multiline,
                rows,
                InputProps,
                inputProps,
            }
        )}
    />
})

Field.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string,
    inputBaseRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    isFocusLocked: PropTypes.bool,
    isTarget: PropTypes.bool,
    variant: PropTypes.string,
    select: PropTypes.bool,
    multiline: PropTypes.bool,
    rows: PropTypes.number,
    InputProps: PropTypes.object,
    SelectProps: PropTypes.object,
    inputProps: PropTypes.object,
    inputComponent: PropTypes.elementType,
}
