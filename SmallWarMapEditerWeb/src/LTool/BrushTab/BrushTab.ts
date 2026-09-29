/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./BrushTab.css";

import {Brush} from "../../MapEditor/Brush";
import {BTUICH} from "./BTUICH";
import {URLS} from "../../URLConfig";

export class BrushTab {
    private readonly _tableDiv: HTMLElement;
    private _allCellId: number[] = [];
    private _allUnitId: string[] = [];

    constructor(tableDivId: string) {
        this._tableDiv = document.getElementById(tableDivId)!;
    }

    clearTable(): void {
        BTUICH.clearDiv(this._tableDiv);
        this._allCellId = [];
        this._allUnitId = [];
    }

    async loadCellList(): Promise<void> {
        this.clearTable();
        try {
            const response = await fetch(URLS.config.cellMapping);
            if (!response.ok) {
                this._showError(`加载失败 (状态码:${response.status})`);
                return;
            }
            const cellMapping = await response.json();
            for (const [cellName, cellData] of Object.entries(cellMapping)) {
                const data = cellData as { id: number };
                this._allCellId.push(data.id);
                const button = this._createCellButton(cellName, data);
                BTUICH.appendToDiv(this._tableDiv, button);
            }
        } catch (error) {
            this._showError(`加载失败,请刷新重试;${error}`);
        }
    }

    async loadUnitList(): Promise<void> {
        this.clearTable();
        try {
            const response = await fetch(URLS.config.unitMapping);
            if (!response.ok) {
                this._showError(`加载失败 (状态码:${response.status})`);
                return;
            }
            const unitMapping = await response.json();

            const clearBtn = this._createUnitButton("clear", {id: ""}, URLS.image.match.clear);
            BTUICH.appendToDiv(this._tableDiv, clearBtn);

            for (const [name, data] of Object.entries(unitMapping)) {
                const uData = data as { id: string };
                this._allUnitId.push(uData.id);
                const button = this._createUnitButton(name, uData);
                BTUICH.appendToDiv(this._tableDiv, button);
            }
        } catch (error) {
            this._showError(`加载失败,请刷新重试;${error}`);
        }
    }

    loadBelongingList(): void {
        this.clearTable();
        const clearBtn = this._createBelongingButton(0, "clear", "clear", URLS.image.match.clear);
        BTUICH.appendToDiv(this._tableDiv, clearBtn);

        for (let i = 1; i <= 8; i++) {
            const b = this._createBelongingButton(i);
            BTUICH.appendToDiv(this._tableDiv, b);
        }
    }

    private _createCellButton(cellName: string, cellData: { id: number }): HTMLButtonElement {
        const title = `${cellName} (ID: ${cellData.id})`;
        const imgUrl = URLS.image.cell(cellData.id);
        return BTUICH.getGridButton(imgUrl, cellName, title, () => {
            console.log("选中地块:", cellName, cellData);
            Brush.onCellId = cellData.id;
        });
    }

    private _createUnitButton(unitName: string, unitData: { id: string }, imgUrl = ""): HTMLButtonElement {
        const title = `${unitName} (ID: ${unitData.id})`;
        if (imgUrl === "") {
            imgUrl = URLS.image.unit(unitData.id);
        }
        return BTUICH.getGridButton(imgUrl, unitName, title, () => {
            console.log("选中单位:", unitName, unitData);
            Brush.onUnitId = unitData.id;
        });
    }

    private _createBelongingButton(
        bel: number,
        titleText = "",
        spanText = "",
        imgUrl = ""
    ): HTMLButtonElement {
        if (titleText === "") titleText = `${bel}`;
        if (imgUrl === "") imgUrl = URLS.image.belonging(bel);
        if (spanText === "") spanText = `玩家${bel}`;

        return BTUICH.getGridButton(imgUrl, spanText, titleText, () => {
            Brush.onBelonging = bel;
        });
    }

    private _showError(msg: string): void {
        const s = document.createElement("span");
        s.textContent = msg;
        BTUICH.appendToDiv(this._tableDiv, s);
    }
}
