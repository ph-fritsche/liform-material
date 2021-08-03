import React, { useCallback, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Chip, Avatar } from '@material-ui/core'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { useDropzone } from 'react-dropzone'
import { getIndicesOfDescendant, useForkedRef } from 'liform-util'

const fileNameInfo = (filename) => {
    const basename = filename.replace(/.*[\\/]/, '')
    const lastDot = basename.lastIndexOf('.')

    return lastDot > 0 ? {name: basename.slice(0, lastDot), extension: basename.slice(lastDot)} : {name: basename, extension: ''}
}

const fileAvatar = (file) => {
    if (file.type.startsWith('image/')) {
        return <Avatar src={file.url || URL.createObjectURL(file)}/>
    } else {
        return <InsertDriveFileOutlinedIcon />
    }
}

const FileChip = ({file, avatar, ...others}) => {
    const fileName = fileNameInfo(file.name)
    return (
        <Chip
            avatar={(typeof(avatar) === 'function') && avatar(file) || fileAvatar(file)}
            label={
                <span title={file.name + '\n' + file.size + 'B'}>
                    <span style={{
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        maxInlineSize: '10em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}>
                        {fileName.name}
                    </span>
                    <span>
                        {fileName.extension}
                    </span>
                </span>
            }
            {...others}
        />
    )
}

FileChip.propTypes = {
    file: PropTypes.instanceOf(File),
    avatar: PropTypes.func,
}

const renderValue = ({ baseElementRef, avatar, onBlur, onChange, valueFocus, setValueFocus }, value) => {
    const valueArray = (Array.isArray(value) ? value : [value])

    const handleDelete = (file) => {
        const newValue = Array.isArray(value)
            ? valueArray.filter(f => f !== file)
            : null
        const deletedIndex = valueArray.indexOf(file)

        // trigger MUI's blur and refocus
        // otherwise activeElement will be set to body - rendering MUI's focus out of sync
        onBlur()
        const chips = baseElementRef.current.querySelectorAll('[role=button]')
        const newActive = deletedIndex < (chips.length-1)
            ? chips[deletedIndex+1]
            : chips.length > 1
                ? chips[deletedIndex-1]
                : baseElementRef.current
        newActive.focus()

        onChange(newValue)
    }

    return valueArray.map((file) => {
        file.url = file.url || URL.createObjectURL(file)

        return (
            <span
                key={file.url}
                role="gridcell"
            >
                <FileChip
                    file={file}
                    avatar={avatar}
                    aria-label={file.name}
                    tabIndex={valueFocus === file ? 0 : -1}
                    onDelete={handleDelete.bind(null, file)}
                    onClick={event => event.stopPropagation()}
                    onFocus={() => setValueFocus(file)}
                />
            </span>
        )
    })
}

function getChips (baseElementRef) {
    return baseElementRef.current.querySelectorAll('[role=button]')
}

const focusValueChild = (baseElementRef, value, valueFocus) => {
    const chips = getChips(baseElementRef)
    const i = (Array.isArray(value) ? value : [value]).indexOf(valueFocus)
    if (i >= 0 && i < chips.length) {
        chips[i].focus()
    } else if (chips.length) {
        chips[0].focus()
    }
}

const noop = () => { }

export const FileDropInput = React.forwardRef(function FileDropInput(props, ref) {
    const {
        id,
        accept,
        avatar,
        className,
        inputRef,
        name,
        multiple = true,
        onBlur: onBlurProp = noop,
        onChange = noop,
        onFocus: onFocusProp = noop,
        placeholder,
        setDropActive = noop,
        value,
    } = props

    const baseElementRef = useRef()
    const [valueFocus, setValueFocus] = useState()
    const [isFocusLocked, lockFocus] = useState(false)

    const onDragEnter = useCallback(() => console.log('DRAGENTER') || setDropActive(true), [setDropActive])
    const onDragLeave = useCallback(() => setDropActive(false), [setDropActive])
    const onDialogClose = useCallback(() => {
        lockFocus(false)
        focusValueChild(baseElementRef, value, valueFocus)
    }, [baseElementRef, value, valueFocus])
    const onDrop = useCallback(files => {
        lockFocus(false)
        setDropActive(false)
        onChange(multiple ? (value || []).concat(files) : files[0])
        focusValueChild(baseElementRef, value, files[0])
    }, [setDropActive, onChange, multiple, baseElementRef, value])
    const {
        getRootProps,
        getInputProps,
        open: openDropzone,
    } = useDropzone({
        multiple,
        onDrop,
        onDragEnter,
        onDragLeave,
        onFileDialogCancel: onDialogClose,
    })
    const dropRootProps = getRootProps()
    const dropInputProps = getInputProps()
    const {
        onBlur: dropBlur,
        onFocus: dropFocus,
    } = dropRootProps
    const {
        onClick: dropClick,
    } = dropInputProps

    const onBlur = useCallback(event => {
        if (!isFocusLocked) {
            dropBlur(event)
            onBlurProp(event)
        }
    }, [isFocusLocked, onBlurProp, dropBlur])
    const onFocus = useCallback(event => {
        if (!isFocusLocked) {
            dropFocus(event)
            onFocusProp(event)
        }
    }, [isFocusLocked, onFocusProp, dropFocus])

    const onInputClick = useCallback(event => {
        lockFocus(true)
        dropClick(event)
    }, [dropClick])

    const handleKeyDown = useCallback(event => {
        const stepKeys = {
            'ArrowDown': 1,
            'ArrowRight': 1,
            'ArrowUp': -1,
            'ArrowLeft': -1,
        }
        if (stepKeys[event.key] !== undefined) {
            event.preventDefault()

            const s = stepKeys[event.key]

            // length contains the native element which is skipped
            const chips = getChips(baseElementRef)
            if (chips.length === 0) {
                baseElementRef.current.focus()
            } else {
                const i = getIndicesOfDescendant(baseElementRef.current, event.target)

                const next = i
                    // first level is 'row', second level is 'gridcell'
                    ? (i[1] + s) % chips.length
                    : (s > 0 ? s - 1 : s) % chips.length
                chips[ next >= 0 ? next : chips.length + next ].focus()
            }
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            baseElementRef.current.focus()
        }

        // open Dropzone directly - forwarding the event does not work if event.target is a child (e.g. Chip)
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            openDropzone()
        }
    }, [baseElementRef, openDropzone])

    const updateRootRefs = useForkedRef(ref, dropRootProps.ref, baseElementRef)
    const updateInputRefs = useForkedRef(inputRef, dropInputProps.ref)

    const renderedValue = value && value.length !== 0
        ? renderValue({
            baseElementRef,
            avatar,
            onBlur: onBlurProp,
            onChange,
            valueFocus,
            setValueFocus,
        }, value)
        : (
            <div role="gridcell">
                <span className="placeholder">{placeholder}</span>
            </div>
        )

    return (
        <div
            {...dropRootProps}

            id={id}
            aria-labelledby={id + '-label'}

            ref={updateRootRefs}

            className={className}

            role="grid"
            tabIndex={ (Array.isArray(value) ? value : [value]).includes(valueFocus) ? -1 : 0 }

            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
        >
            <div role="row">
                { renderedValue }
                <span role="gridcell">
                    <input
                        {...dropInputProps}
                        accept={accept}
                        name={name}
                        onClick={onInputClick}
                        ref={updateInputRefs}
                    />
                </span>
            </div>
        </div>
    )
})

FileDropInput.propTypes = {
    id: PropTypes.string,
    accept: PropTypes.string,
    avatar: FileChip.propTypes.avatar,
    className: PropTypes.string,
    inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    name: PropTypes.string,
    multiple: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.arrayOf(PropTypes.element, PropTypes.string), PropTypes.oneOf([null])]),
    setDropActive: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.oneOf([null, '']),
        PropTypes.instanceOf(File),
        PropTypes.arrayOf(PropTypes.instanceOf(File)),
    ]),
}
