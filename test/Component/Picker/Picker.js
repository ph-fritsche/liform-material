import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Picker } from '../../../src/Component/Picker/Picker'
import { wrapInTheme } from '../../_theme'

function renderPicker({
    PickerComponent = () => null,
    onToggle = jest.fn(),
    ...others
} = {}) {
    const rendered = render(wrapInTheme(<Picker PickerComponent={PickerComponent} onToggle={onToggle} {...others} />))

    return {
        ...rendered,
        field: rendered.container.firstChild,
        onToggle,
    }
}

describe('Picker', () => {
    it('Clicking field opens modal', () => {
        const { field, queryByRole, onToggle, getByRole } = renderPicker()

        expect(queryByRole('dialog')).not.toBeInTheDocument()

        userEvent.click(field)

        expect(onToggle).toBeCalledWith(true)
        expect(getByRole('dialog')).toBeInTheDocument()
    })

    it('Clicking backdrop closes modal', () => {
        const { onToggle, getAllByRole } = renderPicker({ initialOpen: true })

        const modal = getAllByRole('presentation')[0]
        const backdrop = modal.querySelector('.MuiBackdrop-root')

        expect(backdrop).toBeInTheDocument()

        userEvent.click(backdrop)

        expect(onToggle).toBeCalledWith(false)

        // the dialog will be faded out before being removed
        expect(backdrop).toHaveStyle({ opacity: 0 })
    })
})
