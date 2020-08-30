import { testLifield } from './_field'
import userEvent from '@testing-library/user-event'

describe('Button', () => {
    it.each([
        ['submit'],
        ['reset']
    ])('Render form control', (type) => {
        const { field, form } = testLifield({
            schema: {
                widget: [type, 'button'],
                title: 'foo',
            },
        })

        const listener = jest.fn(e => e.preventDefault())
        form.addEventListener(type, listener)

        userEvent.click(field)

        expect(listener).toHaveBeenCalled()
    })
})
