import userEvent from '@testing-library/user-event'
import { fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { testLifield } from './_field'

describe('File', () => {
    it('Render and change file drop', async () => {
        const rendered = testLifield({
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

        const field = rendered.result.getByLabelText('foo')
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

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        userEvent.click(rendered.result.getByLabelText('foo.txt').querySelector('.MuiChip-deleteIcon'))

        expect(field).not.toHaveTextContent('foo.txt')
        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        rendered.result.getByLabelText('baz.png').focus()
        fireEvent.keyUp(rendered.result.getByLabelText('baz.png'), {key: 'Delete'})

        expect(field).not.toHaveTextContent('baz.png')
        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        expect(rendered.form.getAttribute('data-values')).toEqual(JSON.stringify([files[1]]))
    })

    it('Move focus with keyboard', async () => {
        const rendered = testLifield({
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

        const field = rendered.result.getByLabelText('foo')
        const input = field.querySelector('input')

        await act(async () => {
            await userEvent.upload(input, files)
        })

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowRight'})

        expect(rendered.result.getByLabelText('bar.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowLeft'})

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowUp'})

        expect(rendered.result.getByLabelText('baz.png')).toHaveFocus()

        fireEvent.keyDown(document.activeElement, {key: 'ArrowDown'})

        expect(rendered.result.getByLabelText('foo.txt')).toHaveFocus()
    })
})
