import React, { useState } from 'react'
import { TextField } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core'
import clsx from 'clsx'
import { FieldInput } from './FieldInput'

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

        // These will be passed to the InputBase variant
        InputProps,

        // Custom component for rendering the input
        // Defaults to native input
        inputComponent,

        // These will be passed to InputProps.inputComponent
        inputProps,

        // Default to filled variant
        variant = 'filled',

        ...others
    } = props
   
    const style = useStyle(props)

    return <TextField
        ref={ref}
        {...others}

        className={clsx(
            className,
            style.placeholderContainer,
        )}
        variant={variant}

        InputProps={{
            ...InputProps,
            className: clsx(
                InputProps && InputProps.className,
                isTarget && style['targetActive.' + variant],
            ),
            inputComponent: FieldInput,
            ref: inputBaseRef,
            inputRef: inputRef,
        }}

        inputProps={{
            ...inputProps,
            className: clsx(
                inputProps && inputProps.className,
                style.fitcontent,
            ),
            isFocusLocked,
            inputComponent,
        }}
    />
})

export default Field
