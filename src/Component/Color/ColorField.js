import React from 'react'
import { Picker } from '../Picker/Picker'
import { ChromePicker } from 'react-color'
import { ColorInput } from './ColorInput'
import { InputAdornment, Typography } from '@material-ui/core'
import { PaletteOutlined } from '@material-ui/icons'

export const ColorField = React.forwardRef(function ColorField(props, ref) {
    const {
        PickerComponent = ChromePicker,
        PickerProps,

        InputProps,

        value,
        onChange,

        ...others
    } = props

    const onPickerChange = (colorObj) => {
        onChange(colorObj.hex)
    }

    return (
        <Picker
            ref={ref}

            PickerComponent={PickerComponent}
            PickerProps={{
                color: value,
                onChange: null,
                onChangeComplete: onPickerChange,
                disableAlpha: true,
                ...PickerProps,
            }}

            InputProps={{
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><PaletteOutlined/></Typography></InputAdornment>,
                ...InputProps
            }}

            value={value}
            onChange={onChange}

            inputComponent={ColorInput}

            {...others}
        />
    )
})
