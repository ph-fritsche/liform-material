import React from 'react'
import PropTypes from 'prop-types'
import { useMediaQuery, Popover, Modal, Dialog } from '@material-ui/core'

export const PickerModal = (props) => {
    const {
        mediaQueryDesktop = '@media (pointer: fine)',

        anchorEl,
        onClose = () => {},
        open = false,

        PickerComponent,
        PickerProps = {},

        ...others
    } = props

    const isDesktop = useMediaQuery(mediaQueryDesktop)

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

    return (
        <ModalComponent
            {...sharedProps}
            {...(ModalComponent === Popover && popoverProps)}
            {...(ModalComponent === Modal && modalProps)}
            {...others}
        >
            <PickerComponent onClose={onClose} {...PickerProps}/>
        </ModalComponent>
    )
}

PickerModal.propTypes = {
    mediaQueryDesktop: PropTypes.string,
    anchorEl: PropTypes.instanceOf(HTMLElement),
    onClose: PropTypes.func,
    open: PropTypes.bool,
    PickerComponent: PropTypes.elementType.isRequired,
    PickerProps: PropTypes.object,
}
