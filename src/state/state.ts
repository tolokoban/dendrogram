import AtomicState from "@tolokoban/react-state"
import type { Morphology } from "@/webgl-neuron-selector/types"

export const State = {
    morphology: new AtomicState<Morphology | null>(null),
}
