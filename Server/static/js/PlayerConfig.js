/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const CAMP_NAME_MAP = {
    'US': '末日兵器',
    'StyleSteelTide': '钢铁洪流',
    'StyleMindbreaker': '大脑杀手',
    'StyleFlameArsenal': '火焰兵工',
    'StyleGlacialLegion': '极寒军团'
};

// 颜色池 (0~8, 0为随机)
const PLAYER_COLOR_LIST = [
    null,           // 0: 随机
    '#e94560',      // 1: 红
    '#fbbf24',      // 2: 黄
    '#4ade80',      // 3: 绿
    '#38bdf8',      // 4: 蓝
    '#a78bfa',      // 5: 紫
    '#f472b6',      // 6: 粉
    '#fb923c',      // 7: 橙
    '#2dd4bf'       // 8: 青
];

const PLAYER_TEAM_LIST = [
    null,
    1,
    2,
    3,
    4
];

const playerListContainer = document.getElementById("player_list");
const playerConfigTab = document.getElementById("player_config");

class PlayerData {
    unitPlayerNumber = 0;

    constructor(
        playerNumber,
        team = 0,
        camp = "US",
        color = 0,
        isActive = false
    ) {
        this.playerNumber = playerNumber;
        this.team = team;
        this.camp = camp;
        this.color = color;
        this.techPoint = 0;
        this.unitPlayerNumber = 0;
        this.landUnits = [];
        this.skyUnits = [];
        this.shipUnits = [];
        this.lockTechs = [];
        this.lockUnits = [];
        this.lockUpgrade = [];
        this.type = 0;
        this.isActive = isActive;
    }

    /**
     * 导出为后端 EasyPlayerData 结构
     * @returns {Object}
     */
    toEasyPlayerData() {
        if (!this.isActive) {
            this.reset()
        }
        return {
            playerNumber: this.playerNumber,
            team: this.team,
            techPoint: this.techPoint,
            camp: this.camp,
            unitPlayerNumber: this.unitPlayerNumber,
            landUnits: [...this.landUnits],
            skyUnits: [...this.skyUnits],
            shipUnits: [...this.shipUnits],
            lockTechs: [...this.lockTechs],
            lockUnits: [...this.lockUnits],
            lockUpgrade: [...this.lockUpgrade],
            type: this.type,
            color: this.color
        };
    }

    /**
     * 重置为默认值
     */
    reset() {
        this.team = 0;
        this.camp = "US";
        this.color = 0;
        this.techPoint = 0;
        this.unitPlayerNumber = 0;
        this.landUnits = [];
        this.skyUnits = [];
        this.shipUnits = [];
        this.lockTechs = [];
        this.lockUnits = [];
        this.lockUpgrade = [];
        this.type = 0;
        this.isActive = false;
    }
}

/** @type {PlayerData[]} */
const playerDataList = Array.from({length: 9}, (_, index) => new PlayerData(index));

/**
 * 从 DOM 元素向上查找所属玩家的 ID
 * @param {HTMLElement} element
 * @returns {number | null}
 */
function getPlayerNumberFromElement(element) {
    const row = element.closest('.player_config_tab');
    if (!row) return null;
    const id = Number(row.dataset.id);
    return Number.isNaN(id) ? null : id;
}

/**
 * 同步玩家数据到模型
 * @param {HTMLElement} element - 任意玩家行内的元素
 * @param {string} field - 字段名
 * @param {*} value - 新值
 */
function syncPlayerField(element, field, value) {
    const playerNumber = getPlayerNumberFromElement(element);
    if (playerNumber === null) return;
    const playerData = playerDataList[playerNumber];
    if (playerData) {
        playerData[field] = value;
    }
}

function addPlayer(
    team = 0,
    color = 0,
    camp = "US"
) {
    let playerNumber = playerListContainer.querySelectorAll(':scope > div').length;
    if (playerNumber > 8) {
        return;
    }

    // 初始化数据模型
    const playerData = playerDataList[playerNumber];
    playerData.team = team;
    playerData.color = color;
    playerData.camp = camp;
    playerData.isActive = true;

    const div = document.createElement('div');
    div.classList.add("player_config_tab");
    div.dataset.id = playerNumber.toString();

    const s_id = document.createElement("span");
    s_id.textContent = playerNumber.toString();
    s_id.style = "width: 20%";

    const teamBlock = createTeamBlock(team);
    const colorBlock = createColorBlock(color);
    const styleBlock = createStyleBlock(camp);
    div.append(s_id, teamBlock, colorBlock, styleBlock);

    playerListContainer.append(div);
}

