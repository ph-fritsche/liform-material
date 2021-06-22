import React from 'react'
import PropTypes from 'prop-types'
import { ColorInput } from './ColorInput'
import { InputAdornment, Typography } from '@material-ui/core'
import { PaletteOutlined } from '@material-ui/icons'
import { Field } from '../Field/Field'

export const ColorField = React.forwardRef(function ColorField(props, ref) {
    const {
        InputProps,

        ...others
    } = props

    return (
        <Field
            ref={ref}

            InputProps={{
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><PaletteOutlined/></Typography></InputAdornment>,
                ...InputProps,
            }}

            inputComponent={ColorInput}

            {...others}
        />
    )
})

ColorField.propTypes = {
    InputProps: PropTypes.object,
    value: PropTypes.string,
    onChange: PropTypes.func,
}
