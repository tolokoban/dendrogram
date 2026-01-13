import type { Morphology } from "@/services/bluenaas-single-cell/types"

export const morphology: Morphology = makeMorphology()

interface TreeItem {
    name: string
    x: number
    // Tail's Y
    y: number
    length: number
    radius: number
    children: TreeItem[]
}

function I(item: Partial<TreeItem>): TreeItem {
    return {
        name: "soma",
        x: 0,
        y: 1,
        length: 1,
        radius: 1,
        children: [],
        ...item,
    }
}

function makeMorphology(): Morphology {
    const morphology: Morphology = {}
    convertTreeToMorphology(
        [
            I({
                children: [
                    I({
                        name: "dend.1",
                        length: 1.2,
                        children: [
                            I({
                                name: "myel.1.1",
                                children: [
                                    I({ name: "axon" }),
                                    I({ name: "axon" }),
                                ],
                            }),
                            I({
                                name: "myel.1.2",
                                children: [
                                    I({ name: "axon" }),
                                    I({
                                        name: "axon",
                                        children: [
                                            I({ name: "axon" }),
                                            I({ name: "axon" }),
                                        ],
                                    }),
                                    I({ name: "axon" }),
                                ],
                            }),
                        ],
                    }),
                    I({ name: "dend.1a", length: 3.8 }),
                    I({ name: "dend.1b", length: 1.6 }),
                    I({
                        name: "dend.2",
                        children: [
                            I({
                                name: "dend.2.1",
                            }),
                            I({
                                name: "dend.2.2",
                                length: 1.8,
                                children: [
                                    I({
                                        name: "myel.1.2",
                                        children: [
                                            I({ name: "axon" }),
                                            I({
                                                name: "axon",
                                                children: [
                                                    I({
                                                        name: "axon",
                                                        length: 1.1,
                                                    }),
                                                    I({ name: "axon" }),
                                                ],
                                            }),
                                            I({ name: "axon", length: 1.8 }),
                                        ],
                                    }),
                                ],
                            }),
                            I({ name: "dend.2.3", length: 2.3 }),
                            I({ name: "dend.2.4" }),
                        ],
                    }),
                    I({ name: "dend.1c", length: 4.2 }),
                ],
            }),
        ],
        morphology
    )
    return morphology
}

function convertTreeToMorphology(tree: TreeItem[], morphology: Morphology) {
    setTreeCoords({
        name: "ROOT",
        x: 0,
        y: 0,
        length: 0,
        radius: 0,
        children: tree,
    })
    printTree(tree)
    generateMorphology(morphology, tree)
    console.log("🐞 [morphology@109] morphology =", morphology) // @FIXME: Remove this line written on 2026-01-13 at 09:32
    return morphology
}

function setTreeCoords(
    tree: TreeItem,
    rank = 0,
    yParent = 0,
    level = 1
): number {
    for (const item of tree.children) {
        const y = yParent + item.length
        rank += setTreeCoords(item, rank, y, level + 1)
        item.x = rank++
        item.y = y
        item.radius = 1 / (level + Math.random())
    }
    return rank
}

function generateMorphology(
    morphology: Morphology,
    tree: TreeItem[],
    parent: TreeItem = {
        name: "",
        children: [],
        x: 0,
        y: 0,
        length: 1,
        radius: 1,
    },
    id = 0
) {
    for (const item of tree) {
        const name = `${item.name}#${id++}`
        morphology[name] = {
            name,
            nseg: 1,
            xstart: [parent.x],
            ystart: [parent.y],
            zstart: [0],
            xend: [item.x],
            yend: [item.y],
            zend: [0],
            diam: [item.radius],
        }
        id = generateMorphology(morphology, item.children, item, id)
    }
    return id
}

function printTree(tree: TreeItem[], indent = 0) {
    for (const item of tree) {
        console.log(`${"| ".repeat(indent)}${item.name} (${item.length})`)
        printTree(item.children, indent + 1)
    }
}
