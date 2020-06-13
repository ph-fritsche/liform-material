import React from 'react'

import { ArrayWidget } from './array'
import { ButtonWidget } from './button'
import { renderChoice } from './choice'
import { renderDate } from './date'
import { renderFile } from './file'
import { renderHidden } from './hidden'
import { renderInput } from './input'
import { renderSwitch } from './switch'
import { ObjectWidget } from './object'

export default {
    errors: () => <div>[Errors]</div>,
    field: {
        array: ArrayWidget,
        boolean: {
            render: renderSwitch,
        },
        integer: {
            render: renderInput,
        },
        number: {
            render: renderInput,
        },
        object: ObjectWidget,
        string: {
            render: renderInput,
        },

        button: ButtonWidget,
        choice: {
            render: renderChoice,
        },
        date: {
            render: renderDate,
        },
        datetime: {
            render: renderDate,
        },
        file: {
            render: renderFile,
        },
        hidden: {
            render: renderHidden,
        },
        textarea: {
            render: renderInput,
            multiline: true,
        },
        time: {
            render: renderDate,
        },
    },
}
