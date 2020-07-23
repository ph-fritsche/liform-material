import React from 'react'
import { InputAdornment, Typography } from '@material-ui/core'
import { VpnKeyOutlined, AlternateEmailOutlined, SearchOutlined, PhoneOutlined, EditOutlined, TextFieldsOutlined, SpeedOutlined } from '@material-ui/icons'

import { Container } from './render'
import { Form, FormErrors, Action } from './sections'

import { ArrayWidget } from './Field/ArrayWidget'
import { ButtonWidget } from './Field/ButtonWidget'
import { Choice } from './Field/Choice'
import { BaseRender } from './Field/BaseRender'
import { Hidden } from './Field/Hidden'
import { StringRender } from './Field/StringRender'
import { NumberRender } from './Field/NumberRender'
import { ObjectWidget } from './Field/ObjectWidget'
import { Switch } from './Field/Switch'
import { DateTime } from './Field/DateTime'

import { ColorField } from './Component/Color/ColorField'
import { DateIntervalField } from './Component/DateInterval/DateIntervalField'
import { FileDropField } from './Component/FileDrop/FileDropField'

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
            render: NumberRender,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        number: {
            render: NumberRender,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SpeedOutlined/></Typography></InputAdornment>,
            },
        },
        object: ObjectWidget,
        string: {
            render: StringRender,
        },

        button: ButtonWidget,
        choice: {
            render: Choice,
        },
        color: {
            render: BaseRender,
            Component: ColorField,
        },
        date: {
            render: DateTime,
        },
        dateinterval: {
            render: BaseRender,
            Component: DateIntervalField,
        },
        datetime: {
            render: DateTime,
        },
        email: {
            render: StringRender,
            type: 'email',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><AlternateEmailOutlined/></Typography></InputAdornment>,
            },
        },
        file: {
            render: BaseRender,
            Component: FileDropField,
        },
        hidden: {
            render: Hidden,
        },
        password: {
            render: StringRender,
            type: 'password',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><VpnKeyOutlined/></Typography></InputAdornment>,
            },
        },
        search: {
            render: StringRender,
            type: 'search',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><SearchOutlined/></Typography></InputAdornment>,
            },
        },
        tel: {
            render: StringRender,
            type: 'tel',
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><PhoneOutlined/></Typography></InputAdornment>,
            },
        },
        text: {
            render: StringRender,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><EditOutlined/></Typography></InputAdornment>,
            },
        },
        textarea: {
            render: StringRender,
            multiline: true,
            InputProps: {
                endAdornment: <InputAdornment position="end"><Typography color="textSecondary"><TextFieldsOutlined/></Typography></InputAdornment>,
            },
        },
        time: {
            render: DateTime,
        },
        url: {
            render: StringRender,
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
