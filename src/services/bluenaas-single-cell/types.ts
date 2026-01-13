export type Morphology = Record<string, NeuronSectionInfo>

export interface NeuronSectionInfo {
    name: string
    nseg: number
    xstart: number[]
    ystart: number[]
    zstart: number[]
    xend: number[]
    yend: number[]
    zend: number[]
    diam: number[]
}
