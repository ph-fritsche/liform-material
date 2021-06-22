import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { IconButton, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useForkedCallback } from '../../util/func'
import { useForkedRef } from '../../util/ref'
import { BackspaceOutlined } from '@material-ui/icons'

const useStyle = makeStyles({
    color: {
        height: '1.4375em',
        minWidth: '10em',
        width: '100%',
        overflow: 'hidden',
    },
    noColor: {
        backgroundImage: '\
            linear-gradient(to right, hsla(0, 0%, 80%, 0.75) 50%, hsla(0, 0%, 80%, 0.75) 50%),\
            linear-gradient(to right, black 50%, white 50%),\
            linear-gradient(to bottom, black 50%, white 50%);',
        backgroundBlendMode: 'normal, difference, normal',
        backgroundSize: '1.1876em 1.1876em',
        opacity: .5,
    },
    hidden: {
        width: 0,
        height: 0,
        margin: 0,
        padding: 0,
        border: 0,
        opacity: 0,
        '&:focus': {
            outline: 0,
        },
    },
    container: {
        overflow: 'hidden',
    },
    deleteButton: {
        boxSizing: 'border-box',
        height: '100%',
        float: 'right',
    },
    deleteIcon: {
        fontSize: '1em',
    },
})

export const ColorInput = React.forwardRef(function ColorInput(props, ref) {
    const {
        id,

        name,
        value,

        onChange: onChangeProp = () => { },
        onBlur: onBlurProp = () => { },
        onFocus: onFocusProp = () => { },

        ...others
    } = props

    const style = useStyle(props)
    const theme = useTheme()

    const inputRef = useRef()
    const forkedRef = useForkedRef(ref, inputRef)

    const deleteButtonRef = useRef()
    const onChange = value => {
        // synchronize the ref element so that material-ui can determine if the input isFilled
        inputRef.current.value = value

        if (deleteButtonRef.current) {
            const svg = deleteButtonRef.current.querySelector('svg')
            svg.style.color = theme.palette.getContrastText(value || '#000000')
        }

        onChangeProp(value)
    }

    const [isFocused, setFocused] = useState()
    const [isPickerOpen, setPickerOpen] = useState()

    const onFocus = useForkedCallback(onFocusProp, () => setFocused(true))

    const onBlur = event => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setPickerOpen(false)
            setFocused(false)
        }
        onBlurProp(event)
    }

    const onClick = () => {
        const colorInput = document.getElementById(id)
        colorInput.focus()

        // if the picker was open this event should have closed it
        // otherwise trigger the default click event
        isPickerOpen ? setPickerOpen(false) : colorInput.click()
    }

    const onKeyDown = e => {
        if (e.key === 'Delete') {
            onChange('')
            e.preventDefault()
            e.stopPropagation()
        }
    }

    return (
        <div
            tabIndex="-1"
            role="button"

            {...others}

            onBlur={onBlur}
            onFocus={onFocus}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            <div
                className={clsx(
                    style.color,
                    !value && isFocused && style.noColor,
                )}
                style={{backgroundColor: value }}
            >
                <IconButton
                    ref={deleteButtonRef}
                    tabIndex="-1"
                    aria-label="Remove color value"
                    onMouseDown={e => {
                        // for unknown reason onChange('') does change the value
                        // but it does not unshrink the label
                        // the same logic on keydown event above works
                        onChange('')

                        e.preventDefault()
                        e.stopPropagation()

                        document.getElementById(id).focus()
                    }}
                    size="small"
                    className={clsx(
                        style.deleteButton,
                        !value && style.hidden,
                    )}
                >
                    <BackspaceOutlined
                        className={style.deleteIcon}
                        style={{ color: theme.palette.getContrastText(value || '#000000') }}
                    />
                </IconButton>
            </div>
            <input
                id={id}
                aria-labelledby={id + '-label'}
                type="color"
                value={value || '#000000'}
                onClick={() => setPickerOpen(true)}
                onChange={e => onChange(e.target.value)}
                className={style.hidden}
            />
            <input
                ref={forkedRef}
                type="hidden"
                name={name}
                value={value || ''}
            />
        </div >
    )
})

ColorInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    value: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
}
