import { useMemo } from 'react'

export const forkCallback = (...func) => {
    return (...args) => {
        for(const f of func) {
            if (typeof(f) === 'function') {
                f(...args)
            }
        }
    }
}

export const useForkedCallback = (func, newFunc, deps = []) => {
    if (!Array.isArray(func)) {
        func = [func]
    }
    return useMemo(() => forkCallback(...func, newFunc), func.concat(newFunc, ...deps))
}

export const useBoundFunction = (func, ...args) => {
    return useMemo(() => func.bind(undefined, ...args), args)
}
