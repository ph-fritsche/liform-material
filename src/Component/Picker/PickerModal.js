import React from 'react'
import PropTypes from 'prop-types'
import { useMediaQuery, Popover, Dialog } from '@material-ui/core'

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

    // Popover requires anchorEl
    const ModalComponent = (isDesktop && anchorEl) ? Popover : Dialog

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

    const dialogProps = {
    }

    return (
        <ModalComponent
            {...sharedProps}
            {...(ModalComponent === Popover && popoverProps)}
            {...(ModalComponent === Dialog && dialogProps)}
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
