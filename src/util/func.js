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
    /* eslint-disable react-hooks/exhaustive-deps */
    return useMemo(() => forkCallback(...func, newFunc), func.concat(deps))
}

export const useBoundFunction = (func, ...args) => {
    /* eslint-disable react-hooks/exhaustive-deps */
    return useMemo(() => func.bind(undefined, ...args), args)
}
