expect.extend({
    toHaveFocusedDescendant (element) {
        let el = element.ownerDocument.activeElement
        let pass = false
        do {
            if (el === element) {
                pass = true
                break
            }
        } while (el = el.parentElement)

        return {
            pass,
            message: () => {
                const hint = this.utils.matcherHint(`${this.isNot ? '.not' : ''}.toHaveFocusedDescendant`, 'element', '')
                const expected = `Expected\n  ${this.utils.printExpected(element)}`
                const received = `Received\n  ${this.utils.printReceived(element.ownerDocument.activeElement)}`

                return `${hint}\n\n${expected}\n${received}`
            },
        }
    }
})
