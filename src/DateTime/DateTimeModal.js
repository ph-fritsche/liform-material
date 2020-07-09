import React, { useCallback, useEffect, useRef } from 'react'
import { useMediaQuery, Popover, Modal, TextField, Dialog } from "@material-ui/core"
import Field from '../Field/Field'
import DateTimeInput from './DateTimeInput'
import { useForkedRef } from '../util/ref'
import { StaticDateTimePicker, StaticTimePicker, StaticDatePicker } from '@material-ui/pickers'

const guessPickerComponent = (views) => {
    const hasDate = views.indexOf('year') >= 0 || views.indexOf('month') >= 0 || views.indexOf('date') >= 0
    const hasTime = views.indexOf('hours') >= 0 || views.indexOf('minutes') >= 0 || views.indexOf('seconds') >= 0
    return hasDate && hasTime ? StaticDateTimePicker : hasTime ? StaticTimePicker : StaticDatePicker
}

export const DateTimeModal = (props) => {
    const {
        dateUtil,
        value,
        onChange,

        mediaQueryDesktop = '@media (pointer: fine)',

        ModalProps,
        anchorEl,
        onClose = () => {},
        open = false,

        PickerComponent = guessPickerComponent(value.views),
        PickerProps,
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

            inputComponent={DateTimeInput}
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
                views={value.views}

                {...PickerProps}

                value={value.parsed}
                onDateChange={onDateChange}
            />
        </ModalComponent>
    )
}
