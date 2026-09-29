/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./BTUICH.css";

export class BTUICH {
    private static _onGrid: HTMLElement | null = null;

    static clearDiv(container: HTMLElement): void {
        container.innerHTML = "";
    }

    static clearOnGrid(): void {
        if (this._onGrid === null) return;
        this._onGrid.style.background = "";
    }

    static setOnGrid(e: HTMLElement, onColor = "#ffff00"): void {
        this.clearOnGrid();
        this._onGrid = e;
        e.style.background = onColor;
    }

    static getGridButton(
        imgUrl: string,
        spanText = "",
        titleText = "",
        rF: () => void,
        onColor = "#ffff00"
    ): HTMLButtonElement {
        const b = document.createElement("button");
        b.className = "brush_options_table_grid_button";
        b.title = titleText;

        const img = document.createElement("img");
        img.src = imgUrl;
        img.className = "brush_options_table_grid_img";
        img.onerror = () => {
            img.src = "";
            img.alt = "图片加载失败";
        };

        const s = document.createElement("span");
        s.className = "brush_options_table_grid_span";
        s.textContent = spanText;

        b.append(img);
        b.append(s);

        b.addEventListener("click", () => {
            this.clearOnGrid();
            this.setOnGrid(b, onColor);
            rF();
        });

        return b;
    }

    static appendToDiv(container: HTMLElement, e: HTMLElement): void {
        container.append(e);
    }
}
