import React, { useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import MuiPickersAdapterProvider, { MuiPickersAdapterContext } from '@material-ui/pickers/LocalizationProvider'
import DateFns from '@material-ui/pickers/adapter/date-fns'
import { useForkedRef } from '../util/ref'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { shallowEqual } from '../util/equal'

const useStyle = makeStyles(theme => ({
    value: {
    },
    valueFocus: {
        background: theme.palette.type === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
    },
}))

let daysInMonth = (dateUtil, ...args) => {
    const d = typeof(args[0]) === 'object'
        ? args[0]
        : dateUtil.date(new Date(args[0], args[1] - 1))
    const end = dateUtil.endOfMonth(d)
    return Number(dateUtil.formatByString(end, 'dd'))
}

const validateValue = (dateUtil, value, placeholder, currentDate) => {
    value = Number(value)
    if (placeholder === 'yyyy') {
        // might want to use min and max date for autocorrection of small values
        return value < 100
            ? value + (value > 30 ? 1900 : 2000)
            : value <= 2100 ? value : undefined
    } else if (placeholder === 'MM') {
        return value >= 1 && value <= 12 ? value : undefined
    } else if (placeholder === 'dd') {
        return value >= 1 && value <= daysInMonth(dateUtil, currentDate) ? value : undefined
    } else if (placeholder === 'HH') {
        return value >= 0 && value <= 23 ? value : undefined
    } else if (placeholder === 'mm' || placeholder === 'ss') {
        return value >= 0 && value <= 59 ? value : undefined
    }
}

const resetInput = (value) => {
    const i = value.input.findIndex(p => p.type === 'value')
    const v = value.input[i].value
    return {index: i, value: v}
}

export const PickerInput = React.forwardRef(function PickerInput(props, ref) {
    const {
        className,
        classes,

        onBlur: onBlurProp,
        onFocus: onFocusProp,
        
        dateUtil,
        onChange: onChangeProp,
        value,
        placeholder,

        ...others
    } = props

    const style = useStyle()

    const inputRef = useRef()
    const forkedInputRef = useForkedRef(ref, inputRef)

    const [input, updateInput] = useReducer((state, action) => {
        if (action.type === 'moveFocus' && action.step) {
            for (let i = state.index + action.step; i >= 0 && i < value.input.length; i += action.step) {
                if (value.input[i].type === 'value') {
                    return {index: i, value: value.input[i].value}
                }
            }
        }
        if (action.type === 'setFocus' && action.index !== undefined) {
            return {index: action.index, value: value.input[action.index].value}
        }
        if (action.type === 'reset') {
            return resetInput(value)
        }
        if (action.type === 'change') {
            return {index: state.index, value: action.value}
        }
        return state
    }, value, resetInput)

    useEffect(() => {
        if (isInputFocused && value.input[input.index].value,input.value) {
            updateInput({type: 'change', value: value.input[input.index].value})
        } else if (!isInputFocused && !shallowEqual(resetInput(value), input)) {
            updateInput({type: 'reset'})
        }
    }, [value])

    const [isInputFocused, setInputFocus] = useState(false)

    const onFocus = useCallback(event => setInputFocus(true), [setInputFocus])

    const onChange = event => {
        let newValue = event.target.value === ''
            || validateValue(dateUtil, event.target.value, value.input[input.index].placeholder, value.parsed)
            ? event.target.value
            : validateValue(dateUtil, event.target.value.substr(-1), value.input[input.index].placeholder, value.parsed)
                && event.target.value.substr(-1)
        if (newValue === undefined) {
            return
        }
        newValue = String(Number(newValue)).padStart(value.input[input.index].placeholder.length, '0')

        if (newValue > 0 && validateValue(dateUtil, newValue + '0', value.input[input.index].placeholder, value.parsed) === undefined) {
            updateInput({type: 'change', value: newValue})
            updateInput({type: 'moveFocus', step: 1})
            commitValue(newValue)
        } else {
            updateInput({type: 'change', value: newValue})
        }
    }
    const commitValue = committedValue => {
        const newValue = validateValue(dateUtil, committedValue, value.input[input.index].placeholder, value.parsed)
        if (newValue === undefined) {
            return
        }

        const newDate = dateUtil.parse(
            value.input.map((p,i) => {
                if (p.type === 'formatter') {
                    return p.placeholder
                }
                if (i === input.index) {
                    return newValue
                }

                // when switching to a month with less days, date might need correction
                if (p.placeholder === 'dd'
                    && value.input[input.index].placeholder === 'MM'
                ) {
                    const y = value.input.find(p => p.placeholder[0] === 'y')
                    return Math.min(daysInMonth(dateUtil, y && y.value, newValue), p.value)
                }

                return p.value
            }).join(''),
            value.input.map(p => p.placeholder).join(''),
        )

        if (String(newDate) !== 'Invalid Date') {
            onChangeProp(newDate)
        }
    }
    const onBlur = event => {
        commitValue(event.target.value)
        setInputFocus(false)
    }
    const onKeyDown = event => {
        const moveKeys = {
            'ArrowLeft': -1,
            'ArrowRight': 1,
        }
        if (moveKeys[event.key]) {
            event.preventDefault()

            commitValue(event.target.value)
            updateInput({type: 'moveFocus', step: moveKeys[event.key]})
        }

        const addKeys = {
            'ArrowDown': -1,
            'ArrowUp': 1,
        }
        if (addKeys[event.key]) {
            event.preventDefault()

            let newValue = Number(event.target.value) + addKeys[event.key]
            newValue = validateValue(dateUtil, newValue, value.input[input.index].placeholder, value.parsed)
            if (newValue === undefined) {
                return
            }
            newValue = String(Number(newValue)).padStart(value.input[input.index].placeholder.length, '0')

            updateInput({type: 'change', value: newValue})
        }
    }

    useEffect(() => {
        if (isInputFocused) {
            inputRef.current.select()
        }
    }, [value, isInputFocused, input.index])

    const renderedValue = isInputFocused
        ? value.input.map((part,i) => (
            part.type === 'value'
            ? (
                <span
                    key={i}
                    className={clsx(
                        style.value,
                        input.index === i && style.valueFocus,
                    )}
                    onMouseDown={event => {
                        updateInput({type: 'setFocus', index: i})
                        event.preventDefault()
                    }}
                    onClick={event => event.stopPropagation()}
                >
                    { i === input.index ? input.value : part.value }
                </span>
            )
            : (
                <span
                    key={i}
                    className={style.formatter}
                >
                    {part.placeholder}
                </span>
            )
        ))
        : value.display
            ? <span className={style.value}>{value.display}</span>
            : <span className='placeholder'>{placeholder}</span>

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
                type='number'
                onBlur={onBlur}
                onFocus={onFocus}
                onKeyDown={onKeyDown}
                onChange={onChange}
                value={isInputFocused && input.value}
                style={{maxHeight: 0, maxWidth: 0, padding: 0, margin: 0, border: 0}}
            />
        </div>
    )
})

export default PickerInput
