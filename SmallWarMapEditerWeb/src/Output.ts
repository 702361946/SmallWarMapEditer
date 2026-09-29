/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./Output.css";

import {
    getHexMap,
    Vector2,
    TileData,
    EasyUnitData,
    EasyPlayerData,
    MapData,
} from "./MapSave";
import type {PlayerData, CellItem} from "./MapSave";
import {URLS} from "./URLConfig";

export class Output {
    private readonly _buttonDiv: HTMLElement;

    constructor(buttonDivId: string) {
        this._buttonDiv = document.getElementById(buttonDivId)!;
    }

    buildAllButton(): void {
        this._buildButton("导出为gmap", () => this._output("gmap"));
        this._buildButton("导出为json", () => this._output("json"));
    }

    async _output(_type = "gmap"): Promise<void> {
        const playerDataList = (window as any)._playerDataList as PlayerData[];
        if (!playerDataList) {
            console.error("playerDataList not found");
            return;
        }

        const oPlayerData: EasyPlayerData[] = [];
        const oPlayerSelectablePlayers: number[] = [];
        for (const i of playerDataList) {
            if (i.isActive) {
                oPlayerSelectablePlayers.push(i.playerNumber);
            }
            oPlayerData.push(this._playerFunc(i));
        }
        if (oPlayerSelectablePlayers.length < 2) {
            oPlayerSelectablePlayers.push(1, 2);
        }

        const oMapEditorCellData: TileData[] = [];
        const oMapEditorUnitData: EasyUnitData[] = [];
        const hexMap = getHexMap();
        const w = hexMap.length;
        if (w === 0) return;
        const h = hexMap[0].length;
        if (h === 0) return;

        for (const i of hexMap) {
            for (const _i of i) {
                oMapEditorCellData.push(this._cellFunc(_i));
                const _u = this._unitFunc(_i);
                if (_u !== null) {
                    oMapEditorUnitData.push(_u);
                }
            }
        }

        const _mapData = new MapData({
            width: w,
            height: h,
            name: "WebMapEditorOutputMap",
            playerDatas: oPlayerData,
            tileDataList: oMapEditorCellData,
            selectablePlayers: oPlayerSelectablePlayers,
            unitData: oMapEditorUnitData
        });

        let _json = JSON.stringify(_mapData.toServerJson());

        try {
            const response = await fetch(URLS.output.json, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: _json
            });

            if (!response.ok) return;
            const respJson = await response.json();
            _json = JSON.stringify(respJson["data"]);
        } catch (e) {
            console.log(e);
        }

        const blob = new Blob([_json], {type: "application/json"});
        this._download(blob, _type);
    }

    private _buildButton(text: string, rFunc: () => void): void {
        const b = document.createElement("button");
        b.addEventListener("click", rFunc);
        b.classList.add("output_button_button");
        const s = document.createElement("span");
        s.textContent = text;
        s.classList.add("output_button_span");
        b.append(s);
        this._buttonDiv.append(b);
    }

    private _download(blob: Blob, _type = "gmap"): void {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `map.${_type}`;
        a.click();
        URL.revokeObjectURL(url);
    }

    private _playerFunc(playerData: PlayerData): EasyPlayerData {
        if (!playerData.isActive) {
            playerData.reset();
        }
        return new EasyPlayerData({
            playerNumber: playerData.playerNumber,
            team: playerData.team,
            techPoint: playerData.techPoint,
            camp: playerData.camp,
            unitPlayerNumber: playerData.unitPlayerNumber,
            landUnits: playerData.landUnits,
            skyUnits: playerData.skyUnits,
            shipUnits: playerData.shipUnits,
            lockTechs: playerData.lockTechs,
            lockUnits: playerData.lockUnits,
            lockUpgrade: playerData.lockUpgrade,
            type: playerData.type,
            color: playerData.color
        });
    }

    private _cellFunc(cellData: CellItem): TileData {
        return new TileData({
            type: cellData.cell_id,
            pos: cellData.pos,
            burning: cellData.burning,
            burningTime: cellData.burning_time
        });
    }

    private _unitFunc(cellData: CellItem): EasyUnitData | null {
        if (cellData.unit_id === "") return null;
        return new EasyUnitData({
            pos: cellData.pos,
            PlayerNumber: cellData.unit_belonging,
            unitName: cellData.unit_id
        });
    }
}
