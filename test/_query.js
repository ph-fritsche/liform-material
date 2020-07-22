import { buildQueries, queryAllByLabelText, queryAllByText } from '@testing-library/react'

export const [queryByL, getAllByL, getbyL, findAllByL, findByL] = buildQueries(
    (container, text, options) => {
        const label = queryAllByLabelText(container, text, options)
        const legend = queryAllByText(container, text, {...options, selector: 'legend'})

        return label || legend.length && legend.map(e => e.closest('fieldset')).filter(e => e !== null)
    },
    (container, text) => `Found multiple elements for label/legend "${text}"`,
    (container, text) => `Unable to find an input for label or fieldset for legend "${text}"`,
)
