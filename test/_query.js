import { buildQueries, queryAllByLabelText, queryAllByText } from '@testing-library/react'

export const [queryByL, getAllByL, getbyL, findAllByL, findByL] = buildQueries(
    (container, text, options) => {
        const input = queryAllByLabelText(container, text, options)
        const legend = queryAllByText(container, text, {...options, selector: 'legend'})
        const fieldset = legend.map(e => e.closest('fieldset')).filter(e => e !== null)

        return input.concat(fieldset)
    },
    (container, text) => `Found multiple elements for label/legend "${text}"`,
    (container, text) => `Unable to find an input for label or fieldset for legend "${text}"`,
)
