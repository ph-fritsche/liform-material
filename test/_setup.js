import '@testing-library/jest-dom'
import 'liform-util/dist/cjs/testing'

Object.defineProperties(URL, {
    createObjectURL: {
        value: () => {
            return 'blob:https://127.0.0.1/' + [
                Math.random().toString(16).substr(2, 8),
                Math.random().toString(16).substr(2, 4),
                Math.random().toString(16).substr(2, 4),
                Math.random().toString(16).substr(2, 4),
                Math.random().toString(16).substr(2, 12),
            ].join('-')
        },
    },
    revokeObjectURL: {
        value: () => {},
    },
})

let error = undefined
const realErrorLog = console.error
console.error = (message, ...args) => {
    if (!error) {
        if (message instanceof Error) {
            error = message
        } else {
            if (typeof message === 'string') {
                for (const a of args) {
                    message = message.replace(/%(s|d|i|o|O)/, a)
                }
                error = new Error(String(message))
            }
        }
    }
    realErrorLog(message, ...args)
}

afterEach(() => {
    if (error) {
        const e = error
        error = undefined
        throw e
    }
})
