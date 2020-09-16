import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Picker } from '../../../src/Component/Picker/Picker'

function renderPicker({
    PickerComponent = () => null,
    onToggle = jest.fn(),
    ...others
} = {}) {
    const rendered = render(<Picker PickerComponent={PickerComponent} onToggle={onToggle} {...others} />)

    return {
        ...rendered,
        field: rendered.container.firstChild,
        onToggle,
    }
}

describe('Picker', () => {
    it('Clicking field opens modal', () => {
        const { field, queryAllByRole, onToggle, getByRole } = renderPicker()

        expect(queryAllByRole('presentation')).toHaveLength(0)

        userEvent.click(field)

        expect(onToggle).toBeCalledWith(true)
        expect(getByRole('presentation')).toBeInTheDocument()
    })

    it('Clicking backdrop closes modal', () => {
        const { onToggle, getByRole } = renderPicker({ initialOpen: true })

        const modal = getByRole('presentation')
        const backdrop = modal.querySelector('.MuiBackdrop-root')

        userEvent.click(backdrop)

        expect(onToggle).toBeCalledWith(false)

        // the dialog will be faded out before being removed
        expect(backdrop).toHaveStyle({ opacity: 0 })
    })
})