function removePlayer() {
    const rows = playerListContainer.querySelectorAll(':scope > div');
    // 避免删除最后一个玩家(标题+玩家)
    if (rows.length <= 2) {
        return;
    }
    // 删除最后一个 div
    const playerNumber = rows.length - 1;
    rows[playerNumber].remove();

    // 重置数据模型
    playerDataList[playerNumber].reset();
}

// team

/**
 * @param {HTMLSpanElement} span
 * @param {number} team
 * @private
 */
function updateTeamDisplay(span, team = 0) {
    const teamValue = PLAYER_TEAM_LIST[team];
    span.textContent = teamValue === null ? "null" : teamValue.toString();
}

/**
 * @param {number} team
 * @private
 */
function createTeamBlock(team = 0) {
    const container = document.createElement("div");
    container.classList.add("player_config_team_div");

    const displaySpan = document.createElement("span");
    displaySpan.classList.add("player_config_team_span");
    updateTeamDisplay(displaySpan, team);

    const teamOptionSpans = PLAYER_TEAM_LIST.map(value => {
        const span = document.createElement('span');
        span.textContent = value === null ? "null" : value.toString();
        return span;
    });

    const dropdownBtn = createDropdownButton(
        () => showDropdownList(
            displaySpan,
            teamOptionSpans,
            onTeamSelected,
            container
        )
    );

    container.append(displaySpan);
    container.append(dropdownBtn);
    return container;
}

/**
 * @private
 */
function onTeamSelected(displaySpan, selectedItem) {
    let teamValue = 0;
    try {
        teamValue = Number(selectedItem.textContent);
        if (Number.isNaN(teamValue) || teamValue < 0 || teamValue >= PLAYER_TEAM_LIST.length) {
            teamValue = 0;
        }
    } catch (e) {
        teamValue = 0;
    }

    updateTeamDisplay(displaySpan, teamValue);
    syncPlayerField(displaySpan, 'team', teamValue);
}

// color

/**
 * @param {HTMLDivElement} colorBlock
 * @param {number} [color=0]
 */
function updateColorDisplay(colorBlock, color = 0) {
    colorBlock.innerHTML = "";
    colorBlock.style.background = "#00000000";
    const colorValue = PLAYER_COLOR_LIST[color];
    if (colorValue == null) {
        colorBlock.innerHTML = `<span>随机</span>`;
    } else {
        colorBlock.style.background = colorValue;
    }
}

function createColorBlock(color = 0) {
    const container = document.createElement("div");
    container.classList.add("player_config_color_div");

    const displayBlock = document.createElement("div");
    displayBlock.classList.add("player_config_color_block");
    updateColorDisplay(displayBlock, color);

    const colorOptionBlocks = [];
    for (let i = 0; i < PLAYER_COLOR_LIST.length; i++) {
        const optionBlock = document.createElement('div');
        optionBlock.classList.add("player_config_color_block");
        updateColorDisplay(optionBlock, i);
        colorOptionBlocks.push(optionBlock);
    }

    const dropdownBtn = createDropdownButton(
        () => showDropdownList(
            displayBlock,
            colorOptionBlocks,
            onColorSelected,
            container
        )
    );

    container.append(displayBlock);
    container.append(dropdownBtn);
    return container;
}

/**
 * @private
 */
function onColorSelected(displayBlock, selectedItem) {
    if (selectedItem instanceof HTMLSpanElement) {
        updateColorDisplay(displayBlock, 0);
        syncPlayerField(displayBlock, 'color', 0);
        return;
    }

    const selectedBgColor =
        selectedItem.style.backgroundColor || window.getComputedStyle(selectedItem).backgroundColor;

    for (let i = 1; i < PLAYER_COLOR_LIST.length; i++) {
        if (hexToRgb(PLAYER_COLOR_LIST[i]) === selectedBgColor) {
            updateColorDisplay(displayBlock, i);
            syncPlayerField(displayBlock, 'color', i);
            return;
        }
    }

    updateColorDisplay(displayBlock, 0);
    syncPlayerField(displayBlock, 'color', 0);
}

/**
 * #xxxxxx 转 rgb(x, x, x)
 * @param {string} hex
 * @returns {string}
 * @private
 */
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// style

/**
 * @param {HTMLSpanElement} span
 * @param {string} camp
 * @private
 */
function updateStyleDisplay(span, camp = "US") {
    span.textContent = CAMP_NAME_MAP[camp] ?? "ERROR";
}

