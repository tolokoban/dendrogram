import React from "react";
import { State } from "@/state";
import { WebglNeuronSelector } from "@/webgl-neuron-selector";
import type { ElectrodeRecording } from "@/webgl-neuron-selector/types";
import styles from "./Viewer.module.css";

export interface ViewerProps {
    className?: string;
}

export default function Viewer({ className }: ViewerProps) {
    const morphology = State.morphology.useValue();
    const morphologies = morphology ? [morphology] : [];
    const [recordings, setRecordings] = React.useState<ElectrodeRecording[]>(
        [],
    );

    return (
        <div className={join(className, styles.viewer)}>
            <WebglNeuronSelector
                morphologies={morphologies}
                recordings={recordings}
                onRecordingsChange={setRecordings}
            />
        </div>
    );
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ");
}
