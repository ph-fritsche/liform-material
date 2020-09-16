import React from 'react'
import { render } from '@testing-library/react'
import { PickerModal } from '../../../src/Component/Picker/PickerModal'

function mockMatchMedia(options) {
    window.matchMedia = jest.fn((query) => {
        return {
            matches: false,
            media: query,
            addListener: () => { },
            removeListener: () => { },
            ...(typeof (options[query]) === 'boolean' ? { matches: options[query] } : options[query]),
        }
    })
    return window.matchMedia
}

function renderModal({
    PickerComponent = () => null,
    open = true,
    ...others
} = {}) {
    const rendered = render(<PickerModal PickerComponent={PickerComponent} open={open} {...others} />)
    const element = rendered.getByRole('presentation')

    return {
        ...rendered,
        element,
    }
}

describe('PickerModal', () => {
    afterEach(() => {
        window.matchMedia = undefined
    })

    it('Render Popover for desktop', () => {
        const { container: { firstChild: anchorEl } } = render(<div></div>)
        const mediaMock = mockMatchMedia({ '(pointer: fine)': true })
        const { element } = renderModal({ anchorEl })

        expect(mediaMock).toBeCalledWith('(pointer: fine)')
        expect(element).toHaveClass('MuiPopover-root')
    })

    it('Render dialog for mobile', () => {
        const mediaMock = mockMatchMedia({ '(pointer: fine)': false })
        const { element } = renderModal()

        expect(mediaMock).toBeCalledWith('(pointer: fine)')
        expect(element).toHaveClass('MuiDialog-root')
    })
})
