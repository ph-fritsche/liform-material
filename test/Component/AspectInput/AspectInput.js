import React from 'react'
import { render, fireEvent, getByLabelText } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AspectInput } from '../../../src'

describe('AspectInput', () => {
    const testAspects = [
        {value: '12', label: 'firstAspect'},
        {text: ';'},
        {value: '    b', label: 'secondAspect', placeholder: 'tttt', isNumeric: false},
        {text: '-'},
        {value: '0024', label: 'thirdAspect', placeholder: 'xxxx'},
    ]

    function validateAspects (value, index) {
        if (index === 1) {
            return (value > 10 && value < 20) ? value : undefined
        } else if (index === 2) {
            return ['a','b','c'].includes(value) ? value : undefined
        } else if (index === 3) {
            return (value >= 0 && value <= 1000) ? value : undefined
        }
    }

    function renderAspects (props) {
        const result = render(
            <div>
                <button data-testid='otherControl'/>
                <label id='someId-label'>someLabelText</label>
                <AspectInput
                    id={'someId'}
                    aspects={testAspects}
                    display="foo"
                    validate={validateAspects}
                    commit={() => {}}
                    {...props}
                />
            </div>
        )

        result.getByTestId('otherControl').focus()

        return result
    }

    it('Render an accessible control with display content', () => {
        const result = renderAspects()

        expect(result.getByLabelText('someLabelText')).not.toHaveFocusedDescendant()
        expect(result.getByLabelText('someLabelText')).toHaveTextContent('foo')
    })

    it('Render display when being focused by pointer', () => {
        const result = renderAspects()

        userEvent.click(result.getByLabelText('someLabelText'))

        expect(result.getByLabelText('someLabelText')).toHaveFocusedDescendant()
        expect(result.getByLabelText('someLabelText')).toHaveTextContent('foo')
    })

    it('Render aspects when being focused by keyboard', () => {
        const result = renderAspects()

        userEvent.tab()

        const field = result.getByLabelText('someLabelText')

        expect(field).toHaveFocusedDescendant()
        expect(field).toHaveAttribute('role', 'grid')
        expect(field.children[0]).toHaveAttribute('role', 'row')

        const aspectCells = field.children[0].children
        expect(aspectCells).toHaveLength(testAspects.length)

        for (let i = 0; i < testAspects.length; i++) {
            const a = testAspects[i]
            if (Object.keys(a).includes('value')) {
                expect(getByLabelText(aspectCells[i], a.label)).toHaveValue(a.value)
            } else {
                expect(aspectCells[i]).toHaveTextContent(a.text)
            }
        }

        expect(result.getByLabelText('firstAspect')).toHaveFocus()
    })

    it('Move aspect focus with arrow keys', () => {
        const result = renderAspects()

        userEvent.tab()

        fireEvent.keyDown(result.getByLabelText('firstAspect'), {key: 'ArrowRight'})

        expect(result.getByLabelText('secondAspect')).toHaveFocus()
        
        fireEvent.keyDown(result.getByLabelText('secondAspect'), {key: 'ArrowRight'})
        
        expect(result.getByLabelText('thirdAspect')).toHaveFocus()
        
        fireEvent.keyDown(result.getByLabelText('thirdAspect'), {key: 'ArrowRight'})

        expect(result.getByLabelText('thirdAspect')).toHaveFocus()

        fireEvent.keyDown(result.getByLabelText('thirdAspect'), {key: 'ArrowLeft'})

        expect(result.getByLabelText('secondAspect')).toHaveFocus()
    })
})
