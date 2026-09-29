/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./MapEditor.css";

import {CellItem, Vector2, setHexMap, getHexMap} from "../MapSave";
import {Brush} from "./Brush";
import {URLS} from "../URLConfig";
import {CELL_IMG_W, CELL_IMG_H, UNIT_IMG_SIZE, BEL_IMG_SIZE} from "../Config";

const svgNs = "http://www.w3.org/2000/svg";

let _hexMapDiv: HTMLElement;
let _mapSizeInfoCallback: ((x: number, y: number) => void) | null = null;

export function setMapSizeInfoCallback(cb: (x: number, y: number) => void): void {
    _mapSizeInfoCallback = cb;
}

export function buildHexMap(q: number, r: number, w: number, h: number): void {
    _hexMapDiv = document.getElementById("map_editor_hex_map_div")!;
    _hexMapDiv.innerHTML = "";

    const wHalf = w / 2;
    const hHalf = h / 2;
    const mapH = h * r + hHalf;
    const mapW = w * q * (3 / 4) + w / 4;

    const hexMap: CellItem[][] = [];
    for (let _r = 0; _r < r; _r++) {
        hexMap[_r] = [];
        for (let _q = 0; _q < q; _q++) {
            hexMap[_r][_q] = new CellItem(new Vector2(_q, _r));
        }
    }
    setHexMap(hexMap);

    const offsets = _getCellFlatToppedOffsets(w, h);

    const svg = document.createElementNS(svgNs, "svg");
    svg.style.display = "block";

    for (let _q = 0; _q < q; _q++) {
        for (let _r = 0; _r < r; _r++) {
            let cx = _q * w * (3 / 4);
            let cy = _r * h;
            if (_q % 2 === 1) {
                cy += hHalf;
            }
            cy = mapH - cy;
            cx += wHalf;
            cy -= hHalf;
            const points = _qrToSvgPoints(cx, cy, offsets);

            const cell = document.createElementNS(svgNs, "polygon");
            const imgCell = document.createElementNS(svgNs, "image");
            const imgUnit = document.createElementNS(svgNs, "image");
            const imgBel = document.createElementNS(svgNs, "image");

            cell.dataset.x = _q.toString();
            cell.dataset.y = _r.toString();
            imgCell.dataset.x = _q.toString();
            imgCell.dataset.y = _r.toString();
            imgUnit.dataset.x = _q.toString();
            imgUnit.dataset.y = _r.toString();
            imgBel.dataset.x = _q.toString();
            imgBel.dataset.y = _r.toString();

            cell.setAttribute("points", points);
            cell.setAttribute("class", "map_editor_six_cell");

            imgCell.setAttribute("width", CELL_IMG_W.toString());
            imgCell.setAttribute("height", CELL_IMG_H.toString());
            imgUnit.setAttribute("width", UNIT_IMG_SIZE.toString());
            imgUnit.setAttribute("height", UNIT_IMG_SIZE.toString());
            imgBel.setAttribute("width", BEL_IMG_SIZE.toString());
            imgBel.setAttribute("height", BEL_IMG_SIZE.toString());

            imgCell.setAttribute("x", (cx - CELL_IMG_W / 2).toString());
            imgCell.setAttribute("y", (cy - CELL_IMG_H / 2 - 8).toString());
            imgUnit.setAttribute("x", (cx - UNIT_IMG_SIZE / 2).toString());
            imgUnit.setAttribute("y", (cy - UNIT_IMG_SIZE / 2).toString());
            imgBel.setAttribute("x", (cx + 2).toString());
            imgBel.setAttribute("y", (cy + 8).toString());

            setCellImage(0, imgCell);

            svg.append(cell);
            svg.append(imgCell);
            svg.append(imgUnit);
            svg.append(imgBel);

            const rF = () => {
                console.log("点击了", _q, _r);
                switch (Brush.onBrush) {
                    case "cell":
                        setCellImage(Brush.onCellId, imgCell);
                        break;
                    case "unit":
                        setUnitImage(Brush.onUnitId, imgUnit);
                        break;
                    case "belonging":
                        setBelongingImage(Brush.onBelonging, imgBel);
                        break;
                }
            };
            cell.addEventListener("click", rF);
            imgCell.addEventListener("click", rF);
            imgUnit.addEventListener("click", rF);
            imgBel.addEventListener("click", rF);
        }
    }

    svg.setAttribute("width", mapW.toString());
    svg.setAttribute("height", mapH.toString());
    svg.setAttribute("viewBox", `0 0 ${mapW} ${mapH}`);

    const mSvg = document.createElementNS(svgNs, "svg");
    mSvg.setAttribute("width", "100%");
    mSvg.setAttribute("height", "100%");
    mSvg.setAttribute("viewBox", `0 0 ${mapW} ${mapH}`);

    setMapSvg(mapW, mapH, mSvg);
    mSvg.append(svg);
    _hexMapDiv.append(mSvg);

    if (_mapSizeInfoCallback) {
        _mapSizeInfoCallback(q, r);
    }
}

function _getCellFlatToppedOffsets(w: number, h: number): number[][] {
    const wHalf = w / 2;
    const wQuarter = w / 4;
    const hHalf = h / 2;
    return [
        [wHalf, 0],
        [wQuarter, hHalf],
        [-wQuarter, hHalf],
        [-wHalf, 0],
        [-wQuarter, -hHalf],
        [wQuarter, -hHalf]
    ];
}

