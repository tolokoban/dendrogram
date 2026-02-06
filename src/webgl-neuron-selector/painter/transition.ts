import {
    tgdCalcMapRange,
    tgdCalcModulo,
    TgdContext,
    TgdPainterLogic,
} from "@tolokoban/tgd"
import { OffscreenPainter } from "./offscreen-painter"
import { Painter } from "./painters"

export type ViewMode = "3d" | "dendrogram"

/**
 * Manage the transition between views.
 */
export class TransitionManager {
    public painter: Painter | null = null

    public offscreen: OffscreenPainter | null = null

    private readonly logic: TgdPainterLogic

    private _context: TgdContext | null = null

    private _mode: ViewMode = "3d"

    private mix = 0

    constructor() {
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

        this._mode = newMode
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
            // const DURATION = 8
            // const PAUSE = 1
            // const span = tgdCalcModulo(time, 0, DURATION + PAUSE)
            // const angle = tgdCalcMapRange(
            //     span,
            //     0,
            //     DURATION,
            //     0,
            //     2 * Math.PI,
            //     true
            // )
            // const mix = tgdCalcMapRange(Math.cos(angle), -1, +1, 0, 1)
            painter.mix = this.mix
            painter.paint(time, delta)
        }
    }
}
