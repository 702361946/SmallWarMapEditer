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
    private _buttons: Map<BrushType, HTMLButtonElement> = new Map();

    constructor(divId: string) {
        this._div = document.getElementById(divId)!;
    }

    buildAllSwitchButton(handlers: Record<BrushType, () => void>): void {
        const types: BrushType[] = ["cell", "unit", "belonging"];
        const labels = ["地块刷子", "单位刷子", "归属刷子"];
        types.forEach((type, index) => {
            this._buildSwitchButton(labels[index], handlers[type], type);
        });
        // 默认选中第一个
        this._updateActive("cell");
    }

    private _buildSwitchButton(text: string, handler: () => void, brushType: BrushType): void {
        const s = document.createElement("span");
        s.textContent = text;

        const b = document.createElement("button");
        b.classList.add("brush_options_switch_button");
        b.addEventListener("click", () => {
            Brush.onBrush = brushType;
            this._updateActive(brushType);
            handler();
        });

        b.append(s);
        this._div.append(b);
        this._buttons.set(brushType, b);
    }

    private _updateActive(activeType: BrushType): void {
        for (const [type, btn] of this._buttons) {
            if (type === activeType) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        }
    }
}
