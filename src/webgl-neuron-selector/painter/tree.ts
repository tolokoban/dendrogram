import type { ArrayNumber3 } from "@tolokoban/tgd"
import type { StructureItem } from "./structure"

export function builTree(items: StructureItem[]): StructureItem {
    const map = new Map<string, StructureItem>()
    for (const item of items) map.set(key3D(item.end), item)
    for (const item of items) {
        if (item.parent) continue

        const parent = map.get(key3D(item.start))
        if (!parent) continue

        parent.children.push(item)
        item.parent = parent
    }
    // Roots: items without parents.
    const [root, ...orphans] = items.filter((item) => !item.parent)
    for (const item of orphans) {
        root.children.push(item)
        item.parent = root
    }
    populateTree(root)
    return root
}

export function debugTree(item: StructureItem, depth = 0) {
    try {
        console.debug(`${"| ".repeat(depth)}${item.name}`)
        for (const child of item.children) debugTree(child, depth + 1)
    } catch (ex) {
        console.error(ex)
        console.error(item)
    }
}

function key3D([x, y, z]: ArrayNumber3) {
    const PRECISION = 3
    return `${x.toFixed(PRECISION)}/${y.toFixed(PRECISION)}/${z.toFixed(PRECISION)}`
}

function populateTree(item: StructureItem, distance = 0) {
    if (!item) return

    item.distanceFromSoma = distance
    const newDistance = distance + item.length
    item.leavesCount = item.children.length > 0 ? 0 : 1
    item.maxLength = 0
    for (const child of item.children) {
        populateTree(child, newDistance)
        item.leavesCount += child.leavesCount
        item.maxLength = Math.max(item.maxLength, child.maxLength)
    }
    item.maxLength += item.length
}
