import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useForkedRef } from '../../util/ref'
import { useForkedCallback } from '../../util/func'

const useStyle = makeStyles(theme => ({
    value: {
        whiteSpace: 'pre',
        boxSizing: 'content-box',
        padding: '2px 2px',
        margin: '-2px -2px',
        outline: 0,
    },
    valueFocus: {
        background: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        '&::selection': {
            background: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
            color: theme.palette.primary.contrastText,
        },
        fontSize: 'inherit',
        border: 0,
        outline: 0,
    },
}))

const resetInput = aspects => {
    const i = aspects.findIndex(p => Object.keys(p).includes('value'))
    const v = aspects[i].value
    return {index: i, value: v}
}

export const AspectInput = React.forwardRef(function AspectInput(props, ref) {
    const {
        id,
        className,

        onBlur: onBlurProp,
        onFocus: onFocusProp,

        // callback receiving the partial value and the index of the aspect
        // should return the (corrected) value or undefined for invalid inputs
        validate: validateProp,

        // callback receiving the partial value and the index of the aspect
        // should update the component value
        commit: commitProp,

        aspects,
        display,
        placeholder,
    } = props

    const style = useStyle()

    const inputRef = useRef()
    const forkedInputRef = useForkedRef(ref, inputRef)

    const [isInputFocused, setInputFocus] = useState(false)

    const [activeAspect, updateAspect] = useReducer((state, action) => {
        if (action.type === 'moveFocus' && action.step) {
            for (let i = state.index + action.step; i >= 0 && i < aspects.length; i += action.step) {
                if (Object.keys(aspects[i]).includes('value')) {
                    return {index: i, value: aspects[i].value}
                }
            }
        }
        if (action.type === 'setFocus' && action.index !== undefined) {
            return {index: action.index, value: aspects[action.index].value}
        }
        if (action.type === 'reset') {
            return resetInput(aspects)
        }
        if (action.type === 'change') {
            return {index: state.index, value: action.value}
        }
        return state
    }, aspects, resetInput)

    useEffect(() => {
        if (aspects[activeAspect.index].value != activeAspect.value) {
            updateAspect({type: 'change', value: aspects[activeAspect.index].value})
        }
    // should not run on changes of activeAspect
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [isInputFocused, aspects])

    const commitAspect = committedValue => {
        const newValue = validateProp(committedValue, activeAspect.index)
        if (newValue === undefined) {
            return
        }

        commitProp(committedValue, activeAspect.index)
    }

    const onChange = event => {
        let newValue = event.target.value === ''
            || validateProp(event.target.value, activeAspect.index)
            ? event.target.value
            : validateProp(event.target.value.substr(-1), activeAspect.index)
                && event.target.value.substr(-1)

        if (newValue === undefined) {
            return
        }

        const isNumericInput = Boolean(aspects[activeAspect.index].isNumeric ?? true)

        if (isNumericInput && isNaN(newValue)) {
            return
        }

        const paddedValue = !aspects[activeAspect.index].placeholder
            ? newValue
            : isNumericInput
                ? String(Number(newValue)).padStart(aspects[activeAspect.index].placeholder.length, '0')
                : String(newValue).padStart(aspects[activeAspect.index].placeholder.length, ' ')

        const isEmpty = isNumericInput ? newValue == 0 : String(newValue).trim() == ''

        // determine if there can be another char in this field without overflow
        const nextCharOverflow = !isEmpty && (
            isNumericInput
                ? validateProp(newValue + '0', activeAspect.index) === undefined
                : aspects[activeAspect.index].placeholder && String(newValue).trim().length >= aspects[activeAspect.index].placeholder.length
        )

        if (nextCharOverflow) {
            updateAspect({type: 'change', value: paddedValue})
            updateAspect({type: 'moveFocus', step: 1})
            commitAspect(paddedValue)
        } else {
            updateAspect({type: 'change', value: paddedValue})
        }
    }

    const onKeyDown = event => {
        const moveKeys = {
            'ArrowLeft': -1,
            'ArrowRight': 1,
        }
        if (moveKeys[event.key]) {
            event.preventDefault()

            commitAspect(event.target.value)
            updateAspect({type: 'moveFocus', step: moveKeys[event.key]})
        }

        const addKeys = {
            'ArrowDown': -1,
            'ArrowUp': 1,
        }
        if (addKeys[event.key]) {
            event.preventDefault()

            const isNumericInput = Boolean(aspects[activeAspect.index].isNumeric ?? true)

            let newValue = isNumericInput
                ? Number(event.target.value) + addKeys[event.key]
                : event.target.value.length > 0 && String.fromCharCode(event.target.value.charCodeAt(event.target.value.length - 1) + addKeys[event.key])

            newValue = validateProp(newValue, activeAspect.index)

            if (newValue === undefined) {
                return
            }

            const paddedValue = !aspects[activeAspect.index].placeholder
                ? newValue
                : isNumericInput
                    ? String(Number(newValue)).padStart(aspects[activeAspect.index].placeholder.length, '0')
                    : String(newValue).padStart(aspects[activeAspect.index].placeholder.length, ' ')

            updateAspect({type: 'change', value: paddedValue})
        }
    }

    const gridRef = useRef()
    const onFocus = useForkedCallback(onFocusProp, (e) => e.target.getAttribute('tabindex') === '0' && setInputFocus(true), [setInputFocus])
    const onBlur = useCallback(event => {
        if (!event.relatedTarget || event.relatedTarget.parentElement !== gridRef.current) {
            setInputFocus(false)
            onBlurProp(event)
        }
    }, [onBlurProp, setInputFocus])

    useEffect(() => {
        if (isInputFocused) {
            inputRef.current.select()
        }
    }, [aspects, isInputFocused, activeAspect.index])

    const renderedValue = isInputFocused
        ? aspects.map((a,i) => {
            if (Object.keys(a).includes('value')) {
                const isActive = i === activeAspect.index
                const isNumeric = a.isNumeric ?? true
                const AspectComponent = isActive ? 'input' : 'span'

                return (
                    <AspectComponent
                        key={i}
                        aria-label={a.label}
                        onClick={event => {
                            updateAspect({type: 'setFocus', index: i})
                            event.stopPropagation()
                        }}
                        title={a.label}
                        {...(isActive
                            ? {
                                ref: forkedInputRef,
                                role: 'textbox',
                                className: clsx(style.value, style.valueFocus),
                                tabIndex: 0,
                                onBlur: event => event.target.value !== aspects[activeAspect.index].value && commitAspect(activeAspect.value),
                                onKeyDown,
                                onChange,
                                value: activeAspect.value,

                                // style of number inputs is suspect to the user agent
                                type: isNumeric ? 'tel' : 'text',
                                pattern: a.pattern || (isNumeric ? '\\d*\\' + String(1.5).substr(1,1) + '\\d*' : undefined),

                                style: { width: a.placeholder ? a.placeholder.length + 'ch' : undefined },
                            }
                            : {
                                role: 'gridcell',
                                className: style.value,
                                tabIndex: -1,
                            }
                        )}
                    >
                        { isActive ? undefined : a.value }
                    </AspectComponent>
                )
            }

            return (
                <span
                    key={i}
                    className={style.formatter}
                >
                    {a.text ?? a.placeholder}
                </span>
            )
        })
        : display
            ? <span tabIndex="-1" className={style.value}>{display}</span>
            : <span tabIndex="-1" className={clsx(style.value, 'placeholder')}>{placeholder}</span>

    return <>
        <div
            ref={gridRef}
            id={id}
            role={ isInputFocused ? 'grid' : undefined }
            onBlur={onBlur}
            onFocus={onFocus}
            className={clsx(
                className,
                style.input
            )}
        >
            { isInputFocused ? null : <span role="button" ref={forkedInputRef} tabIndex="0"/> }
            { renderedValue }
        </div>
        <input type="hidden" name={name} value={aspects.map(a => Object.keys(a).includes('value') ? a.value : a.text).join('')}/>
    </>
})

AspectInput.propTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    validate: PropTypes.func,
    commit: PropTypes.func,
    aspects: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.shape({
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            label: PropTypes.string,
            placeholder: PropTypes.string,
            pattern: PropTypes.string,
            isNumeric: PropTypes.bool,
        }),
        PropTypes.shape({
            text: PropTypes.string.isRequired,
        }),
    ])).isRequired,
    display: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.arrayOf([PropTypes.string, PropTypes.element]),
    ]).isRequired,
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
        PropTypes.arrayOf([PropTypes.string, PropTypes.element]),
        PropTypes.oneOf([null])
    ]),
}
