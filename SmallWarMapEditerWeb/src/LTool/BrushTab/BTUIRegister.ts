/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import type {BrushType} from "../../MapEditor/Brush";
import {Brush} from "../../MapEditor/Brush";

export class BTUIRegister {
    private readonly _div: HTMLElement;

    constructor(divId: string) {
        this._div = document.getElementById(divId)!;
    }

    buildAllSwitchButton(handlers: Record<BrushType, () => void>): void {
        this._buildSwitchButton("地块刷子", handlers.cell, "cell");
        this._buildSwitchButton("单位刷子", handlers.unit, "unit");
        this._buildSwitchButton("归属刷子", handlers.belonging, "belonging");
    }

    private _buildSwitchButton(text: string, handler: () => void, brushType: BrushType): void {
        const s = document.createElement("span");
        s.textContent = text;

        const b = document.createElement("button");
        b.addEventListener("click", () => {
            Brush.onBrush = brushType;
            handler();
        });

        b.append(s);
        this._div.append(b);
    }
}
