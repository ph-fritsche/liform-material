import React, { useState } from 'react'
import { InputAdornment, Typography } from '@material-ui/core';
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import { Field } from '../Field/Field';
import { FileDropInput } from './FileDropInput'

export const FileDropField = React.forwardRef(function FileDropField(props, ref) {
    const {
        InputProps = {},
        inputProps = {},

        accept,
        multiple,

        ...others
    } = props
   
    const [dropActive, setDropActive] = useState(false)

    return (
        <Field
            ref={ref}
            {...others}

            // These will be passed to the InputBase variant
            InputProps={{
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><PublishOutlinedIcon/></Typography></InputAdornment>,
                ...props.InputProps,
            }}

            isTarget={dropActive}

            inputComponent={FileDropInput}
            inputProps={{
                ...props.inputProps,

                accept,
                multiple,
                setDropActive,
            }}
        />
    )
})
