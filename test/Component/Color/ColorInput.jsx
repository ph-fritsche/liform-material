import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ColorInput } from '../../../src/Component/Color/ColorInput'
import { wrapInTheme } from '../../_theme'

function renderColorInput(props) {
    const rendered = render(wrapInTheme(<ColorInput id="foo" {...props} />))

    const element = rendered.container.firstChild
    const colorInput = rendered.container.querySelector('input[type=color]')

    expect(element).toBeInstanceOf(HTMLDivElement)
    expect(colorInput).toBeInstanceOf(HTMLInputElement)

    return {
        ...rendered,
        element,
        colorInput,
    }
}

describe('ColorInput', () => {
    it('Clicks open and close native control', () => {
        const { colorInput, element } = renderColorInput()

        const onClick = jest.fn()
        colorInput.addEventListener('click', onClick)

        // clicking the component anywhere should trigger a click on the native control
        userEvent.click(element)
        expect(onClick).toBeCalled()

        // when the control is open another click should close it
        onClick.mockClear()
        userEvent.click(element)
        expect(onClick).not.toBeCalled()

        // open again
        onClick.mockClear()
        userEvent.click(element)
        expect(onClick).toBeCalled()

        // a click somewhere else should close the picker
        userEvent.click(document.body)

        // so that another click shoudl open the picker
        onClick.mockClear()
        userEvent.click(element)
        expect(onClick).toBeCalled()
    })

    it('Change color per native color picker', () => {
        const onChange = jest.fn()
        const { colorInput } = renderColorInput({ onChange })

        fireEvent.change(colorInput, { target: { value: '#123456' } })

        expect(onChange).toBeCalledWith('#123456')
    })

    it('Remove color per keyboard', () => {
        const onChange = jest.fn()
        const { colorInput } = renderColorInput({ onChange })

        fireEvent.keyDown(colorInput, { key: 'Delete' })

        expect(onChange).toBeCalledWith('')
    })

    it('Remove color per pointer', () => {
        const onChange = jest.fn()
        const { getByLabelText } = renderColorInput({ onChange })

        userEvent.click(getByLabelText('Remove color value'))

        expect(onChange).toBeCalledWith('')
    })
})
