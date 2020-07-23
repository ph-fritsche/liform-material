import React, { useEffect, useReducer, useRef, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { useForkedRef } from '../../util/ref'
import { shallowEqual } from '../../util/equal'

const useStyle = makeStyles(theme => ({
    value: {
        whiteSpace: 'pre',
    },
    valueFocus: {
        background: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}))

const resetInput = aspects => {
    const i = aspects.findIndex(p => p.type === 'value')
    const v = aspects[i].value
    return {index: i, value: v}
}

export const AspectInput = React.forwardRef(function AspectInput(props, ref) {
    const {
        className,

        onBlur: onBlurProp,
        onFocus: onFocusProp,

        // callback receiving the partial value and the index of the aspect
        // should return the (corrected) value or undefined for invalid inputs
        validate: validateProp,

        // callback receiving the partial value and the index of the aspect
        // should update the component value
        commit: commitProp,

        // should be an array of objects like {type?:'value'|any, value?: any, key?: string, placeholder?: string, text?: string, isNumeric?: boolean}
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
                if (aspects[i].type === 'value') {
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
        if (isInputFocused && aspects[activeAspect.index].value != activeAspect.value) {
            updateAspect({type: 'change', value: aspects[activeAspect.index].value})
        } else if (!isInputFocused && !shallowEqual(resetInput(aspects), activeAspect)) {
            updateAspect({type: 'reset'})
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

    const onFocus = () => setInputFocus(true)

    const onBlur = event => {
        commitAspect(event.target.value)
        setInputFocus(false)
    }

    useEffect(() => {
        if (isInputFocused) {
            inputRef.current.select()
        }
    }, [aspects, isInputFocused, activeAspect.index])

    const renderedValue = isInputFocused
        ? aspects.map((a,i) => (
            a.type === 'value'
                ? (
                    // key event handled by parent
                    /* eslint-disable jsx-a11y/click-events-have-key-events */
                    <span
                        key={i}
                        role="textbox"
                        tabIndex={-1}
                        className={clsx(
                            style.value,
                            activeAspect.index === i && style.valueFocus,
                        )}
                        onMouseDown={event => {
                            updateAspect({type: 'setFocus', index: i})
                            event.preventDefault()
                        }}
                        onClick={event => event.stopPropagation()}
                    >
                        { i === activeAspect.index ? activeAspect.value : a.value }
                    </span>
                )
                : (
                    <span
                        key={i}
                        className={style.formatter}
                    >
                        {a.text ?? a.placeholder}
                    </span>
                )
        ))
        : display
            ? <span className={style.value}>{display}</span>
            : <span className="placeholder">{placeholder}</span>

    return (
        <div
            tabIndex={-1}
            onFocus={onFocusProp}
            onBlur={onBlurProp}
            className={clsx (
                className,
                style.input
            )}
        >
            { renderedValue }
            <input
                ref={forkedInputRef}
                type={ aspects[activeAspect.index].isNumeric ?? true ? 'number' : 'text' }
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onChange={onChange}
                value={isInputFocused ? activeAspect.value : ''}
                style={{maxHeight: 0, maxWidth: 0, padding: 0, margin: 0, border: 0}}
            />
        </div>
    )
})
