import React, { useState } from 'react'
import { render, fireEvent, getByLabelText, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AspectInput } from '../../../src'
import { useForkedCallback } from '../../../src/util/func'

describe('AspectInput', () => {
    function getTestAspects () {
        return [
            {value: '12', label: 'firstAspect'},
            {text: ';'},
            {value: '    b', label: 'secondAspect', placeholder: 'tttt', isNumeric: false},
            {text: '-'},
            {value: '0024', label: 'thirdAspect', placeholder: 'xxxx'},
            {text: '/'},
            {value: '0', label: 'fourthAspect', isNumeric: true},
        ]
    }

    function TestComponent ({callbacks, ...props}) {
        const [testAspects, setAspects] = useState(getTestAspects())

        if(callbacks) {
            callbacks.setAspects = setAspects
        }

        function validateAspects (value, index) {
            if (index === 0) {
                return (value >= 1 && value < 20) ? value : undefined
            } else if (index === 2) {
                return ['a','b','c'].includes(String(value).trim()) ? value : undefined
            } else if (index === 4) {
                return (value >= 1 && value <= 1000) ? value : undefined
            } else if (index === 6) {
                return Number(value)
            }
        }
    
        const commitAspects = useForkedCallback(props.commit, (value, index) => {
            testAspects[index].value = value
            setAspects(testAspects)
        }, [testAspects, setAspects])

        return (
            <AspectInput
                {...props}
                aspects={testAspects}
                validate={validateAspects}
                commit={commitAspects}
            />
        )
    }

    function renderAspects (props) {
        const commit = jest.fn()

        const result = render(
            <div>
                <button data-testid="otherControl"/>
                <label id="someId-label" htmlFor="someId">someLabelText</label>
                <TestComponent
                    {...props}
                    id={'someId'}
                    display="foo"
                    commit={commit}
                />
            </div>
        )

        result.commit = commit

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
        const testAspects = getTestAspects()

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
                expect(getByLabelText(aspectCells[i], a.label)).toHaveTextContent(a.value, {normalizeWhitespace: false})
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

        expect(result.getByLabelText('fourthAspect')).toHaveFocus()

        fireEvent.keyDown(result.getByLabelText('fourthAspect'), {key: 'ArrowRight'})

        expect(result.getByLabelText('fourthAspect')).toHaveFocus()

        fireEvent.keyDown(result.getByLabelText('fourthAspect'), {key: 'ArrowLeft'})

        expect(result.getByLabelText('thirdAspect')).toHaveFocus()
    })

    it('Manipulate aspect value with arrow keys', () => {
        const result = renderAspects()

        userEvent.tab()

        fireEvent.keyDown(result.getByLabelText('firstAspect'), {key: 'ArrowUp'})

        expect(result.getByLabelText('firstAspect')).toHaveTextContent('13')

        fireEvent.blur(result.getByLabelText('firstAspect'), {relatedTarget: result.getByLabelText('secondAspect')})
        fireEvent.focus(result.getByLabelText('secondAspect'))

        expect(result.commit).toHaveBeenNthCalledWith(1, '13', 0)

        fireEvent.keyDown(result.getByLabelText('secondAspect'), {key: 'ArrowUp'})

        expect(result.getByLabelText('secondAspect')).toHaveTextContent('   c', {normalizeWhitespace: false})
        
        fireEvent.blur(result.getByLabelText('secondAspect'), {relatedTarget: result.getByLabelText('thirdAspect')})
        fireEvent.focus(result.getByLabelText('thirdAspect'))

        expect(result.commit).toHaveBeenNthCalledWith(2, '   c', 2)

        fireEvent.keyDown(result.getByLabelText('thirdAspect'), {key: 'ArrowDown'})

        expect(result.getByLabelText('thirdAspect')).toHaveTextContent('0023')
    })

    it('Manipulate aspect per typing', () => {
        const result = renderAspects()
        const selection = result.container.ownerDocument.getSelection()

        userEvent.tab()

        expect(selection.toString()).toBe('12')

        fireEvent.input(result.getByLabelText('firstAspect'), {target: {textContent: '1'}})

        expect(result.getByLabelText('firstAspect')).toHaveTextContent('1')
        expect(result.getByLabelText('firstAspect')).toHaveFocus()
        expect(selection.toString()).toBe('')
        expect(selection.anchorOffset).toBe(1)
        expect(result.commit).not.toBeCalled()

        fireEvent.input(result.getByLabelText('firstAspect'), {target: {textContent: '17'}})
        
        expect(result.getByLabelText('firstAspect')).toHaveTextContent('17')
        expect(result.commit).toHaveBeenNthCalledWith(1, '17', 0)
        expect(result.getByLabelText('secondAspect')).toHaveFocus()

        fireEvent.blur(result.getByLabelText('secondAspect'), {relatedTarget: result.getByLabelText('firstAspect')})
        fireEvent.focus(result.getByLabelText('firstAspect'))

        expect(result.getByLabelText('firstAspect')).toHaveFocus()
        expect(selection.toString()).toBe('17')

        fireEvent.input(result.getByLabelText('firstAspect'), {target: {textContent: '3'}})
        
        expect(result.getByLabelText('firstAspect')).toHaveTextContent('3')
        expect(result.commit).toHaveBeenNthCalledWith(2, '3', 0)
        expect(result.getByLabelText('secondAspect')).toHaveFocus()
    })

    it('Prevent invalid input', () => {
        const result = renderAspects()

        userEvent.tab()

        userEvent.click(result.getByLabelText('secondAspect'))
        fireEvent.input(result.getByLabelText('secondAspect'), {target: {textContent: 'd'}})

        expect(result.getByLabelText('secondAspect')).toHaveTextContent('b')

        fireEvent.keyDown(result.getByLabelText('secondAspect'), {key: 'ArrowUp'})
        expect(result.getByLabelText('secondAspect')).toHaveTextContent('c')
        fireEvent.keyDown(result.getByLabelText('secondAspect'), {key: 'ArrowUp'})

        expect(result.getByLabelText('secondAspect')).toHaveTextContent('c')

        userEvent.click(result.getByLabelText('fourthAspect'))
        fireEvent.input(result.getByLabelText('fourthAspect'), {target: {textContent: 'a'}})

        expect(result.getByLabelText('fourthAspect')).toHaveTextContent('0')
    })

    it('Update active aspect when value changes', () => {
        const callbacks = {}
        const result = renderAspects({callbacks})

        userEvent.tab()

        userEvent.click(result.getByLabelText('secondAspect'))
        expect(result.getByLabelText('secondAspect')).toHaveFocus()
        expect(result.getByLabelText('secondAspect')).toHaveTextContent('b')

        const newAspects = getTestAspects()
        newAspects[2].value = 'c'
        act(() => callbacks.setAspects(newAspects))

        expect(result.getByLabelText('secondAspect')).toHaveFocus()
        expect(result.getByLabelText('secondAspect')).toHaveTextContent('c')
    })

    it('Call onblur prop when component loses focus', () => {
        const onBlur = jest.fn()
        const result = renderAspects({onBlur})

        userEvent.tab()
        expect(result.getByLabelText('firstAspect')).toHaveFocus()

        userEvent.click(result.getByLabelText('secondAspect'))

        expect(onBlur).not.toBeCalled()

        userEvent.click(document.body)

        expect(onBlur).toBeCalled()
    })
})
