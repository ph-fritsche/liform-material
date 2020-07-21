import React, { useState } from 'react'
import { TextField, InputAdornment, Typography } from '@material-ui/core';
import { makeStyles, fade } from '@material-ui/core'
import clsx from 'clsx'
import { FileDropInput } from './FileDropInput'
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';

const useStyle = makeStyles(theme => ({
    'fitcontent': {
        height: 'fit-content',
    },
    'dropActive.standard': undefined,
    'dropActive.filled': {
        background: theme.palette.type === 'light' ? fade(theme.palette.secondary.light, 0.09) : fade(theme.palette.secondary.dark, 0.09),
    },
    'dropActive.outline': undefined,
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

export const FileDropField = React.forwardRef(function FileDropField(props, ref) {
    const {
        // Will get the ref to the InputBase element
        inputBaseRef,

        // Will get the ref to the nativ input
        inputRef,

        accept,
        multiple,
        placeholder,
        renderValue,
        value,
        variant = 'filled',
        ...others
    } = props
   
    const style = useStyle(props)

    const [dropActive, setDropActive] = useState(false)

    return (
        <TextField
            ref={ref}
            {...others}
            className={clsx(
                style.placeholderContainer,
            )}
            variant={variant}

            // These will be passed to the InputBase variant
            InputProps={{
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><PublishOutlinedIcon/></Typography></InputAdornment>,
                ...props.InputProps,
                className: clsx(
                    props.InputProps && props.InputProps.className,
                    dropActive && style['dropActive.' + variant],
                ),
                inputComponent: FileDropInput,
                ref: inputBaseRef,
                inputRef: inputRef,
            }}

            // These will be passed to InputProps.inputComponent
            inputProps={{
                ...props.inputProps,
                className: clsx(
                    props.inputProps && props.inputProps.className,
                    style.fitcontent,
                ),
                accept,
                multiple,
                placeholder,
                setDropActive,
                value,
            }}
        />
    )
})
