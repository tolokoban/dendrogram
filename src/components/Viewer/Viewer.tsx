import { TgdEvent } from "@tolokoban/tgd";
import React from "react";
import { State } from "@/state";
import { useEventValue } from "@/util/utils";
import {
    type PainterManager,
    usePainterManager,
} from "@/webgl-neuron-selector/painter";
import styles from "./Viewer.module.css";

export interface ViewerProps {
    className?: string;
}

export default function Viewer({ className }: ViewerProps) {
    const morphology = State.morphology.useValue();
    const manager = usePainterManager(morphology);
    const selection = useEventValue(
        {
            x: 0,
            y: 0,
            item: null,
            offset: 0,
        },
        manager.eventHover,
    );
    const { item } = selection;

    return (
        <div className={join(className, styles.viewer)}>
            <aside>
                <h1>Morphology</h1>
                {item && (
                    <div className={styles.grid}>
                        <div>Name:</div>
                        <b>{item.name}</b>
                        <div>Section:</div>
                        <b>{item.sectionName}</b>
                        <div>Segment:</div>
                        <b>{item.segmentIndex}</b>
                        <div>Leaves:</div>
                        <b>{item.leavesCount}</b>
                        <div>Max length:</div>
                        <b>{item.maxLength}</b>
                        <div>Children:</div>
                        <b>{item.children.length}</b>
                        <div>Radius:</div>
                        <b>{item.radius}</b>
                    </div>
                )}
            </aside>
            <Canvas manager={manager} />
        </div>
    );
}

const Canvas = React.memo(CanvasContent);

function CanvasContent({ manager }: { manager: PainterManager }) {
    const mountCanvas = (canvas: HTMLCanvasElement | null) => {
        manager.canvas = canvas;
        return () => {
            manager.canvas = null;
        };
    };

    return <canvas ref={mountCanvas}></canvas>;
}

function join(...classes: unknown[]): string {
    return classes.filter((cls) => typeof cls === "string").join(" ");
}
