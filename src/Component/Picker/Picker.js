import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Field } from '../Field/Field'
import { useForkedCallback } from '../../util/func'
import { useForkedRef, updateRef } from '../../util/ref'
import { PickerModal } from './PickerModal'

export const Picker = React.forwardRef(function Picker(props, ref) {
    const {
        open: openProp,
        toggle: toggleProp,

        onClick: onClickProp,
        onClose: onCloseProp,

        value,
        onChange,

        ModalProps = {},
        
        PickerComponent,
        PickerProps = {},

        ...others
    } = props

    const rootRef = useRef()
    const forkedRootRef = useForkedRef(ref, rootRef)

    const [openState, setOpenState] = useState(false)
    const togglePicker = useCallback(open => {
        if (typeof(openProp) === 'boolean' || open === openState) {
            return
        }
        setOpenState(open === undefined ? !openState : open)
    }, [openProp, openState, setOpenState])

    useEffect(() => {
        if (typeof(openProp) !== 'boolean') {
            updateRef(openProp, openState)
            updateRef(toggleProp, togglePicker)
        }
    }, [openProp, openState, toggleProp, togglePicker])

    const isOpen = typeof(openProp) === 'boolean' ? openProp : openState

    const onClick = useForkedCallback(onClickProp, () => togglePicker(true), [togglePicker])
    const onClose = useForkedCallback(onCloseProp, () => togglePicker(false), [togglePicker])

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

            anchorEl={rootRef.current}
            open={isOpen}
            onClose={onClose}
        />
    </>)
})

Picker.propTypes = {
    open: PropTypes.bool,
    toggle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    onClick: PropTypes.func,
    onClose: PropTypes.func,
    value: PropTypes.any,
    onChange: PropTypes.func,
    ModalProps: PropTypes.object,
    PickerComponent: PropTypes.elementType,
    PickerProps: PropTypes.object,
}
