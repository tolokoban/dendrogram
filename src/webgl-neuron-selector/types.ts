import { PainterManager } from "./painter"

export interface MorphologySection {
    index: number
    name: string
    nseg: number
    distance_from_soma: number
    sec_length: number
    xstart: number[]
    xend: number[]
    xcenter: number[]
    xdirection: number[]
    ystart: number[]
    yend: number[]
    ycenter: number[]
    ydirection: number[]
    zstart: number[]
    zend: number[]
    zcenter: number[]
    zdirection: number[]
    segx: number[]
    diam: number[]
    length: number[]
    distance: number[]
    neuron_segments_offset: number[]
    neuron_section_id: number
    segment_distance_from_soma: number[]
}

export type Morphology = Record<string, MorphologySection>

export interface ElectrodeRecording {
    section: string
    offset: number
    record_currents: boolean
    origin: "injection" | "recording"
    color?: string | undefined
}

export interface ElectrodeInjection {
    inject_to: string
}

export interface ElectrodesProps {
    recordings?: ElectrodeRecording[]
    onRecordingsChange?(this: void, recordings: ElectrodeRecording[]): void
    injection?: ElectrodeInjection | undefined
    onInjectionChange?(
        this: void,
        injections: ElectrodeInjection | undefined
    ): void
}

export interface WebglNeuronSelectorProps extends ElectrodesProps {
    morphology: Morphology | null
    synapses?: Array<{
        color: string
        data: Float32Array<ArrayBufferLike>
    }>
    disableClick?: boolean
}

export interface WebglNeuronSelectorContentProps extends WebglNeuronSelectorProps {
    painterManager: PainterManager
}
