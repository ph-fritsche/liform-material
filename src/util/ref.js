import { useMemo, useRef } from 'react'

export const updateRef = (ref, node) => {
    if (typeof(ref) === 'function') {
        ref(node)
    } else if (ref && typeof(ref) === 'object') {
        ref.current = node
    }
}

export const forkRef = (...ref) => {
    return (node) => {
        for(const r of ref) {
            updateRef(r, node)
        }
    }
}

export const useForkedRef = (...ref) => {
    /* eslint-disable react-hooks/exhaustive-deps */
    return useMemo(() => forkRef(...ref), ref)
}

export const useId = (value) => {
    const random = useRef(Math.random().toString(36).substring(2,10)).current

    return value !== undefined ? value : random
}
