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

        updateRef(refHandler, 'foo')

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
            return <div><p ref={props.contentRef} key={Math.random()}></p></div>
        }

        const TestComponent = (props) => {
            const forkedRef = useForkedRef(props.a, props.b)

            props.setRef(forkedRef)

            return <TestChild contentRef={forkedRef}/>
        }

        let i = 0
        let ref0
        const component = Renderer.create(
            <TestComponent a={refA} b={refB} setRef={r => {ref0 = r}}/>,
            {
                createNodeMock: (element) => {
                    if (element.type === 'p') {
                        return 'baz' + (i++)
                    }
                }
            }
        )

        expect(refA.current).toEqual('baz0')
        expect(b).toEqual('baz0')
        expect(typeof(ref0)).toBe('function')

        let ref1
        component.update(<TestComponent a={refA} b={refB} setRef={r => {ref1 = r}}/>)

        expect(refA.current).toEqual('baz1')
        expect(b).toEqual('baz1')
        expect(typeof(ref0)).toBe('function')
        expect(ref1).toBe(ref0)

        let ref2
        let c = 'bar'
        component.update(<TestComponent a={refA} b={v => {c = v}} setRef={r => {ref2 = r}}/>)

        expect(refA.current).toEqual('baz2')
        expect(c).toEqual('baz2')
        expect(typeof(ref2)).toBe('function')
        expect(ref2).not.toBe(ref1)
    })
})

describe('Id ref', () => {
    const TestComponent = ({id}) => {
        const idRef = useId(id)

        return idRef
    }

    it('Use id hook with value', () => {
        const component = Renderer.create(<TestComponent id="foo"/>)

        expect(component.toJSON()).toBe('foo')
    })

    it('Use id hook without value', () => {
        const component = Renderer.create(<TestComponent/>)

        const id = component.toJSON()
        expect(typeof(id)).toBe('string')
        expect(id).toHaveLength(8)

        component.update(<TestComponent/>)

        expect(component.toJSON()).toBe(id)
    })
})
