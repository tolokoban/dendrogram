import React from "react";
import { State } from "@/state";
import { usePainterManager } from "@/webgl-neuron-selector/painter";
import styles from "./Viewer.module.css";

export interface ViewerProps {
    className?: string;
}

export default function Viewer({ className }: ViewerProps) {
    const morphology = State.morphology.useValue();
    const manager = usePainterManager(morphology);
    const mountCanvas = (canvas: HTMLCanvasElement | null) => {
        manager.canvas = canvas;
        return () => {
            manager.canvas = null;
        };
    };

    return (
        <div className={join(className, styles.viewer)}>
            <canvas ref={mountCanvas}></canvas>
        </div>
    );
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ");
}
