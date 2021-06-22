import React from 'react'
import { ColorField } from '../../../src/Component/Color/ColorField'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { wrapInTheme } from '../../_theme'

describe('ColorField', () => {
    it('Field is accessible', () => {
        const rendered = render(wrapInTheme(<ColorField label="foo" />))
        const field = rendered.getByLabelText('foo')

        const colorInput = rendered.container.querySelector('input[type=color]')
        const colorOnClick = jest.fn()
        expect(colorInput).toBeInTheDocument()
        colorInput.addEventListener('click', colorOnClick)

        // this should open the native color picker
        userEvent.click(field)

        expect(colorOnClick).toBeCalled()
    })
})
