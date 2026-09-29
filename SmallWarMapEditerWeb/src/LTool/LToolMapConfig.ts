/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./LToolMapConfig.css";

import {MAP_DEFAULT_XY, MAP_MIN_XY, MAP_MAX_XY, CELL_SIZE} from "../Config";
import {buildHexMap, setMapSizeInfoCallback} from "../MapEditor/MapEditor";

export class LToolMapConfig {
    private readonly _xySpan: HTMLSpanElement;
    private readonly _buttonDiv: HTMLElement;
    private _setMapXY: [number, number] = [...MAP_DEFAULT_XY];

    constructor(xySpanId: string, buttonDivId: string) {
        this._xySpan = document.getElementById(xySpanId)! as HTMLSpanElement;
        this._buttonDiv = document.getElementById(buttonDivId)!;
        setMapSizeInfoCallback((x, y) => this._updateXYInfo(x, y));
    }

    buildAllButton(): void {
        this._buildResetButton();
        this._buildSetButton();
    }

    private _updateXYInfo(x: number, y: number): void {
        this._xySpan.textContent = `x: ${x}&y: ${y}`;
    }

    private _buildSetButton(): void {
        const d = document.createElement("div");
        d.classList.add("map_config_button_set_div");

        const iD = document.createElement("div");
        iD.classList.add("map_config_button_set_input_div");

        const iX = this._createInput(this._setMapXY[0].toString(), "x:");
        const iY = this._createInput(this._setMapXY[1].toString(), "y:");

        iD.append(iX.container, iY.container);

        const b = document.createElement("button");
        b.classList.add("map_config_button_set_button");
        b.addEventListener("click", () => this._onSetClick(iX.input, iY.input));

        const s = document.createElement("span");
        s.textContent = "设置为输入值";
        b.append(s);

        d.append(b, iD);
        this._buttonDiv.append(d);
    }

    private _createInput(defaultValue: string, spanText: string): {
        container: HTMLDivElement;
        input: HTMLInputElement
    } {
        const d = document.createElement("div");
        d.classList.add("map_config_button_set_input_input_div");

        const i = document.createElement("input");
        i.defaultValue = defaultValue;
        i.classList.add("map_config_button_set_input_input");

        const s = document.createElement("span");
        s.textContent = spanText;

        d.append(s, i);
        return {container: d, input: i};
    }

    private _onSetClick(iX: HTMLInputElement, iY: HTMLInputElement): void {
        let _x = Number(iX.value);
        let _y = Number(iY.value);

        if (_x > MAP_MAX_XY || _y > MAP_MAX_XY) {
            console.log("x or y > " + MAP_MAX_XY);
            return;
        }
        if (_x < MAP_MIN_XY || _y < MAP_MIN_XY) {
            console.log("x or y < " + MAP_MIN_XY);
            return;
        }

        this._setMapXY = [_x, _y];
        buildHexMap(this._setMapXY[0], this._setMapXY[1], CELL_SIZE, CELL_SIZE);
    }

    private _buildResetButton(): void {
        const b = document.createElement("button");
        b.addEventListener("click", () => buildHexMap(this._setMapXY[0], this._setMapXY[1], CELL_SIZE, CELL_SIZE));

        const s = document.createElement("span");
        s.textContent = "重置地图";
        b.append(s);
        this._buttonDiv.append(b);
    }
}
