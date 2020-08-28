import '@testing-library/jest-dom'
import './_dom'
import './_form'

Object.defineProperties(URL, {
    createObjectURL: {
        value: () => {
            return 'blob:https://127.0.0.1/' + [
                Math.random().toString(16).substr(2,8),
                Math.random().toString(16).substr(2,4),
                Math.random().toString(16).substr(2,4),
                Math.random().toString(16).substr(2,4),
                Math.random().toString(16).substr(2,12),
            ].join('-')
        },
    },
    revokeObjectURL: {
        value: () => {},
    }
})
