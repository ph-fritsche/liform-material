import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { testLifield } from './_field'

describe('File', () => {
    it('Render and change file drop', async () => {
        const { field, result, getLiformValue } = testLifield({
            schema: {
                widget: 'file',
                title: 'foo',
            },
        })

        const files = [
            new File(['foo'], 'foo.txt', {type: 'text/plain'}),
            new File(['bar'], 'bar.txt', {type: 'text/plain'}),
            new File(['baz'], 'baz.png', {type: 'image/png'}),
        ]

        const clickListener = jest.fn()
        const input = field.querySelector('input')
        input.addEventListener('click', clickListener)

        userEvent.click(field)

        expect(clickListener).toBeCalled()

        await act(async () => {
            await userEvent.upload(input, files)
        })

        expect(field).toHaveTextContent('foo.txt')
        expect(field).toHaveTextContent('bar.txt')
        expect(field).toHaveTextContent('baz.png')

        expect(result.getByLabelText('foo.txt')).toHaveFocus()

        userEvent.click(result.getByLabelText('foo.txt').querySelector('.MuiChip-deleteIcon'))

        expect(field).not.toHaveTextContent('foo.txt')
        expect(result.getByLabelText('bar.txt')).toHaveFocus()

        result.getByLabelText('baz.png').focus()
        fireEvent.keyUp(result.getByLabelText('baz.png'), {key: 'Delete'})

        expect(field).not.toHaveTextContent('baz.png')
        expect(result.getByLabelText('bar.txt')).toHaveFocus()

        expect(getLiformValue()).toEqual([files[1]])
    })

    it('Move focus with keyboard', async () => {
        const { field, result } = testLifield({
            schema: {
                widget: 'file',
                title: 'foo',
            },
        })

        const files = [
            new File(['foo'], 'foo.txt', {type: 'text/plain'}),
            new File(['bar'], 'bar.txt', {type: 'text/plain'}),
            new File(['baz'], 'baz.png', {type: 'image/png'}),
        ]

        const input = field.querySelector('input')

        await act(async () => {
            await userEvent.upload(input, files)
        })

        expect(result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowRight'})

        expect(result.getByLabelText('bar.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowLeft'})

        expect(result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowUp'})

        expect(result.getByLabelText('baz.png')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowDown'})

        expect(result.getByLabelText('foo.txt')).toHaveFocus()
    })
})
