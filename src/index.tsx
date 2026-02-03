import { Theme } from "@tolokoban/ui";
import { createRoot } from "react-dom/client";

import App from "./app";

import "./index.css";
import { tgdLoadText } from "@tolokoban/tgd";
import { assertType$ } from "@tolokoban/type-guards";
import { State } from "./state";
import type { Morphology } from "./webgl-neuron-selector/types";

async function start() {
    State.morphology.value = await loadMorphology();
    Theme.apply();
    const container = document.getElementById("app") as HTMLElement;
    const root = createRoot(container);
    root.render(<App />);
    removeSplashScreen();
}

function removeSplashScreen() {
    const SPLASH_VANISHING_DELAY = 900;
    const splash = document.getElementById("splash");
    if (!splash) return;

    splash.classList.add("vanish");
    window.setTimeout(() => {
        const parent = splash.parentNode;
        if (!parent) return;

        parent.removeChild(splash);
    }, SPLASH_VANISHING_DELAY);
}

async function loadMorphology() {
    const text = await tgdLoadText("assets/morpho-01.json");
    if (!text) throw new Error("Morphology file is empty!");

    const data: unknown = JSON.parse(text);
    assertType$<Morphology>(data, ["map", {
        index: "number",
        name: "string",
        nseg: "number",
        distance_from_soma: "number",
        sec_length: "number",
        xstart: ["array", "number"],
        xend: ["array", "number"],
        xcenter: ["array", "number"],
        xdirection: ["array", "number"],
        ystart: ["array", "number"],
        yend: ["array", "number"],
        ycenter: ["array", "number"],
        ydirection: ["array", "number"],
        zstart: ["array", "number"],
        zend: ["array", "number"],
        zcenter: ["array", "number"],
        zdirection: ["array", "number"],
        segx: ["array", "number"],
        diam: ["array", "number"],
        length: ["array", "number"],
        distance: ["array", "number"],
        neuron_segments_offset: ["array", "number"],
        neuron_section_id: "number",
        segment_distance_from_soma: ["array", "number"],
    }]);
    console.log("🐞 [index@65] data =", data); // @FIXME: Remove this line written on 2026-02-03 at 13:36
    return data;
}

void start();
