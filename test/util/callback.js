import React, { useEffect } from 'react'
import Renderer from 'react-test-renderer'
import { forkCallback, useForkedCallback } from '../../src/util/callback'

describe('Fork callbacks', () => {
    it('Fork callbacks', () => {
        let a
        let b
        const funcA = v => { a = v }
        const funcB = v => { b = v }

        const forked = forkCallback(funcA, undefined, () => {}, funcB)

        forked('foo')

        expect(a).toEqual('foo')
        expect(b).toEqual('foo')
    })

    it('Use fork callbacks hook', () => {
        let a
        let b
        let c
        const funcA = v => { a = v }
        const funcB = v => { b = v }

        const TestComponent = (props) => {
            const forkedOne = useForkedCallback(props.callback, v => { c = v })
            const forkedTwo = useForkedCallback([props.some, props.callback, props.otherCallback], v => { c = v })

            props.valueOne && forkedOne(props.valueOne)
            props.valueTwo && forkedTwo(props.valueTwo)

            return <div></div>
        }

        Renderer.create(
            <TestComponent callback={funcA} valueOne='foo'/>
        )

        expect(a).toEqual('foo')
        expect(c).toEqual('foo')

        Renderer.create(
            <TestComponent callback={funcA} otherCallback={funcB} valueTwo='bar'/>
        )

        expect(a).toEqual('bar')
        expect(b).toEqual('bar')
        expect(c).toEqual('bar')
    })
})
