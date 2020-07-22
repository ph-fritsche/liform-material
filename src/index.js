import React from 'react'
import { InputAdornment, Typography } from '@material-ui/core'
import { VpnKeyOutlined, AlternateEmailOutlined, SearchOutlined, PhoneOutlined, EditOutlined, TextFieldsOutlined, SpeedOutlined } from '@material-ui/icons'
import { Container } from './render'
import { Form, FormErrors, Action } from './sections'
import { ArrayWidget } from './Array/ArrayWidget'
import { ButtonWidget } from './Button/ButtonWidget'
import { Choice } from './Choice/Choice'
import { Color } from './Color/Color'
import { DateInterval } from './DateInterval/DateInterval'
import { DateTime } from './DateTime/DateTime'
import { FileDrop } from './FileDrop/FileDrop'
import { Hidden } from './Hidden/Hidden'
import { Input } from './Input/Input'
import { ObjectWidget } from './Object/ObjectWidget'
import { Switch } from './Choice/Switch'

export default {
    render: {
        container: Container,
    },
    sections: {
        header: null,
        form: Form,
        footer: null,
        errors: FormErrors,
        action: Action,
    },
    field: {
        array: ArrayWidget,
        boolean: {
            render: Switch,
        },
        integer: {
            render: Input,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        number: {
            render: Input,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        object: ObjectWidget,
        string: {
            render: Input,
        },

        button: ButtonWidget,
        choice: {
            render: Choice,
        },
        color: {
            render: Color,
        },
        date: {
            render: DateTime,
        },
        dateinterval: {
            render: DateInterval,
        },
        datetime: {
            render: DateTime,
        },
        email: {
            render: Input,
            type: 'email',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><AlternateEmailOutlined/></Typography></InputAdornment>,
            },
        },
        file: {
            render: FileDrop,
        },
        hidden: {
            render: Hidden,
        },
        password: {
            render: Input,
            type: 'password',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><VpnKeyOutlined/></Typography></InputAdornment>,
            },
        },
        search: {
            render: Input,
            type: 'search',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SearchOutlined/></Typography></InputAdornment>,
            },
        },
        tel: {
            render: Input,
            type: 'tel',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><PhoneOutlined/></Typography></InputAdornment>,
            },
        },
        text: {
            render: Input,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><EditOutlined/></Typography></InputAdornment>,
            },
        },
        textarea: {
            render: Input,
            multiline: true,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><TextFieldsOutlined/></Typography></InputAdornment>,
            },
        },
        time: {
            render: DateTime,
        },
        url: {
            render: Input,
            type: 'url',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary">://</Typography></InputAdornment>,
            },
        },
        week: {
            render: DateTime,
        },
    },
}
