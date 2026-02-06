import {
    TgdAnimation,
    tgdCalcMix,
    TgdContext,
    TgdEvent,
    TgdPainterLogic,
} from "@tolokoban/tgd"
import { OffscreenPainter } from "./offscreen-painter"
import { Painter } from "./painters"
import { ViewMode } from "../types"

/**
 * Manage the transition between views.
 */
export class TransitionManager {
    public readonly eventResetCamera = new TgdEvent()

    public painter: Painter | null = null

    public offscreen: OffscreenPainter | null = null

    private readonly logic: TgdPainterLogic

    private _context: TgdContext | null = null

    private _mode: ViewMode = "3d"

    private mix = 0

    private ongoingAnimations: TgdAnimation[] = []

    constructor(public readonly duration = 2) {
        this.logic = new TgdPainterLogic(this.actualPaint)
    }

    get context() {
        return this._context
    }

    set context(context: TgdContext | null) {
        if (this._context === context) return

        this._context = context
        if (context) {
            context.removeAll()
            context.add(this.logic)
            context.play()
        }
    }

    get mode() {
        return this._mode
    }

    set mode(newMode: ViewMode) {
        const oldMode = this._mode
        if (oldMode === newMode) return

        this.scheduleAnim(newMode)
    }

    paint() {
        this.context?.paint()
    }

    delete() {
        this.painter?.delete()
        this.painter = null
        if (this.context) {
            this.context.delete()
            this.context = null
        }
        if (this.offscreen) {
            this.offscreen.delete()
            this.offscreen = null
        }
    }

    private readonly actualPaint = (time: number, delta: number) => {
        const { painter } = this
        if (painter) {
            painter.mix = this.mix
            painter.paint(time, delta)
        }
    }

    private readonly scheduleAnim = (newMode: ViewMode) => {
        const { context, painter, offscreen } = this
        if (!context || !painter || !offscreen) return

        this._mode = newMode
        this.eventResetCamera.dispatch()
        if (newMode === "dendrogram") {
            context.animCancelArray(this.ongoingAnimations)
            const mixStart = this.mix
            const mixEnd = 1
            this.ongoingAnimations = context.animSchedule({
                duration: this.duration * Math.abs(mixEnd - mixStart),
                action: (alpha) => {
                    this.mix = tgdCalcMix(mixStart, mixEnd, alpha)
                },
            })
        } else if (newMode === "3d") {
            context.animCancelArray(this.ongoingAnimations)
            const mixStart = this.mix
            const mixEnd = 0
            this.ongoingAnimations = context.animSchedule({
                duration: this.duration * Math.abs(mixEnd - mixStart),
                action: (alpha) => {
                    this.mix = tgdCalcMix(mixStart, mixEnd, alpha)
                },
            })
        }
    }
}
