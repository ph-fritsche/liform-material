import userEvent from '@testing-library/user-event'
import { testLifield } from './_field'

describe('DateInterval', () => {
    it('Render and change DateInterval', () => {
        const { result, getLiformValue } = testLifield({
            schema: {
                type: 'string',
                widget: 'dateinterval',
                title: 'foo',
            },
        })

        userEvent.click(result.getByLabelText('foo'))

        userEvent.type(result.getByLabelText('Years'), '12')

        userEvent.type(result.getByLabelText('Days'), '34')

        userEvent.type(result.getByLabelText('Minutes'), '56')

        userEvent.click(result.container.ownerDocument.body)

        expect(getLiformValue()).toEqual("P12Y34DT56M")
    })
})
