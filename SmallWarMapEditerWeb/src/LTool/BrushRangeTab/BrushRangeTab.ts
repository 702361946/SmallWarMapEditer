/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./BrushRangeTab.css";
import {Brush} from "../../MapEditor/Brush";

export class BrushRangeTab {
    private readonly _container: HTMLElement;

    constructor(containerId: string) {
        this._container = document.getElementById(containerId)!;
        this._buildUI();
    }

    private _buildUI(): void {
        const row = document.createElement("div");
        row.className = "brush_range_row";

        const label = document.createElement("span");
        label.className = "brush_range_label";
        label.textContent = "笔刷范围大小";

        const sliderWrap = document.createElement("div");
        sliderWrap.className = "brush_range_slider_wrap";

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = "1";
        slider.max = "7";
        slider.step = "1";
        slider.value = Brush.brushSize.toString();
        slider.className = "brush_range_slider";

        const valueDisplay = document.createElement("span");
        valueDisplay.className = "brush_range_value";
        valueDisplay.textContent = slider.value;

        slider.addEventListener("input", () => {
            const v = Number(slider.value);
            Brush.brushSize = v;
            valueDisplay.textContent = Brush.brushSize.toString();
        });

        sliderWrap.append(slider, valueDisplay);

        const lockBtn = document.createElement("button");
        lockBtn.className = "brush_range_lock_btn";
        lockBtn.title = "锁定移动: 拖拽改为笔刷绘制";
        this._updateLockBtnStyle(lockBtn);

        lockBtn.addEventListener("click", () => {
            Brush.lockMove = !Brush.lockMove;
            this._updateLockBtnStyle(lockBtn);
        });

        row.append(label, sliderWrap, lockBtn);
        this._container.append(row);
    }

    private _updateLockBtnStyle(btn: HTMLButtonElement): void {
        if (Brush.lockMove) {
            btn.textContent = "🔒";
            btn.classList.add("active");
        } else {
            btn.textContent = "🔓";
            btn.classList.remove("active");
        }
    }
}
