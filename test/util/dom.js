import { indexOfChild } from '../../src/util/dom'

describe('Get index of child', () => {
    it('Find child', () => {
        const parent = document.createElement('div')
        const childA = document.createElement('span')
        const childB = document.createElement('span')
        const childC = document.createElement('span')
    
        parent.append(childA, childB, childC)
    
        expect(indexOfChild(parent, childB)).toEqual(1)
    })

    it('Return undefined, if parent has no children', () => {
        expect(indexOfChild({}, 'foo')).toEqual(undefined)
        expect(indexOfChild(undefined, 'foo')).toEqual(undefined)
    })

    it('Return undefined, if child is not one of children', () => {
        const parent = document.createElement('div')

        expect(indexOfChild(parent, 'foo')).toEqual(undefined)
    })
})
