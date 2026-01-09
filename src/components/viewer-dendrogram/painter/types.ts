import { NeuronSectionInfo } from "@/services/bluenaas-single-cell/types"

export interface Tree {
    children: TreeItem[]
    levelsCount: number
    // Store items by level, then rank.
    // This is usefull for fast item finding
    // when hovering.
    grid: TreeItem[][]
}

export interface TreeItem {
    section: NeuronSectionInfo
    x: number
    y: number
    length: number
    weight: number
    children: TreeItem[]
}

