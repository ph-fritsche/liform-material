import { indexOfChild, indicesOfDescendant } from '../../src/util/dom'

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

describe('Get indices of descendant', () => {
    const container = document.createElement('div')
    container.innerHTML = `
        <div id='a'>
            <div id='a-0'></div>
            <div id='a-1'>
                <div id='a-1-0'></div>
                <div id='a-1-1'></div>
            </div>
        </div>
    `

    it('Return indices', () => {
        expect(indicesOfDescendant(container, container.querySelector('#a-1-1'))).toEqual([0, 1, 1])
        expect(indicesOfDescendant(container.querySelector('#a-1'), container.querySelector('#a-1-1'))).toEqual([1])
    })

    it('Return undefined if element is not a descendant', () => {
        expect(indicesOfDescendant(container.querySelector('#a-0'), container.querySelector('#a-1-1'))).toEqual(undefined)
    })
})
