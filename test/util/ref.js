import React from 'react'
import Renderer from 'react-test-renderer'
import { updateRef, forkRef, useForkedRef, useId } from '../../src/util/ref'

describe('Fork refs', () => {

    it('Update React ref', () => {
        const ref = React.createRef()

        updateRef(ref, 'foo')

        expect(ref.current).toEqual('foo')
    })

    it('Update ref handler', () => {
        const ref = React.createRef()
        const refHandler = (newValue) => { ref.current = newValue }

        updateRef(ref, 'foo')

        expect(ref.current).toEqual('foo')
    })

    it('Ignore other types', () => {
        const ref = 'foo'

        updateRef(ref, 'bar')

        expect(ref).toEqual('foo')
    })

    it('Fork refs', () => {
        const refA = React.createRef()
        refA.current = 'foo'
        let b = 'bar'
        const refB = v => { b = v }

        const forkedRef = forkRef(refA, refB)

        forkedRef('baz')

        expect(refA.current).toEqual('baz')
        expect(b).toEqual('baz')
    })

    it('Use forked refs hook', () => {
        const refA = React.createRef()
        refA.current = 'foo'
        let b = 'bar'
        const refB = v => { b = v }

        const TestChild = (props) => {
            return <div><p ref={props.contentRef}>{props.content}</p></div>
        }

        const TestComponent = (props) => {
            const forkedRef = useForkedRef(props.a, props.b)

            return <TestChild contentRef={forkedRef} content={props.content}/>
        }

        const component = Renderer.create(
            <TestComponent a={refA} b={refB} content='foo'/>,
            {
                createNodeMock: (element) => {
                    if (element.type === 'p') {
                        return 'baz'
                    }
                }
            }
        )

        expect(refA.current).toEqual('baz')
        expect(b).toEqual('baz')
    })
})

describe("Id ref", () => {
    const TestComponent = ({id}) => {
        const idRef = useId(id)

        return idRef
    }

    it('Use id hook with value', () => {
        const component = Renderer.create(<TestComponent id='foo'/>)

        expect(component.toJSON()).toBe('foo')
    })

    it('Use if hook without value', () => {
        const component = Renderer.create(<TestComponent/>)

        const id = component.toJSON()
        expect(typeof(id)).toBe('string')
        expect(id).toHaveLength(8)

        component.update(<TestComponent/>)

        expect(component.toJSON()).toBe(id)
    })
})
