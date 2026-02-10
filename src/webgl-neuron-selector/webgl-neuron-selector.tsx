/* eslint-disable no-param-reassign */

import { FullscreenOutlined } from "@ant-design/icons";
import { tgdFullscreenToggle } from "@tolokoban/tgd";
import React from "react";
import AddRecordingDialog from "./components/add-recording-dialog";
import { ButtonResetCamera } from "./components/button-reset-camera";
import { HintPanel } from "./components/hint";
import LegendOverlay from "./components/legend-overlay";
import ModeSelector from "./components/ModeSelector";
import ZoomSlider from "./components/zoom-slider";
import {
    type PainterManager,
    usePainterController,
    useWebglNeuronSelector,
} from "./painter";
import type { WebglNeuronSelectorProps } from "./types";
import styles from "./webgl-neuron-selector.module.css";

// eslint-disable-next-line react/display-name
export function WebglNeuronSelector(props: WebglNeuronSelectorProps) {
    const painterManager = useWebglNeuronSelector(props);
    const extraProps = { ...props, painterManager };
    usePainterController(extraProps);
    const ref = React.useRef<HTMLDivElement | null>(null);
    const handleFullscreen = () => {
        void tgdFullscreenToggle(ref.current);
    };

    return (
        <div className={styles.main} ref={ref}>
            <Canvas painterManager={painterManager} />
            <HintPanel painterManager={painterManager} />
            <header>
                <ModeSelector painterManager={painterManager} />
                <div className={styles.flex}>
                    <ZoomSlider
                        className={styles.zoomSlider}
                        painterManager={painterManager}
                    />
                    <ButtonResetCamera painterManager={painterManager} />
                </div>
                <div className={styles.flex}>
                    <button type="button" onClick={handleFullscreen}>
                        <FullscreenOutlined />
                    </button>
                </div>
            </header>
            <LegendOverlay {...extraProps} />
            <AddRecordingDialog {...extraProps} />
        </div>
    );
}

const Canvas = React.memo(
    ({ painterManager }: { painterManager: PainterManager }) => {
        return (
            <canvas
                key="canvas"
                ref={(canvas: HTMLCanvasElement | null) => {
                    painterManager.canvas = canvas;
                    return () => {
                        painterManager.canvas = null;
                    };
                }}
            />
        );
    },
);
