/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

export type BrushType = "cell" | "unit" | "belonging";

export class Brush {
    private static _onBrush: BrushType = "cell";

    static get onBrush(): BrushType {
        return this._onBrush;
    }

    static set onBrush(v: BrushType) {
        this._onBrush = v;
    }

    private static _onCellId = 0;

    static get onCellId(): number {
        return this._onCellId;
    }

    static set onCellId(v: number) {
        this._onCellId = v;
    }

    private static _onUnitId = "";

    static get onUnitId(): string {
        return this._onUnitId;
    }

    static set onUnitId(v: string) {
        this._onUnitId = v;
    }

    private static _onBelonging = 0;

    static get onBelonging(): number {
        return this._onBelonging;
    }

    static set onBelonging(v: number) {
        this._onBelonging = v;
    }

    private static _brushSize = 1;

    static get brushSize(): number {
        return this._brushSize;
    }

    static set brushSize(v: number) {
        this._brushSize = Math.max(1, Math.min(7, Math.round(v)));
    }

    private static _lockMove = false;

    static get lockMove(): boolean {
        return this._lockMove;
    }

    static set lockMove(v: boolean) {
        this._lockMove = v;
    }
}
