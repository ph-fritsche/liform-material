import React from 'react'
import { TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core'
import clsx from 'clsx'
import { FieldInput } from './FieldInput'
import { useId } from '../../util/ref';
import NativeSelectInput from '@material-ui/core/NativeSelect/NativeSelectInput';
import SelectInput from '@material-ui/core/Select/SelectInput';

const useStyle = makeStyles(theme => ({
    'fitcontent': {
        height: 'fit-content',
    },
    'targetActive.standard': undefined,
    'targetActive.filled': {
        background: (theme.palette.type === 'light' ? fade(theme.palette.secondary.light, 0.09) : fade(theme.palette.secondary.dark, 0.09)) + ' !important',
    },
    'targetActive.outline': undefined,
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
    }
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

        // Default to filled variant
        variant = 'filled',

        select = false,

        // These will be passed to the InputBase variant
        InputProps: InputPropsProp = {},

        // These will be passed to Select component if select=true
        SelectProps: SelectPropsProp = {},

        // These will be passed to InputProps.inputComponent
        inputProps: inputPropsProp = {},

        // Custom component for rendering the input
        // Defaults to native input
        inputComponent = !select ? undefined : SelectPropsProp.native ? NativeSelectInput : SelectInput,

        ...others
    } = props
   
    const id = useId()
    
    const style = useStyle(props)

    const InputProps = {
        ...InputPropsProp,
        className: clsx(
            InputPropsProp.className,
            isTarget && style['targetActive.' + variant],
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
        variant={variant}

        {...(select
            ? {
                select,
                SelectProps: {
                    ...InputProps,
                    inputProps,
                    ...SelectPropsProp
                },
            }
            : {
                InputProps,
                inputProps,
            }
        )}
    />
})
