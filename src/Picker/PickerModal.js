import React, { useCallback, useEffect, useRef } from 'react'
import { useMediaQuery, Popover, Modal, TextField, Dialog } from "@material-ui/core"
import Field from '../Field/Field'
import PickerInput from './PickerInput'
import { useForkedRef } from '../util/ref'

export const PickerModal = (props) => {
    const {
        mediaQueryDesktop = '@media (pointer: fine)',

        ModalProps,
        anchorEl,
        onClose = () => {},
        open = false,

        PickerComponent,
        PickerProps,

        dateUtil,
        value,
        onChange,
    } = props

    const isDesktop = useMediaQuery(mediaQueryDesktop)
    const isLandscape = useMediaQuery('@media (orientation: portrait)')

    const onDateChange = (value, variant, isFinished) => {
        onChange(value)
        isFinished && onClose()
    }

    const ModalComponent = isDesktop ? Popover : Dialog

    const sharedProps = {
        open,
        onClose,
    }

    const popoverProps = {
        anchorEl,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
    }

    const modalProps = {
    }

    const renderMobileKeyboardInput = useCallback(props => {
        const mobileKeyboardInputRef = useRef()
        const inputRef = useForkedRef(props.inputRef, mobileKeyboardInputRef)
    
        useEffect(() => 
            mobileKeyboardInputRef.current.focus()
        , [])
    
        return <Field
            variant='standard'
            fullWidth={true}
            onFocus={event => event.target !== mobileKeyboardInputRef.current && mobileKeyboardInputRef.current.focus() }

            helperText={value.input.map(p => p.placeholder).join('')}

            inputComponent={PickerInput}
            inputRef={inputRef}
            inputProps={{
                dateUtil,
                value,
                onChange,
            }}
        />
    }, [dateUtil, value, onChange])

    return (
        <ModalComponent
            {...ModalProps}
            {...sharedProps}
            {...(ModalComponent === Popover && popoverProps)}
            {...(ModalComponent === Modal && modalProps)}
        >
            <PickerComponent
                displayStaticWrapperAs={ isDesktop ? 'desktop' : 'mobile' }
                disableMaskedInput={true}
                dateAdapter={dateUtil}
                renderInput={renderMobileKeyboardInput}

                {...PickerProps}

                value={value.parsed}
                onDateChange={onDateChange}
            />
        </ModalComponent>
    )
}
