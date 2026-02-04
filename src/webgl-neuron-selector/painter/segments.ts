import {
    type ArrayNumber2,
    ArrayNumber3,
    TgdPainterSegmentsData,
} from "@tolokoban/tgd"

import { type Structure, StructureItem, StructureItemType } from "./structure"

export function makeSegments3D(structure: Structure) {
    const segments = new TgdPainterSegmentsData()
    structure.forEach((item) => {
        const uv: ArrayNumber2 = [
            (item.type + 0.5) / (StructureItemType.Unknown + 1),
            (item.index + 1.5) / (structure.length + 2),
        ]
        segments.add(
            [...item.start, item.radius],
            [...item.end, item.radius],
            uv,
            uv
        )
    })
    return segments
}

export function makeSegmentsDendrogram(structure: Structure) {
    const width = Math.abs(structure.bbox.max[0] - structure.bbox.min[0])
    console.log("🐞 [segments@28] structure =", structure) // @FIXME: Remove this line written on 2026-02-04 at 15:43
    console.log("🐞 [segments@29] width =", width) // @FIXME: Remove this line written on 2026-02-04 at 15:43
    const segments = new TgdPainterSegmentsData()
    structure.forEach((item) => {
        const uv: ArrayNumber2 = [
            (item.type + 0.5) / (StructureItemType.Unknown + 1),
            (item.index + 1.5) / (structure.length + 2),
        ]
        const start = computeDendrogramStart(item, width)
        const end = computeDendrogramEnd(item, width)
        const segment = segments.add(
            [...start, item.radius],
            [...end, item.radius],
            uv,
            uv
        )
        if (item.type === StructureItemType.Liaison) {
            console.log("🐞 [segments@40] segment, item =", segment, item) // @FIXME: Remove this line written on 2026-02-04 at 16:16
        }
    })
    return segments
}

function computeDendrogramStart(
    item: StructureItem,
    width: number
): ArrayNumber3 {
    if (item.type === StructureItemType.Liaison) {
        return computeDendrogramEnd(item.parent ?? item, width)
    }
    const x = item.rank * width
    const y = item.distanceFromSoma
    const z = 0
    return [x, y, z]
}

function computeDendrogramEnd(
    item: StructureItem,
    width: number
): ArrayNumber3 {
    if (item.type === StructureItemType.Liaison) {
        const [child] = item.children
        return computeDendrogramStart(child ?? item, width)
    }
    const x = item.rank * width
    const y = item.distanceFromSoma + item.length
    const z = 0
    return [x, y, z]
}