/**
 * @param {string} camp
 * @private
 */
function createStyleBlock(camp = "US") {
    const container = document.createElement("div");
    container.classList.add("player_config_style_div");

    const displaySpan = document.createElement("span");
    displaySpan.classList.add("player_config_style_span");
    updateStyleDisplay(displaySpan, camp);

    const campOptionSpans = [];
    for (const [key, value] of Object.entries(CAMP_NAME_MAP)) {
        const span = document.createElement('span');
        span.textContent = value;
        span.dataset.camp = key;
        campOptionSpans.push(span);
    }

    const dropdownBtn = createDropdownButton(
        () => showDropdownList(
            displaySpan,
            campOptionSpans,
            onStyleSelected,
            container
        )
    );

    container.append(displaySpan);
    container.append(dropdownBtn);

    return container;
}

/**
 * @private
 */
function onStyleSelected(displaySpan, selectedItem) {
    const campKey = selectedItem.dataset.camp;
    updateStyleDisplay(displaySpan, campKey);
    syncPlayerField(displaySpan, 'camp', campKey);
}

// dropdown_button

/**
 * @param {function} callbackFunction
 * @returns {HTMLButtonElement}
 * @private
 */
function createDropdownButton(callbackFunction = null) {
    const dropdownBtn = document.createElement("button");
    dropdownBtn.classList.add("player_config_dropdown_button");
    dropdownBtn.innerHTML =
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;

    if (typeof callbackFunction === 'function') {
        dropdownBtn.onclick = (e) => {
            e.stopPropagation();
            callbackFunction();
        };
    }

    return dropdownBtn;
}

/**
 * 下拉列表组件 — 使用 Popover API，自动获取目标位置定位
 * @param {HTMLSpanElement | HTMLDivElement} targetElement — 目标元素
 * @param {Element[]} itemElements — 显示的容器内容
 * @param {function(HTMLSpanElement, Element): void} onSelect — 回调
 * @param {HTMLDivElement} referenceElement — 基于哪个 div 的坐标定位下拉框
 * @private
 */
function showDropdownList(
    targetElement,
    itemElements,
    onSelect = null,
    referenceElement = null,
) {
    let d = document.getElementById("player_config_dropdown_panel");
    if (!d) {
        d = document.createElement("div");
        d.id = "player_config_dropdown_panel";
        d.popover = "manual";
        d.classList.add("player_config_dropdown_list_panel");
        document.body.append(d);
    } else {
        d.hidePopover();
        d.classList.remove("flipped");
    }

    d.innerHTML = "";
    for (const item of itemElements) {
        const itemBtn = document.createElement("button");
        itemBtn.type = "button";
        itemBtn.classList.add("player_config_dropdown_list_item");
        itemBtn.append(item);
        if (onSelect != null) {
            itemBtn.onclick = () => {
                onSelect(targetElement, item);
                closeDropdown();
            };
        }
        d.append(itemBtn);
    }

    const reference = referenceElement || playerConfigTab;
    const rect = reference.getBoundingClientRect();

    const gap = 4;
    const top = rect.bottom + gap;
    const left = rect.left;
    const minWidth = rect.width;

    d.style.top = top + "px";
    d.style.left = left + "px";
    d.style.minWidth = minWidth + "px";

    d.showPopover();
    const panelRect = d.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const padding = 8;

    if (left + panelRect.width > winW - padding) {
        const newLeft = winW - panelRect.width - padding;
        d.style.left = Math.max(padding, newLeft) + "px";
    }

    if (top + panelRect.height > winH - padding) {
        const newTop = rect.top - panelRect.height - gap;
        d.style.top = Math.max(padding, newTop) + "px";
        d.classList.add("flipped");
    }

    const closeOnClickOutside = (e) => {
        if (!d.contains(e.target) && e.target !== targetElement && e.target !== referenceElement) {
            closeDropdown();
            document.removeEventListener("click", closeOnClickOutside);
        }
    };
    requestAnimationFrame(() => {
        document.addEventListener("click", closeOnClickOutside);
    });

    window._currentDropdownTrigger = targetElement;
    targetElement.classList.add("dropdown_active");
}

/**
 * 关闭当前下拉框
 * @private
 */
function closeDropdown() {
    const d = document.getElementById("player_config_dropdown_panel");
    const trigger = window._currentDropdownTrigger;

    if (d) {
        d.hidePopover();
        d.classList.remove("flipped");
    }
    if (trigger) {
        trigger.classList.remove("dropdown_active");
        window._currentDropdownTrigger = null;
    }
}
