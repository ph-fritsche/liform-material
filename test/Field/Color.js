import { testLifield } from './_field'

describe('Color', () => {
    it('Render color input', () => {
        const { field } = testLifield({
            schema: {
                type: 'string',
                widget: 'color',
                title: 'foo',
            },
            value: '#123456',
        })

        expect(field).toHaveAttribute('type', 'color')
    })
})
