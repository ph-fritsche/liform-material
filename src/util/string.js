export function isEscaped (haystack, position, escapeChar = '\\') {
    let i
    for (i = position - 1; i > 0 && haystack.charAt(i) === escapeChar; i--) { true }
    return (position - i - 1) % 2 > 0
}

export function indexOfUnescaped (haystack, needle, offset = 0, end = undefined) {
    const i = haystack.indexOf(needle, offset)
    if (i < 0 || end !== undefined && i >= end) {
        return undefined
    } else if (!isEscaped(haystack, i)) {
        return i
    }
    return indexOfUnescaped(haystack, needle, i + 1, end)
}

export function hasUnescaped (haystack, needle, offset = 0, end = undefined) {
    return indexOfUnescaped(haystack, needle, offset, end) !== undefined
}

export function countUnescaped (haystack, needle, start = 0, end = undefined) {
    let count = 0
    for (let i = start; i < (end ?? haystack.length); count++, i++) {
        i = indexOfUnescaped(haystack, needle, i)
        if (i === undefined) {
            break
        }
    }
    return count
}