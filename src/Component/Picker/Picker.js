import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from '../Field/Field'
import { useForkedCallback } from '../../util/func'
import { useForkedRef } from '../../util/ref'
import { PickerModal } from './PickerModal'

export const Picker = React.forwardRef(function Picker(props, ref) {
    const {
        initialOpen = false,
        onToggle,

        onClick: onClickProp,

        value,
        onChange,

        ModalProps = {},
        
        PickerComponent,
        PickerProps = {},

        ...others
    } = props

    // Using state as ref allows to pass a ref before it is set and render the component with initialOpen=true Popover
    const [rootRef, setRootRef] = useState()
    const forkedRootRef = useForkedRef(ref, setRootRef)

    const [isOpen, setOpen] = useState(initialOpen)
    const togglePicker = useCallback(open => {
        const newState = open === undefined ? !isOpen : Boolean(open)
        if (open !== isOpen) {
            setOpen(newState)
            onToggle && onToggle(newState)
        }
    }, [isOpen, setOpen, onToggle])

    const onClick = useForkedCallback(onClickProp, () => togglePicker(true), [togglePicker])

    return (<>
        <Field
            ref={forkedRootRef}
            {...others}

            value={value}
            onChange={onChange}

            onClick={onClick}

            isFocusLocked={isOpen}
        />

        <PickerModal
            {...ModalProps}

            PickerComponent={PickerComponent}
            PickerProps={{
                value,
                onChange,
                ...PickerProps
            }}

            anchorEl={rootRef}
            open={isOpen}
            onClose={() => togglePicker(false)}
        />
    </>)
})

Picker.propTypes = {
    initialOpen: PropTypes.bool,
    onToggle: PropTypes.func,
    onClick: PropTypes.func,
    value: PropTypes.any,
    onChange: PropTypes.func,
    ModalProps: PropTypes.object,
    PickerComponent: PropTypes.elementType.isRequired,
    PickerProps: PropTypes.object,
}
