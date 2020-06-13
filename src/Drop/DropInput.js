import React, { useCallback, useRef, useState } from 'react'
import { Chip, Avatar } from '@material-ui/core'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import { useDropzone } from 'react-dropzone'
import { updateRef, useForkedRef } from '../util/ref'
import { indexOfChild } from '../util/dom'

const fileNameInfo = (filename) => {
    const basename = filename.replace(/.*[\\\/]/, '')
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
                        textOverflow: 'ellipsis'
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

const renderValue = ({baseElement, avatar, onBlur, onChange, setValueFocus}, value) => {
    if (!value) {
        return undefined
    }

    const valueArray = (Array.isArray(value) ? value : [value])

    const handleDelete = (file) => {
        const newValue = Array.isArray(value)
            ? valueArray.filter(f => f !== file)
            : null
        const deletedIndex = valueArray.indexOf(file)

        // trigger MUI's blur and refocus
        // otherwise activeElement will be set to body - rendering MUI's focus out of sync
        onBlur()
        const newActive = deletedIndex < (baseElement.current.children.length-2)
            ? baseElement.current.children[deletedIndex+1]
            : baseElement.current.children.length > 2
                ? baseElement.current.children[deletedIndex-1]
                : baseElement.current
        newActive.focus()

        onChange(newValue)
    }

    return valueArray.map((file) => {
        file.url = file.url || URL.createObjectURL(file)

        return (
            <FileChip
                key={file.url}
                file={file}
                avatar={avatar}
                tabIndex='-1'
                onDelete={handleDelete.bind(null, file)}
                onClick={event => event.stopPropagation()}
                onFocus={() => setValueFocus(file)}
                // onKeyDown={handleKeyDown}
            />
        )
    })
}

const focusValueChild = (baseElement, value, valueFocus) => {
    const i = (Array.isArray(value) ? value : [value]).indexOf(valueFocus)
    if (i >= 0 && i < (baseElement.children.length-1) && baseElement.children[i]) {
        baseElement.children[i].focus()
    } else if (baseElement.children.length > 1) {
        baseElement.children[0].focus()
    }
}

export const DropInput = React.forwardRef(function DropInput(props, ref) {
    const {
        accept,
        avatar,
        className,
        inputRef,
        name,
        multiple = true,
        onBlur: onBlurProp,
        onChange,
        onFocus: onFocusProp,
        placeholder,
        setDropActive,
        value,
        ...others
    } = props

    const baseElement = useRef()
    const [valueFocus, setValueFocus] = useState()
    const [isFocusLocked, lockFocus] = useState(false)

    const onDragEnter = useCallback(event => {
        setDropActive(true)
    }, [setDropActive])
    const onDragLeave = useCallback(event => {
        setDropActive(false)
    }, [setDropActive])
    const onDialogClose = useCallback(event => {
        lockFocus(false)
        focusValueChild(baseElement.current, value, valueFocus)
    }, [baseElement, value, valueFocus])
    const onDrop = useCallback(files => {
        lockFocus(false)
        setDropActive(false)
        onChange && onChange(
            multiple? (value || []).concat(files) : files[0]
        )
        baseElement.current.children[(value || []).length].focus()
    }, [value])
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

    const onBlur = useCallback(event => {
        if (!isFocusLocked) {
            dropRootProps.onBlur(event)
            onBlurProp && onBlurProp(event)
        }
    }, [onBlurProp, dropRootProps.onBlur])
    const onFocus = useCallback(event => {
        if (!isFocusLocked) {
            dropRootProps.onFocus(event)
            onFocusProp && onFocusProp(event)
        }
    }, [onFocusProp, dropRootProps.onFocus])

    const onInputClick = useCallback(event => {
        lockFocus(true)
        dropInputProps.onClick(event)
    })

    const handleKeyDown = useCallback(event => {
        const stepKeys = {
            'ArrowDown': 1,
            'ArrowRight': 1,
            'ArrowUp': -1,
            'ArrowLeft': -1,
        }
        if (stepKeys[event.key] !== undefined) {
            const s = stepKeys[event.key]

            // length contains the native element which is skipped
            const l = baseElement.current.children.length - 1
            if (l === 0) {
                baseElement.current.focus()
            } else if (l === 1) {
                baseElement.current.children[0].focus()
            } else {
                const i = event.target.parentElement === baseElement.current
                    && indexOfChild(baseElement.current, event.target)

                const next = typeof(i) === 'number'
                    ? (i + s) % l
                    : (s > 0 ? s - 1 : s) % l
                baseElement.current.children[ next >= 0 ? next : l + next ].focus()
            }
        }

        if (event.key === 'Escape') {
            baseElement.current.focus()
        }

        // open Dropzone directly - forwarding the event does not work if event.target is a child (e.g. Chip)
        if (event.key === ' ' || event.key === 'Enter') {
            openDropzone()
        }
    }, [baseElement, dropRootProps.onKeyDown])

    const updateRootRefs = useForkedRef(ref, dropRootProps.ref, baseElement)
    const updateInputRefs = useForkedRef(inputRef, dropInputProps.ref)

    const renderedValue = value && value.length !== 0
        ? renderValue({
            baseElement,
            avatar,
            onBlur: onBlurProp,
            onChange,
            valueFocus,
            setValueFocus,
        }, value)
        : <span className='placeholder'>{placeholder}</span>

    return (
        <div
            {...dropRootProps}
            className={className}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={handleKeyDown}
            ref={updateRootRefs}
        >
            { renderedValue }
            <input
                {...dropInputProps}
                accept={accept}
                name={name}
                onClick={onInputClick}
                ref={updateInputRefs}
            />
        </div>
    )
})

export default DropInput
