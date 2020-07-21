import React from 'react'
import { Input } from '../Input/Input'
import { CheckboxGroup } from './CheckboxGroup'
import { RadioGroup } from './RadioGroup'

export const Choice = props => {
    const {
        schema = true,
    } = props

    if (!schema.choiceExpanded) {
        return Input(props)
    }

    return schema.type === 'array' ? <CheckboxGroup {...props}/> : <RadioGroup {...props}/>
}
