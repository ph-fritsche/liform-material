import React from 'react'

import { ArrayWidget } from './array'
import { ButtonWidget } from './button'
import { renderChoice } from './choice'
import { renderColor } from './color'
import { renderDate, renderDateInterval } from './date'
import { renderFile } from './file'
import { renderHidden } from './hidden'
import { renderInput } from './input'
import { renderSwitch } from './switch'
import { ObjectWidget } from './object'

import { InputAdornment, Typography } from '@material-ui/core'
import { VpnKeyOutlined, AlternateEmailOutlined, SearchOutlined, PhoneOutlined, EditOutlined, TextFieldsOutlined, SpeedOutlined } from '@material-ui/icons'

export default {
    errors: () => <div>[Errors]</div>,
    field: {
        array: ArrayWidget,
        boolean: {
            render: renderSwitch,
        },
        integer: {
            render: renderInput,
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        number: {
            render: renderInput,
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        object: ObjectWidget,
        string: {
            render: renderInput,
        },

        button: ButtonWidget,
        choice: {
            render: renderChoice,
        },
        color: {
            render: renderColor,
        },
        date: {
            render: renderDate,
        },
        dateinterval: {
            render: renderDateInterval,
        },
        datetime: {
            render: renderDate,
        },
        email: {
            render: renderInput,
            type: 'email',
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><AlternateEmailOutlined/></Typography></InputAdornment>,
            },
        },
        file: {
            render: renderFile,
        },
        hidden: {
            render: renderHidden,
        },
        password: {
            render: renderInput,
            type: 'password',
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><VpnKeyOutlined/></Typography></InputAdornment>,
            },
        },
        search: {
            render: renderInput,
            type: 'search',
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><SearchOutlined/></Typography></InputAdornment>,
            },
        },
        tel: {
            render: renderInput,
            type: 'tel',
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><PhoneOutlined/></Typography></InputAdornment>,
            },
        },
        text: {
            render: renderInput,
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><EditOutlined/></Typography></InputAdornment>,
            },
        },
        textarea: {
            render: renderInput,
            multiline: true,
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'><TextFieldsOutlined/></Typography></InputAdornment>,
            },
        },
        time: {
            render: renderDate,
        },
        url: {
            render: renderInput,
            type: 'url',
            InputProps: {
                endAdornment: <InputAdornment position='end'><Typography color='textSecondary'>://</Typography></InputAdornment>,
            },
        }
    },
}
