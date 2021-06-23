import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileDropInput } from '../../../src/Component/FileDrop/FileDropInput'
import { wrapInTheme } from '../../_theme'

function renderFileDropInput(props) {
    const rendered = render(wrapInTheme(<FileDropInput {...props} />))

    return {
        ...rendered,
        element: rendered.container.firstChild,
        nativeInput: rendered.container.querySelector('input[type=file]'),
    }
}

let dropzoneReturn
jest.mock('react-dropzone', () => {
    const dropzoneModule = jest.requireActual('react-dropzone')

    return {
        ...dropzoneModule,
        useDropzone: options => {
            const hookReturn = dropzoneModule.useDropzone(options)
            dropzoneReturn = {
                ...hookReturn,
                inputProps: hookReturn.getInputProps(),
                rootProps: hookReturn.getRootProps(),
            }

            return hookReturn
        },
    }
})

function closeFileDialog() {
    act(() => {
        jest.useFakeTimers()
        fireEvent.focus(window)
        jest.runAllTimers()
    })
    expect(dropzoneReturn.isFileDialogActive).toBe(false)
}

describe('FileDropField', () => {
    it('Relay click to native element', () => {
        const { element, nativeInput } = renderFileDropInput()

        const clickListener = jest.fn()
        nativeInput.addEventListener('click', clickListener)

        userEvent.click(element)
        expect(clickListener).toBeCalled()
    })

    it('Open file dialog per keyboard', () => {
        const { element, getByLabelText } = renderFileDropInput({
            value: [
                new File(['foo'], 'foo.txt', { type: 'text/plain' }),
            ],
        })

        element.focus()
        fireEvent.keyDown(document.activeElement, { key: 'Enter' })

        expect(dropzoneReturn.isFileDialogActive).toBe(true)

        closeFileDialog()

        getByLabelText('foo.txt').focus()
        fireEvent.keyDown(document.activeElement, { key: ' ' })

        expect(dropzoneReturn.isFileDialogActive).toBe(true)
    })

    it('File dialog traps focus', () => {
        const onFocus = jest.fn()
        const onBlur = jest.fn()
        const { element, nativeInput } = renderFileDropInput({ onBlur, onFocus })

        userEvent.click(element)

        expect(dropzoneReturn.isFileDialogActive).toBe(true)
        expect(onFocus).toBeCalled()
        expect(onBlur).not.toBeCalled()

        fireEvent.blur(nativeInput)
        expect(onBlur).not.toBeCalled()

        act(() => {
            jest.useFakeTimers()
            fireEvent.focus(window)
            jest.runAllTimers()
        })

        expect(dropzoneReturn.isFileDialogActive).toBe(false)
        expect(onBlur).not.toBeCalled()

        fireEvent.blur(nativeInput)
        expect(onBlur).toBeCalled()
    })

    it('Add files per file dialog', async () => {
        const onChange = jest.fn()
        const value = [
            new File(['foo'], 'foo.txt', { type: 'text/plain' }),
        ]
        const { nativeInput } = renderFileDropInput({ onChange, value })

        const newFiles = [
            new File(['bar'], 'bar.txt', { type: 'text/plain' }),
            new File(['baz'], 'baz.png', { type: 'image/png' }),
        ]

        await act(async () => {
            await userEvent.upload(nativeInput, newFiles)
        })

        expect(onChange).toBeCalledWith([].concat(value, newFiles))
    })

    it('Remove file per pointer', () => {
        const onChange = jest.fn()
        const value = [
            new File(['foo'], 'foo.txt', { type: 'text/plain' }),
            new File(['bar'], 'bar.txt', { type: 'text/plain' }),
            new File(['baz'], 'baz.png', { type: 'image/png' }),
        ]
        const { getByLabelText } = renderFileDropInput({ onChange, value })

        const chip = getByLabelText('foo.txt')
        userEvent.click(chip.querySelector('.MuiChip-deleteIcon'))

        expect(onChange).toBeCalledWith(value.slice(1))
    })

    it('Remove file per keyboard', () => {
        const onChange = jest.fn()
        const value = [
            new File(['foo'], 'foo.txt', { type: 'text/plain' }),
            new File(['bar'], 'bar.txt', { type: 'text/plain' }),
            new File(['baz'], 'baz.png', { type: 'image/png' }),
        ]
        const { getByLabelText } = renderFileDropInput({ onChange, value })

        const chip = getByLabelText('baz.png')
        chip.focus()
        fireEvent.keyUp(chip, { key: 'Delete' })

        expect(onChange).toBeCalledWith([value[0], value[1]])
    })

    it('Move focus with pointer', () => {
        const { getByLabelText } = renderFileDropInput({
            value: [
                new File(['foo'], 'foo.txt', { type: 'text/plain' }),
                new File(['bar'], 'bar.txt', { type: 'text/plain' }),
                new File(['baz'], 'baz.png', { type: 'image/png' }),
            ],
        })
        const chipBar = getByLabelText('bar.txt')

        userEvent.click(chipBar)
        expect(chipBar).toHaveFocus()
    })

    it('Move focus with keyboard', () => {
        const { element, getByLabelText } = renderFileDropInput({
            value: [
                new File(['foo'], 'foo.txt', { type: 'text/plain' }),
                new File(['bar'], 'bar.txt', { type: 'text/plain' }),
                new File(['baz'], 'baz.png', { type: 'image/png' }),
            ],
        })

        userEvent.tab()
        expect(element).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
        expect(getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
        expect(getByLabelText('bar.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' })
        expect(getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' })
        expect(getByLabelText('baz.png')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' })
        expect(getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, { key: 'Escape' })
        expect(element).toHaveFocus()
    })

    it('Arrow keys move focus to grid if there are no chips', () => {
        const { element, nativeInput } = renderFileDropInput()
        nativeInput.focus()

        fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' })
        expect(element).toHaveFocus()
    })

    it('Preserve focus when file dialog is closed', () => {
        const { element, getByLabelText } = renderFileDropInput({
            value: [
                new File(['foo'], 'foo.txt', { type: 'text/plain' }),
                new File(['bar'], 'bar.txt', { type: 'text/plain' }),
                new File(['baz'], 'baz.png', { type: 'image/png' }),
            ],
        })
        const chipBar = getByLabelText('bar.txt')

        chipBar.focus()
        userEvent.click(element)
        expect(dropzoneReturn.isFileDialogActive).toBe(true)
        expect(chipBar).not.toHaveFocus()

        closeFileDialog()

        expect(chipBar).toHaveFocus()
    })
})
