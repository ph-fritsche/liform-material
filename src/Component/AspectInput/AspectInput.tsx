import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useForkedRef, useForkedCallback } from 'liform-util'

const useStyle = makeStyles(theme => ({
    value: {
        boxSizing: 'content-box',
        padding: '2px 2px',
        margin: '-2px -2px',
    },
    valueFocus: {
        background: theme.palette.mode === 'light' ? theme.palette.primary.light : theme.palette.primary.dark,
        '& $input': {
            outline: 0,

            background: 'transparent',
            color: 'transparent',
            textShadow: '0 0 0 ' + theme.palette.primary.contrastText,
            '&::selection': {
                background: 'transparent',
                color: 'transparent',
                textShadow: '0 0 0 ' + theme.palette.primary.contrastText,
            },
        },
    },
    input: {},
}))

type AspectValue = {
    value: string
    label?: string
    isNumeric?: boolean
    placeholder?: string
    inputMode?: React.HTMLAttributes<HTMLSpanElement>['inputMode']
    pattern?: string
}
type AspectText = {
    text?: string
    placeholder?: string
}
export type Aspect = AspectValue | AspectText

export const AspectInput = React.forwardRef(function AspectInput(
    {
        id,
        className,
        onBlur: onBlurProp,
        onFocus: onFocusProp,
        validate: validateProp,
        commit: commitProp,
        aspects,
        display,
        placeholder,
    }: {
        id: string,
        className?: string,

        onBlur?: (e: React.FocusEvent) => void,
        onFocus?: (e: React.FocusEvent) => void,

        /**
         * Callback receiving the partial value and the index of the aspect.
         * Should return the (corrected) value or undefined for invalid inputs.
         */
        validate: (value: string|number, index: number) => string|number|undefined,

        /**
         * Callback receiving the partial value and the index of the aspect.
         * Should update the component value.
         */
        commit: (value: string, index: number) => void,

        aspects: Aspect[],
        display?: string,
        placeholder?: string,
    },
    ref: React.ForwardedRef<HTMLSpanElement>,
) {
    const style = useStyle()

    const inputRef = useRef<HTMLSpanElement>(null)
    const forkedInputRef = useForkedRef<HTMLSpanElement>(ref, inputRef)

    const [isInputFocused, setInputFocus] = useState(false)

    const [activeAspect, updateAspect] = useReducer((
        state: {
            index: number
            value: string
        },
        action: {
            type: 'moveFocus'
            step: number
        } | {
            type: 'setFocus'
            index: number
        } | {
            type: 'change'
            value: string
        },
    ) => {
        if (action.type === 'moveFocus' && action.step) {
            for (let i = state.index + action.step; i >= 0 && i < aspects.length; i += action.step) {
                const a = aspects[i]
                if ('value' in a) {
                    return {index: i, value: a.value}
                }
            }
        }
        if (action.type === 'setFocus' && action.index !== undefined) {
            const a = aspects[action.index]
            if ('value' in a) {
                return {index: action.index, value: a.value}
            }
        }
        if (action.type === 'change') {
            return {index: state.index, value: action.value}
        }
        return state
    }, aspects, (aspects) => {
        const i = aspects.findIndex(p => 'value' in p)
        return { index: i, value: (aspects[i] as AspectValue).value }
    })

    useEffect(() => {
        const a = aspects[activeAspect.index] as AspectValue
        if (a.value != activeAspect.value) {
            updateAspect({type: 'change', value: a.value})
        }
    // should not run on changes of activeAspect
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [isInputFocused, aspects])

    function commitAspect(committedValue: string) {
        const a = aspects[activeAspect.index] as AspectValue
        if (committedValue !== a.value) {
            commitProp(committedValue, activeAspect.index)
        }
    }

    function changeAspect(newValue: string|number) {
        const a = aspects[activeAspect.index] as AspectValue
        const isNumericInput = Boolean(a.isNumeric ?? true)
        const paddedValue = !a.placeholder
            ? String(newValue)
            : isNumericInput
                ? String(Number(newValue)).padStart(a.placeholder.length, '0')
                : String(newValue).padStart(a.placeholder.length, ' ')

        updateAspect({type: 'change', value: paddedValue})

        return paddedValue
    }

    function onInput(event: React.ChangeEvent<HTMLSpanElement>) {
        const inputValue = event.target.textContent ?? ''

        const newValue = inputValue === ''
            ? ''
            : validateProp(inputValue, activeAspect.index)
            ?? validateProp(inputValue.substr(-1), activeAspect.index)

        if (newValue === undefined || typeof newValue === 'number' && isNaN(newValue)) {
            event.target.textContent = activeAspect.value
            return
        }

        const a = aspects[activeAspect.index] as AspectValue
        const isNumericInput = a.isNumeric ?? true

        const isEmpty = isNumericInput ? newValue == 0 : String(newValue).trim() == ''

        // determine if there can be another char in this field without overflow
        const nextCharOverflow = !isEmpty && (
            isNumericInput
                ? validateProp(newValue + '0', activeAspect.index) === undefined
                : a.placeholder && String(newValue).trim().length >= (a.placeholder?.length ?? 0)
        )

        const paddedValue = changeAspect(newValue)

        event.target.textContent = paddedValue
        setSelection(event.target, true)

        if (nextCharOverflow) {
            updateAspect({type: 'moveFocus', step: 1})
            commitAspect(paddedValue)
        }
    }

    function onKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
        const a = aspects[activeAspect.index] as AspectValue
        const inputValue = event.currentTarget.textContent ?? ''

        const moveKeys: Record<string, number> = {
            'ArrowLeft': -1,
            'ArrowRight': 1,
        }
        if (moveKeys[event.key]) {
            event.preventDefault()

            commitAspect(inputValue)
            updateAspect({type: 'moveFocus', step: moveKeys[event.key]})
        }

        const addKeys: Record<string, number> = {
            'ArrowDown': -1,
            'ArrowUp': 1,
        }
        if (addKeys[event.key]) {
            event.preventDefault()

            const isNumericInput = Boolean(a.isNumeric ?? true)

            const newValue = isNumericInput
                ? Number(inputValue) + addKeys[event.key]
                : inputValue.length === 0
                    ? ''
                    : String.fromCharCode(inputValue.charCodeAt(inputValue.length - 1) + addKeys[event.key])

            const validatedValue = validateProp(newValue, activeAspect.index)

            if (validatedValue === undefined) {
                return
            }

            changeAspect(validatedValue)
        }
    }

    const gridRef = useRef<HTMLDivElement>(null)
    const onFocus = useForkedCallback(
        onFocusProp ?? [],
        (e: React.FocusEvent) => e.target.getAttribute('tabindex') === '0'
            && setInputFocus(true),
        [setInputFocus],
    )
    const onBlur = useCallback((event: React.FocusEvent) => {
        if (event.relatedTarget) {
            let el: EventTarget|null = event.relatedTarget
            do {
                if (el === gridRef.current) {
                    return
                }
                el = 'parentElement' in el
                    ? (el as HTMLElement).parentElement
                    : null
            } while (el)
        }
        setInputFocus(false)
        onBlurProp && onBlurProp(event)
    }, [onBlurProp, setInputFocus])

    useEffect(() => {
        if (isInputFocused && inputRef.current) {
            inputRef.current.focus()
            setSelection(inputRef.current)
        }
    }, [aspects, isInputFocused, activeAspect.index])

    const renderedValue = isInputFocused
        ? aspects.map((a, i) => {
            if ('value' in a) {
                const isActive = i === activeAspect.index
                const isNumeric = a.isNumeric ?? true

                return (
                    <span
                        key={i}
                        role="gridcell"
                        className={clsx(style.value, isActive && style.valueFocus)}
                    >
                        <span
                            ref={ isActive ? forkedInputRef : null }

                            role="textbox"
                            className={style.input}

                            aria-label={a.label}
                            title={a.label}

                            tabIndex={ isActive ? 0 : -1 }
                            onFocus={event => {
                                updateAspect({type: 'setFocus', index: i})
                                event.stopPropagation()
                            }}
                            onClick={event => {
                                event.stopPropagation()
                            }}

                            inputMode={ a.inputMode || (isNumeric ? 'decimal' : 'text') }
                            // pattern={ a.pattern || (isNumeric ? '\\d*\\' + String(1.5).substr(1, 1) + '\\d*' : undefined) }

                            contentEditable={isActive}
                            suppressContentEditableWarning={true}
                            onBlur={event => {
                                isActive && event.target.textContent !== a.value && commitAspect(activeAspect.value)
                            }}
                            onKeyDown={isActive ? onKeyDown : undefined}
                            onInput={isActive ? onInput : undefined}
                        >
                            { isActive ? activeAspect.value : a.value }
                        </span>
                    </span>
                )
            }

            return (
                <span
                    key={i}
                    aria-hidden="true"
                >
                    {a.text ?? a.placeholder}
                </span>
            )
        })
        : (
            <span role="gridcell">
                <span role="button" ref={forkedInputRef} tabIndex={0}/>
                { display
                    ? <span>{display}</span>
                    : <span className="placeholder">{placeholder}</span>
                }
            </span>
        )

    return (
        <div
            ref={gridRef}

            id={id}
            aria-labelledby={id + '-label'}

            role="grid"
            tabIndex={-1}

            onBlur={onBlur}
            onFocus={onFocus}

            className={className}
        >
            <div role="row">
                { renderedValue }
            </div>
        </div>
    )
})

function setSelection (
    element: Element,
    collapse?: boolean,
) {
    const sel = element.ownerDocument.getSelection()
    sel?.removeAllRanges()
    sel?.selectAllChildren(element)
    if (collapse) {
        sel?.collapseToEnd()
    }
}
