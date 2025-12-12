import { Morphology } from "@/services/bluenaas-single-cell/types"

export const morphology: Morphology = makeMorphology()

interface TreeItem {
    name: string
    x: number
    y: number
    children: TreeItem[]
}

function I(item: Partial<TreeItem>): TreeItem {
    return {
        name: "soma",
        x: 0,
        y: 0,
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
                        children: [
                            I({ name: "dend.1.1" }),
                            I({ name: "dend.1.2" }),
                        ],
                    }),
                    I({
                        name: "dend.2",
                        children: [
                            I({ name: "dend.2.1" }),
                            I({ name: "dend.2.2" }),
                            I({ name: "dend.2.3" }),
                        ],
                    }),
                ],
            }),
        ],
        morphology
    )
    return morphology
}

function convertTreeToMorphology(
    tree: TreeItem[],
    morphology: Morphology,
    level = 0
) {
    setTreeCoords(tree)
    generateMorphology(morphology, tree)
    return morphology
}

function setTreeCoords(tree: TreeItem[], rank = 0, level = 0): number {
    for (const item of tree) {
        rank += setTreeCoords(item.children, level + 1)
        item.x = rank++
        item.y = level
    }
    return rank
}

function generateMorphology(
    morphology: Morphology,
    tree: TreeItem[],
    parent: TreeItem = { name: "", children: [], x: 0, y: 0 },
    id = 0
) {
    for (const item of tree) {
        const name = `${item.name}/${id++}`
        morphology[name] = {
            name,
            nseg: 1,
            xstart: [parent.x],
            ystart: [parent.y],
            zstart: [0],
            xend: [item.x],
            yend: [item.y],
            zend: [0],
        }
        id = generateMorphology(morphology, item.children, item, id)
    }
    return id
}
