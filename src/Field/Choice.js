import React from 'react'
import { CheckboxGroup } from './CheckboxGroup'
import { RadioGroup } from './RadioGroup'
import { Select } from './Select'
import { FieldRenderProps } from 'liform-react-final/dist/field'

export const Choice = props => {
    const {
        schema = true,
    } = props

    if (!schema.choiceExpanded) {
        return <Select {...props}/>
    }

    return schema.type === 'array' ? <CheckboxGroup {...props}/> : <RadioGroup {...props}/>
}

Choice.propTypes = FieldRenderProps
