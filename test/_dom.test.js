import './_dom'

describe('Expect extension toHaveFocusedDescendant', () => {
    it('Pass for active element and its parents', () => {
        document.querySelector('body').innerHTML = `
            <div tabIndex='0' id='el0'>
                <div tabIndex='0' id='el1'/>
            </div>
            <div tabIndex='0' id='el2'/>
        `

        document.querySelector('#el1').focus()

        expect(() => expect(document.querySelector('#el1')).toHaveFocusedDescendant()).not.toThrowError()
        expect(() => expect(document.querySelector('#el0')).toHaveFocusedDescendant()).not.toThrowError()

        expect(() => expect(document.querySelector('#el2')).toHaveFocusedDescendant()).toThrowError()
    })
})
