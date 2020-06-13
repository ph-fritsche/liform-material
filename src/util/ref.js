import { useMemo } from 'react'

export const updateRef = (ref, node) => {
    if (typeof(ref) === 'function') {
        ref(node)
    } else if (ref && typeof(ref) === 'object') {
        ref.current = node
    }
}

export const forkRef = (...ref) => {
    return (node) => {
        for(var r of ref) {
            updateRef(r, node)
        }
    }
}

export const useForkedRef = (...ref) => {
    return useMemo(() => forkRef(...ref), ref)
}
