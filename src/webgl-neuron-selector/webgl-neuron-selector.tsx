/* eslint-disable no-param-reassign */
import React from "react";
import AddRecordingDialog from "./add-recording-dialog";
import { ButtonResetCamera } from "./button-reset-camera";
import { HintPanel } from "./hint";
import LegendOverlay from "./legend-overlay";
import { usePainterController, useWebglNeuronSelector } from "./painter";
import styles from "./webgl-neuron-selector.module.css";
import ZoomSlider from "./zoom-slider";
import {
    WebglNeuronSelectorContentProps,
    WebglNeuronSelectorProps,
} from "./types";

// eslint-disable-next-line react/display-name
export const WebglNeuronSelector = React.memo(
    (props: WebglNeuronSelectorProps) => {
        const painterManager = useWebglNeuronSelector(props.morphology);
        const extraProps: WebglNeuronSelectorContentProps = {
            ...props,
            painterManager,
        };
        return <WebglNeuronSelectorContent {...extraProps} />;
    },
);

function WebglNeuronSelectorContent(props: WebglNeuronSelectorContentProps) {
    const { painterManager } = props;
    usePainterController(props);

    return (
        <div className={styles.main}>
            <canvas
                key="canvas"
                ref={(canvas: HTMLCanvasElement | null) => {
                    painterManager.canvas = canvas;
                    return () => {
                        painterManager.canvas = null;
                    };
                }}
            />
            <HintPanel painterManager={painterManager} />
            <header>
                <ZoomSlider
                    className={styles.zoomSlider}
                    painterManager={painterManager}
                />
                <ButtonResetCamera painterManager={painterManager} />
            </header>
            <LegendOverlay {...props} />
            <AddRecordingDialog {...props} />
        </div>
    );
}
