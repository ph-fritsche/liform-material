// See : https://github.com/testing-library/react-testing-library/issues/268
export class FakeMouseEvent extends MouseEvent {
    constructor(
        type,
        {
            bubbles = true,
            cancelable = true,
            composed = true,
            pageX = 0,
            pageY = 0,
            offsetX = 0,
            offsetY = 0,
            x = 0,
            y = 0,
            ...others
        },
    ) {
        super(type, {
            bubbles,
            cancelable,
            composed,
            ...others,
        })

        Object.assign(this, {
            offsetX,
            offsetY,
            pageX,
            pageY,
            x,
            y,
        })
    }
}
