export const indexOfChild = (parent, child) => {
    if (!parent || !parent.children) {
        return undefined
    }
    for (var i in parent.children) {
        if (parent.children[i] === child) {
            return Number(i)
        }
    }
}

export function indicesOfDescendant (ancestor, descendant) {
    let indices = []
    while (descendant.parentElement) {
        indices.unshift(Array.prototype.indexOf.call(descendant.parentElement.children, descendant))
        if (descendant.parentElement === ancestor) {
            return indices
        }
        descendant = descendant.parentElement
    }
}