function _qrToSvgPoints(cx: number, cy: number, offsets: number[][]): string {
    return offsets
        .map(([dx, dy]) => `${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)}`)
        .join(" ");
}

function setMapSvg(mapW: number, mapH: number, mSvg: SVGSVGElement): void {
    const MIN_SCALE = 1;
    const MAX_SCALE = 2;
    const DRAG_THRESHOLD = 20;

    const state = {
        vbX: 0,
        vbY: 0,
        vbW: mapW,
        vbH: mapH
    };

    function applyViewBox() {
        mSvg.setAttribute("viewBox", `${state.vbX} ${state.vbY} ${state.vbW} ${state.vbH}`);
    }

    function clampState() {
        state.vbW = Math.min(mapW / MIN_SCALE, Math.max(mapW / MAX_SCALE, state.vbW));
        state.vbH = state.vbW * (mapH / mapW);
        const maxX = Math.max(0, mapW - state.vbW);
        const maxY = Math.max(0, mapH - state.vbH);
        state.vbX = Math.min(maxX, Math.max(0, state.vbX));
        state.vbY = Math.min(maxY, Math.max(0, state.vbY));
    }

    function getViewMetrics() {
        const rect = mSvg.getBoundingClientRect();
        const s = Math.min(rect.width / state.vbW, rect.height / state.vbH);
        const drawnW = state.vbW * s;
        const drawnH = state.vbH * s;
        const offX = (rect.width - drawnW) / 2;
        const offY = (rect.height - drawnH) / 2;
        return {rect, drawnW, drawnH, offX, offY};
    }

    mSvg.addEventListener("wheel", (e) => {
        e.preventDefault();
        const {rect, drawnW, drawnH, offX, offY} = getViewMetrics();
        const px = (e.clientX - rect.left - offX) / drawnW;
        const py = (e.clientY - rect.top - offY) / drawnH;
        const factor = e.deltaY < 0 ? 0.9 : 1.1;
        const oldW = state.vbW;
        const oldH = state.vbH;
        let newW = oldW * factor;
        let newH = oldH * factor;
        newW = Math.min(mapW / MIN_SCALE, Math.max(mapW / MAX_SCALE, newW));
        newH = newW * (mapH / mapW);
        state.vbX += (oldW - newW) * px;
        state.vbY += (oldH - newH) * py;
        state.vbW = newW;
        state.vbH = newH;
        clampState();
        applyViewBox();
    }, {passive: false});

    let dragInfo: {
        startX: number;
        startY: number;
        active: boolean;
        id: number;
        lastX?: number;
        lastY?: number
    } | null = null;

    mSvg.addEventListener("pointerdown", (e) => {
        dragInfo = {startX: e.clientX, startY: e.clientY, active: false, id: e.pointerId};
    });

    mSvg.addEventListener("pointermove", (e) => {
        if (!dragInfo || e.pointerId !== dragInfo.id) return;

        if (!dragInfo.active) {
            const dist = Math.hypot(e.clientX - dragInfo.startX, e.clientY - dragInfo.startY);
            if (dist < DRAG_THRESHOLD) return;
            dragInfo.active = true;
            try {
                mSvg.setPointerCapture(e.pointerId);
            } catch (_) {
            }
            dragInfo.lastX = e.clientX;
            dragInfo.lastY = e.clientY;
            return;
        }

        const {drawnW, drawnH} = getViewMetrics();
        const scaleX = state.vbW / drawnW;
        const scaleY = state.vbH / drawnH;
        state.vbX -= (e.clientX - (dragInfo.lastX ?? e.clientX)) * scaleX;
        state.vbY -= (e.clientY - (dragInfo.lastY ?? e.clientY)) * scaleY;
        dragInfo.lastX = e.clientX;
        dragInfo.lastY = e.clientY;
        clampState();
        applyViewBox();
    });

    mSvg.addEventListener("pointerup", (e) => {
        if (dragInfo && e.pointerId === dragInfo.id && dragInfo.active) {
            try {
                mSvg.releasePointerCapture(e.pointerId);
            } catch (_) {
            }
        }
        dragInfo = null;
    });

    mSvg.addEventListener("pointercancel", () => {
        dragInfo = null;
    });
}

export function setCellImage(cellId: number, cell: SVGImageElement): void {
    cell.setAttribute("href", URLS.image.cell(cellId));

    if (!("x" in cell.dataset)) return;
    if (!("y" in cell.dataset)) return;

    const hexMap = getHexMap();
    hexMap[Number(cell.dataset.y)][Number(cell.dataset.x)].cell_id = cellId;
}

export function setUnitImage(unitId: string, unitImg: SVGImageElement): void {
    if (unitId === "") {
        unitImg.removeAttribute("href");
    } else {
        unitImg.setAttribute("href", URLS.image.unit(unitId));
    }

    if (!("x" in unitImg.dataset)) return;
    if (!("y" in unitImg.dataset)) return;

    const hexMap = getHexMap();
    hexMap[Number(unitImg.dataset.y)][Number(unitImg.dataset.x)].unit_id = unitId;
}

export function setBelongingImage(bel: number, belImg: SVGImageElement): void {
    if (bel === 0) {
        belImg.removeAttribute("href");
    } else {
        belImg.setAttribute("href", URLS.image.belonging(bel));
    }

    if (!("x" in belImg.dataset)) return;
    if (!("y" in belImg.dataset)) return;

    const hexMap = getHexMap();
    hexMap[Number(belImg.dataset.y)][Number(belImg.dataset.x)].unit_belonging = bel;
}
