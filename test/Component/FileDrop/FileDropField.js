import React from 'react'
import { fireEvent, render, act } from '@testing-library/react'
import { FileDropField } from '../../../src'
import { wrapInTheme } from '../../_theme'

function renderFileDropField(props) {
    const rendered = render(wrapInTheme(<FileDropField {...props} />))

    return {
        ...rendered,
        element: rendered.container.firstChild,
        inputBase: rendered.container.querySelector('.MuiInputBase-root'),
        input: rendered.getByRole('grid'),
    }
}

describe('FileDropField', () => {
    it('Highlight field for drag&drop', async () => {
        const { inputBase, input } = renderFileDropField()
        const files = [new File(['foo'], 'foo.txt', { type: 'text/plain' })]
        const dataTransfer = {
            items: files,
            types: files.map(() => 'Files'),
        }

        await act(async () => {
            await fireEvent.dragEnter(input, { dataTransfer })
        })

        expect(inputBase).toHaveAttribute('class', expect.stringContaining('targetActive'))

        fireEvent.dragLeave(input, { dataTransfer })

        expect(inputBase.getAttribute('class')).not.toContain('targetActive')
    })
})
