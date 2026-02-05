import {
    type TgdContext,
    TgdDataset,
    TgdLight,
    TgdMaterialDiffuse,
    TgdPainterClear,
    TgdPainterGroup,
    TgdPainterSegments,
    TgdPainterSegmentsData,
    TgdPainterState,
    TgdTexture2D,
    TgdVec3,
    tgdCanvasCreatePalette,
    webglPresetDepth,
} from "@tolokoban/tgd"

import { type StructureItem } from "../structure"
import { PALETTE } from "./contants"
import { PainterHover as PainterHighlight } from "./highlight"
import { PainterSynapses } from "./synapses"

export class Painter extends TgdPainterGroup {
    private readonly groupSegments = new TgdPainterGroup()

    private readonly groupSynapses = new TgdPainterGroup()

    private readonly groupHover = new TgdPainterGroup()

    private readonly palette: TgdTexture2D

    private _painterSegments: TgdPainterSegments | null = null

    private _synapses: Array<{ color: string; data: Float32Array }> | null =
        null

    constructor(private readonly context: TgdContext) {
        super()
        this.palette = new TgdTexture2D(context)
            .loadBitmap(tgdCanvasCreatePalette(PALETTE))
            .setParams({
                magFilter: "NEAREST",
                minFilter: "NEAREST",
            })
        this.add(
            new TgdPainterClear(context, { color: [0, 0, 0, 1], depth: 1 }),
            new TgdPainterState(context, {
                depth: webglPresetDepth.less,
                children: [
                    this.groupSegments,
                    this.groupSynapses,
                    this.groupHover,
                ],
            })
        )
    }

    get painterSegments() {
        return this._painterSegments
    }

    get synapsesEnabled() {
        return this.groupSynapses.active
    }

    set synapsesEnabled(value: boolean) {
        this.groupSynapses.active = value
        this.context.paint()
    }

    get synapses() {
        return this._synapses
    }

    set synapses(
        synapses: Array<{ color: string; data: Float32Array }> | null
    ) {
        this._synapses = synapses
        const { context, groupSynapses } = this
        groupSynapses.delete()
        if (synapses && synapses.length > 0) {
            groupSynapses.add(new PainterSynapses(context, synapses))
        }
        this.context.paint()
    }

    set dataset(dataset: TgdDataset) {
        const { context } = this
        this.groupSegments.delete()
        const painterSegments = new TgdPainterSegments(context, {
            roundness: 6,
            minRadius: 0.5,
            dataset,
            material: new TgdMaterialDiffuse({
                color: this.palette,
                specularExponent: 1,
                specularIntensity: 0.25,
                lockLightsToCamera: true,
                light: new TgdLight({
                    direction: new TgdVec3(0, 0, -1),
                }),
            }),
        })
        this._painterSegments = painterSegments
        this.groupSegments.add(painterSegments)
        context.paint()
    }

    highlight(segments: TgdPainterSegmentsData | null | undefined) {
        const { groupHover, context } = this
        groupHover.delete()
        if (segments) {
            groupHover.add(new PainterHighlight(context, segments))
        }
        context.paint()
    }

    delete() {
        this.palette.delete()
        this.groupHover.delete()
        this.groupSegments.delete()
        this.groupSynapses.delete()
    }
}
