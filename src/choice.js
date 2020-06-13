import { renderInput } from './input'
import { renderCheckboxGroup } from './checkbox'
import { renderRadioGroup } from './radio'

export const renderChoice = (props) => {
    if (!props.schema.choiceExpanded) {
        return renderInput(props)
    }

    return props.schema.type === 'array' ? renderCheckboxGroup(props) : renderRadioGroup(props)
}

export default renderChoice
