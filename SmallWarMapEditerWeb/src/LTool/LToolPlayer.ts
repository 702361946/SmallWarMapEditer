/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./LToolPlayer.css";

import {CAMP_NAME_MAP, PLAYER_COLOR_LIST, PLAYER_TEAM_LIST} from "../Config";
import {PlayerData} from "../MapSave";
import {createDropdownButton, showDropdownList} from "./LToolUICH";

export class LToolPlayer {
    private readonly _container: HTMLElement;
    private readonly _playerDataList: PlayerData[];

    constructor(containerId: string) {
        this._container = document.getElementById(containerId)!;
        this._playerDataList = Array.from({length: 9}, (_, index) => new PlayerData(index));
    }

    get playerDataList(): PlayerData[] {
        return this._playerDataList;
    }

    addPlayer(team = 0, color = 0, camp = "US"): void {
        const rows = this._container.querySelectorAll(":scope > div");
        const playerNumber = rows.length;
        if (playerNumber > 8) return;

        const playerData = this._playerDataList[playerNumber];
        playerData.team = team;
        playerData.color = color;
        playerData.camp = camp;
        playerData.isActive = true;

        const div = document.createElement("div");
        div.classList.add("player_config_tab");
        div.dataset.id = playerNumber.toString();

        const sId = document.createElement("span");
        sId.textContent = playerNumber.toString();
        sId.style.width = "20%";

        const teamBlock = this._createTeamBlock(team, playerNumber);
        const colorBlock = this._createColorBlock(color, playerNumber);
        const styleBlock = this._createStyleBlock(camp, playerNumber);

        div.append(sId, teamBlock, colorBlock, styleBlock);
        this._container.append(div);
    }

    removePlayer(): void {
        const rows = this._container.querySelectorAll(":scope > div");
        if (rows.length <= 2) return;
        const playerNumber = rows.length - 1;
        rows[playerNumber].remove();
        this._playerDataList[playerNumber].reset();
    }

    private _syncField(element: HTMLElement, field: keyof PlayerData, value: any): void {
        const row = element.closest(".player_config_tab") as HTMLElement | null;
        if (!row) return;
        const id = Number(row.dataset.id);
        if (Number.isNaN(id)) return;
        const playerData = this._playerDataList[id];
        if (playerData) {
            (playerData as any)[field] = value;
        }
    }

    private _createTeamBlock(team: number, _playerNumber: number): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("player_config_team_div");

        const displaySpan = document.createElement("span");
        displaySpan.classList.add("player_config_team_span");
        this._updateTeamDisplay(displaySpan, team);

        const teamOptionSpans = PLAYER_TEAM_LIST.map(value => {
            const span = document.createElement("span");
            span.textContent = value === null ? "null" : value.toString();
            return span;
        });

        const dropdownBtn = createDropdownButton(() => {
            showDropdownList(
                displaySpan,
                teamOptionSpans,
                (_target, selectedItem) => {
                    const text = selectedItem.textContent || "null";
                    const val = text === "null" ? 0 : Number(text);
                    this._updateTeamDisplay(displaySpan, val);
                    this._syncField(displaySpan, "team", val);
                },
                container
            );
        });

        container.append(displaySpan, dropdownBtn);
        return container;
    }

    private _updateTeamDisplay(span: HTMLSpanElement, team = 0): void {
        const teamValue = PLAYER_TEAM_LIST[team];
        span.textContent = teamValue === null ? "null" : teamValue.toString();
    }

    private _createColorBlock(color: number, _playerNumber: number): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("player_config_color_div");

        const displayBlock = document.createElement("div");
        displayBlock.classList.add("player_config_color_block");
        this._updateColorDisplay(displayBlock, color);

        const colorOptionSpans = PLAYER_COLOR_LIST.map((value, index) => {
            const span = document.createElement("span");
            if (value === null) {
                span.textContent = "随机";
            } else {
                span.style.display = "inline-block";
                span.style.width = "16px";
                span.style.height = "16px";
                span.style.background = value;
                span.style.borderRadius = "50%";
            }
            span.dataset.colorIndex = index.toString();
            return span;
        });

        const dropdownBtn = createDropdownButton(() => {
            showDropdownList(
                displayBlock,
                colorOptionSpans,
                (_target, selectedItem) => {
                    const idx = Number((selectedItem as HTMLElement).dataset.colorIndex);
                    this._updateColorDisplay(displayBlock, idx);
                    this._syncField(displayBlock, "color", idx);
                },
                container
            );
        });

        container.append(displayBlock, dropdownBtn);
        return container;
    }

    private _updateColorDisplay(block: HTMLDivElement, color = 0): void {
        const colorValue = PLAYER_COLOR_LIST[color];
        block.innerHTML = "";
        if (colorValue === null) {
            block.textContent = "随机";
            block.style.background = "transparent";
        } else {
            const dot = document.createElement("span");
            dot.style.display = "inline-block";
            dot.style.width = "16px";
            dot.style.height = "16px";
            dot.style.background = colorValue;
            dot.style.borderRadius = "50%";
            block.append(dot);
        }
    }

    private _createStyleBlock(camp: string, _playerNumber: number): HTMLDivElement {
        const container = document.createElement("div");
        container.classList.add("player_config_style_div");

        const displaySpan = document.createElement("span");
        displaySpan.classList.add("player_config_style_span");
        this._updateStyleDisplay(displaySpan, camp);

        const campOptionSpans: HTMLSpanElement[] = [];
        for (const [key, value] of Object.entries(CAMP_NAME_MAP)) {
            const span = document.createElement("span");
            span.textContent = value;
            span.dataset.camp = key;
            campOptionSpans.push(span);
        }

        const dropdownBtn = createDropdownButton(() => {
            showDropdownList(
                displaySpan,
                campOptionSpans,
                (_target, selectedItem) => {
                    const campKey = (selectedItem as HTMLElement).dataset.camp || "US";
                    this._updateStyleDisplay(displaySpan, campKey);
                    this._syncField(displaySpan, "camp", campKey);
                },
                container
            );
        });

        container.append(displaySpan, dropdownBtn);
        return container;
    }

    private _updateStyleDisplay(span: HTMLSpanElement, camp: string): void {
        span.textContent = CAMP_NAME_MAP[camp] || camp;
    }
}
