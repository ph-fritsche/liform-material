import userEvent from '@testing-library/user-event'
import { act } from '@testing-library/react'
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

        expect(getLiformValue()).toEqual(files)
    })
})
