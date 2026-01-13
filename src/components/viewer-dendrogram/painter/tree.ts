/* eslint-disable no-param-reassign */

import type {
    Morphology,
    NeuronSectionInfo,
} from "@/services/bluenaas-single-cell/types"
import type { Tree, TreeItem } from "./types"

export function createTreeStructure(
    morphology: Morphology,
    isoLength: boolean
): Tree {
    const children: TreeItem[] = []
    const items = new Map<string, TreeItem[]>()
    let radiusMin = Number.MAX_VALUE
    let radiusMax = 0
    for (const sectionName of Object.keys(morphology)) {
        const section = morphology[sectionName]
        const i = section.nseg - 1
        const keyItem = `${section.xend[i]}/${section.yend[i]}/${section.zend[i]}`
        const keyParent = `${section.xstart[0]}/${section.ystart[0]}/${section.zstart[0]}`
        const radius = computeAverage(section.diam)
        radiusMin = Math.min(radius, radiusMin)
        radiusMax = Math.max(radius, radiusMax)
        const item: TreeItem = {
            section,
            weight: 0,
            radius,
            x: 0,
            y: 0,
            length: computeSectionLength(section),
            children: [],
        }
        items.set(keyItem, item.children)
        const parent = items.get(keyParent) ?? children
        parent.push(item)
    }
    if (children.length === 0) return { children, levelsCount: 0, grid: [] }

    console.log("🐞 [tree@40] radiusMin, radiusMax =", radiusMin, radiusMax) // @FIXME: Remove this line written on 2026-01-13 at 12:46
    let childrenWithLength = children
    if (isoLength) setSameLengthForEveryChild(childrenWithLength)
    else childrenWithLength = simulateIsoLength(childrenWithLength)
    computeWeights(childrenWithLength)
    const levelsCount = countLevels(childrenWithLength)
    const levelHeight = 1 / levelsCount
    computeCoords(childrenWithLength, levelHeight, radiusMin, radiusMax)
    return {
        children: childrenWithLength,
        levelsCount,
        grid: createGrid(childrenWithLength),
    }
}

function computeWeights(children: TreeItem[]): number {
    let totalWeight = 1
    for (const child of children) {
        const weight = computeWeights(child.children)
        child.weight = weight
        totalWeight += weight
    }
    return totalWeight
}

function countLevels(children: TreeItem[], level = 0): number {
    let maxLevel = level
    for (const item of children) {
        maxLevel = Math.max(maxLevel, countLevels(item.children, level + 1))
    }
    return maxLevel
}

function computeCoords(
    children: TreeItem[],
    levelHeight: number,
    radiusMin: number,
    radiusMax: number,
    level = 0,
    xMin = 0,
    xMax = 1
) {
    const fx = (x: number) => xMin + (xMax - xMin) * x
    const totalWeight = children.reduce(
        (weight, item) => weight + item.weight,
        0
    )
    let x = 0
    const inverseRadiusSpan = 1 / (radiusMax / radiusMin)
    for (const item of children) {
        const w = item.weight / totalWeight
        item.x = fx(x + w / 2)
        item.y = levelHeight * level
        item.radius = (item.radius - radiusMin) * inverseRadiusSpan
        computeCoords(
            item.children,
            levelHeight,
            radiusMin,
            radiusMax,
            level + 1,
            fx(x),
            fx(x + w)
        )
        x += w
    }
}

function createGrid(children: TreeItem[]): TreeItem[][] {
    const grid: TreeItem[][] = []
    recursivelyCreateGrid(grid, children, 0)
    while (grid[grid.length - 1]?.length === 0) grid.pop()
    return grid
}

function recursivelyCreateGrid(
    grid: TreeItem[][],
    children: TreeItem[],
    level: number
) {
    while (grid.length <= level) grid.push([])
    for (const item of children) {
        grid[level].push(item)
        recursivelyCreateGrid(grid, item.children, level + 1)
    }
}

/**
 * If we don't care about neurites length, but only on the branching,
 * then we can assume that all neurites have a length of 1.
 */
function setSameLengthForEveryChild(children: TreeItem[]) {
    const fringe = children.slice()
    while (fringe.length > 0) {
        const item = fringe.pop()
        if (!item) continue

        item.length = 1
        fringe.push(...item.children)
    }
    return children
}

function computeSectionLength(section: NeuronSectionInfo): number {
    let length = 0
    for (let i = 0; i < section.nseg; i++) {
        const y = section.yend[i] - section.ystart[i]
        length = Math.abs(y)
    }
    return length
}

/**
 * The algorithm can only deal with children of the same length.
 * So this function will add fake unique children to feign this constraint.
 * For example, if you have three children [A, B, C] of respective lengths 1, 1.2 and 1.5,
 * Then B will become a line of length 1 with an unique child of length 0.2.
 * And C will become a line of length 1 with an unique child of length 0.2
 * with an unique child of length 0.3 (1 + 0.2 + 0.3 = 1.5).
 * @param childrenWithLength
 */
function simulateIsoLength(childrenWithLength: TreeItem[]): TreeItem[] {
    const children: TreeItem[] = []
    printTree(childrenWithLength)
    recursiveSimulateIsoLength(childrenWithLength, children)
    console.log("=".repeat(40))
    printTree(children)
    return children
}

function recursiveSimulateIsoLength(
    childrenWithLength: TreeItem[],
    children: TreeItem[]
) {
    const steps = computeSteps(childrenWithLength)
    for (const item of childrenWithLength) {
        let root: TreeItem | null = null
        let tail: TreeItem | null = null
        let lastStep = 0
        for (const step of steps) {
            if (item.length < step) break

            const length = step - lastStep
            lastStep = step
            const child: TreeItem = {
                ...item,
                length,
                children: [],
            }
            if (!root) {
                root = tail = child
            } else {
                tail?.children.push(child)
                tail = child
            }
        }
        if (root) children.push(root)
        if (tail) recursiveSimulateIsoLength(item.children, tail.children)
    }
}

function computeSteps(tree: TreeItem[]): number[] {
    const steps: number[] = []
    const children = tree.slice().sort((a, b) => a.length - b.length)
    let lastStep = -1
    for (const { length } of children) {
        if (length !== lastStep) {
            lastStep = length
            steps.push(length)
        }
    }
    return steps
}

function printTree(tree: TreeItem[], indent = 0) {
    for (const item of tree) {
        console.log(
            `${"| ".repeat(indent)}${item.section.name} (${item.length})`
        )
        printTree(item.children, indent + 1)
    }
}

function computeAverage(values: number[]): number {
    if (values.length === 0) return 0

    return values.reduce((prev, curr) => prev + curr, 0) / values.length
}
