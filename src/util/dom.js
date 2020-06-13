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
