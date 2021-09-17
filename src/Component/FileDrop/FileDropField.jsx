import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { InputAdornment, Typography } from '@mui/material';
import PublishOutlinedIcon from '@mui/icons-material/PublishOutlined';
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
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><PublishOutlinedIcon/></Typography></InputAdornment>,
                ...InputProps,
            }}

            isTarget={dropActive}

            inputComponent={FileDropInput}
            inputProps={{
                ...inputProps,

                accept,
                multiple,
                setDropActive,
            }}
        />
    )
})

FileDropField.propTypes = {
    InputProps: PropTypes.object,
    inputProps: PropTypes.object,
    accept: PropTypes.string,
    multiple: PropTypes.bool,
}
