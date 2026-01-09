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
                    I({ name: "dend.1a" }),
                    I({ name: "dend.1b" }),
                    I({
                        name: "dend.2",
                        children: [
                            I({
                                name: "dend.2.1",
                            }),
                            I({
                                name: "dend.2.2",
                                children: [
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
                            I({ name: "dend.2.3" }),
                            I({ name: "dend.2.4" }),
                        ],
                    }),
                    I({ name: "dend.1c" }),
                ],
            }),
        ],
        morphology
    )
    console.log('🐞 [morphology@91] morphology =', morphology) // @FIXME: Remove this line written on 2026-01-08 at 14:48
    return morphology
}

function convertTreeToMorphology(
    tree: TreeItem[],
    morphology: Morphology,
) {
    setTreeCoords(tree)
    console.log('🐞 [morphology@101] tree =', tree) // @FIXME: Remove this line written on 2026-01-08 at 14:54
    generateMorphology(morphology, tree)
    return morphology
}

function setTreeCoords(tree: TreeItem[], rank = 0, y = 0): number {
    for (const item of tree) {
        const childY = y + 1 + Math.random()*Math.random()*10
        rank += setTreeCoords(item.children, rank, childY)
        item.x = rank++
        item.y = y
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
