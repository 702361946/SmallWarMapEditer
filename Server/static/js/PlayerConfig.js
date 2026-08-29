const camp_map = {
    'US': '末日兵器',
    'StyleSteelTide': '钢铁洪流',
    'StyleMindbreaker': '大脑杀手',
    'StyleFlameArsenal': '火焰兵工',
    'StyleGlacialLegion': '极寒军团'
};

// 颜色池 (0~8, 0为随机)
const player_color = [
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

const player_team = [
    null,
    1,
    2,
    3,
    4
]

const player_div = document.getElementById("player_list")
const player_tab = document.getElementById("player_config")

function add_player(
    team = 0,
    color = 0,
    style = "US"
) {
    let id = player_div.querySelectorAll(':scope > div').length;
    if (id > 8) {
        return
    }

    const div = document.createElement('div');
    div.classList.add("player_config_tab")

    const s_id = document.createElement("span")
    s_id.textContent = id.toString()
    s_id.style = "width: 20%"

    const d_team = _add_team_block(team)

    const d_color = _add_color_block(color)

    const d_style = _add_style_block(style)
    div.append(s_id, d_team, d_color, d_style)

    player_div.append(div)
}

function remove_player() {
    let qsa = player_div.querySelectorAll(':scope > div');
    // 避免删除最后一个玩家(标题+玩家)
    if (qsa.length <= 2) {
        return;
    }
    // 删除最后一个 div
    qsa[qsa.length - 1].remove();
}

// team

/**
 *
 * @param {HTMLSpanElement} span
 * @param {number} team
 * @private
 */
function _set_team_span(span, team = 0) {
    let t = player_team[team]
    if (t == null) {
        t = "null"
    }
    span.textContent = t.toString()
}

/**
 *
 * @param {number} team
 * @private
 */
function _add_team_block(team = 0) {
    const d = document.createElement("div")
    d.classList.add("player_config_team_div")

    const s = document.createElement("span")
    s.classList.add("player_config_team_span")
    _set_team_span(s, team);

    const t = player_team.map(
        value => {
            const span = document.createElement('span');
            span.textContent = value === null ? "null" : value.toString();
            return span;
        }
    );

    const d_b = _dropdown_button(
        () => _dropdown_list(
            s,
            t,
            _dropdown_team_c_f,
            d
        )
    )

    d.append(s)
    d.append(d_b)
    return d
}

/**
 *
 * @param {HTMLSpanElement} s
 * @param {HTMLSpanElement} v
 * @private
 */
function _dropdown_team_c_f(s, v) {
    let t = 0
    try {
        t = Number(v.textContent)
        if (Number.isNaN(t) || t < 0 || t >= player_team.length) {
            t = 0
        }
    } catch (e) {
        // 任何异常都将值设为 0
        t = 0
    }

    _set_team_span(s, t)
}

// color

/**
 * @param {HTMLDivElement} color_block
 * @param {number} [color=0]
 * @returns {HTMLDivElement}
 */
function _set_color_block_color(color_block, color = 0) {
    color_block.innerHTML = ""
    color_block.style.background = "#00000000"
    let c = player_color[color]
    if (c == null) {
        color_block.innerHTML = `<span>随机</span>`;
    } else {
        color_block.style.background = c;
    }
}

function _add_color_block(color = 0) {
    const d = document.createElement("div");
    d.classList.add("player_config_color_div")

    // 颜色块
    let c = document.createElement("div");
    c.classList.add("player_config_color_block")
    _set_color_block_color(c, color);

    const p_c = [];
    for (let i = 0; i < player_color.length; i++) {
        const p_c_d = document.createElement('div');
        p_c_d.classList.add("player_config_color_block")
        _set_color_block_color(p_c_d, i);
        p_c.push(p_c_d);
    }

    const dropdownBtn = _dropdown_button(
        () => _dropdown_list(
            c,
            p_c,
            _dropdown_color_c_f,
            d
        )
    )

    d.append(c);
    d.append(dropdownBtn);
    return d
}

/**
 *
 * @param {HTMLDivElement} s
 * @param {HTMLDivElement} v
 * @private
 */
function _dropdown_color_c_f(s, v) {
    // 修正：使用 instanceof 判断元素类型
    if (v instanceof HTMLSpanElement) {
        _set_color_block_color(s, 0);
        return;
    }

    // 获取 v 的背景色
    const vBgColor =
        v.style.backgroundColor || window.getComputedStyle(v).backgroundColor;

    // 从索引 1 开始遍历（0 为 null/默认值）
    let flag = false;
    for (let i = 1; i < player_color.length; i++) {
        if (_hexToRgb(player_color[i]) === vBgColor) {
            _set_color_block_color(s, i);
            flag = true
            return;
        }
    }

    if (!flag) {
        _set_color_block_color(s, 0)
    }
}

/**
 * #xxxxxx 转 rgb(x, x, x)
 * @param {string} hex
 * @returns {string}
 * @private
 */
function _hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

// style

/**
 *
 * @param {HTMLSpanElement} s
 * @param {string} style
 * @private
 */
function _set_style_span(s, style = "US") {
    s.textContent = camp_map[style] ?? "ERROR"
}

/**
 *
 * @param {string} style
 * @private
 */
function _add_style_block(style = "US") {
    const d = document.createElement("div")
    d.classList.add("player_config_style_div")

    const s = document.createElement("span")
    s.classList.add("player_config_style_span")

    _set_style_span(s, style);

    let c_m = [];
    for (let [key, value] of Object.entries(camp_map)) {
        let span = document.createElement('span');
        span.textContent = value;
        span.dataset.camp = key;   // 将key挂载到自定义属性
        c_m.push(span);
    }

    const d_b = _dropdown_button(
        () => _dropdown_list(
            s,
            c_m,
            _dropdown_style_c_f,
            d
        )
    )

    d.append(s)
    d.append(d_b)

    return d
}

/**
 *
 * @param {HTMLSpanElement} s
 * @param {HTMLSpanElement} v
 * @private
 */
function _dropdown_style_c_f(s, v) {
    _set_style_span(s, v.dataset.camp)
}

// dropdown_button

/**
 *
 * @param {function} callback_function
 * @returns {HTMLButtonElement}
 * @private
 */
function _dropdown_button(callback_function = null) {
    const dropdownBtn = document.createElement("button");
    dropdownBtn.classList.add("player_config_dropdown_button")
    dropdownBtn.innerHTML =
        `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>`;

    if (callback_function != null) {
        dropdownBtn.onclick = (e) => {
            e.stopPropagation(); // 防止冒泡触发外部关闭
            callback_function()
        }
    }

    return dropdownBtn
}

/**
 * 下拉列表组件 — 使用 Popover API，自动获取目标位置定位
 * @param {HTMLSpanElement | HTMLDivElement} s — 目标元素
 * @param {Element[]} show_div — 显示的容器内容, 将挂载到每个button下
 * @param {function(HTMLSpanElement, Element): void} callback_function — 回调
 * @param {HTMLDivElement} base_div — 基于哪个 div 的坐标定位下拉框
 * @private
 */
function _dropdown_list(
    s,
    show_div,
    callback_function = null,
    base_div = null,
) {
    // 复用或创建 Popover 面板
    let d = document.getElementById("player_config_dropdown_panel");
    if (!d) {
        d = document.createElement("div");
        d.id = "player_config_dropdown_panel";
        d.popover = "manual";           // 手动控制，避免自动居中行为
        d.classList.add("player_config_dropdown_list_panel");
        document.body.append(d);       // 挂载到 body，避免被父容器裁剪
    } else {
        d.hidePopover();
        d.classList.remove("flipped"); // 重置翻转状态
    }

    // 清空并重建内容
    d.innerHTML = "";
    for (const i of show_div) {
        const i_b = document.createElement("button");
        i_b.type = "button";
        i_b.classList.add("player_config_dropdown_list_item");
        i_b.append(i);
        if (callback_function != null) {
            i_b.onclick = () => {
                callback_function(s, i);
                _close_dropdown();
            };
        }
        d.append(i_b);
    }

    // 获取目标位置并定位
    // 优先使用 base_div 回退到触发元素 player_tab
    const reference = base_div || player_tab;

    // 获取参考元素相对于视口的位置
    const rect = reference.getBoundingClientRect();

    const gap = 4;                    // 下拉框与参考元素的间距
    const top = rect.bottom + gap;    // 默认显示在参考元素下方
    const left = rect.left;           // 左对齐
    const minWidth = rect.width;      // 最小宽度与参考元素一致

    d.style.top = top + "px";
    d.style.left = left + "px";
    d.style.minWidth = minWidth + "px";

    // 边界检测与自动调整
    // 先显示以获取实际尺寸（Popover 必须先 show 才能获取正确尺寸）
    d.showPopover();
    const panelRect = d.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const padding = 8;

    // 右边界检测：超出则左移
    if (left + panelRect.width > winW - padding) {
        const newLeft = winW - panelRect.width - padding;
        d.style.left = Math.max(padding, newLeft) + "px";
    }

    // 下边界检测：下方空间不足则翻转到上方
    if (top + panelRect.height > winH - padding) {
        const newTop = rect.top - panelRect.height - gap;
        d.style.top = Math.max(padding, newTop) + "px";
        d.classList.add("flipped");   // 可添加翻转样式（如箭头朝上）
    }

    // 点击外部关闭
    const closeOnClickOutside = (e) => {
        if (!d.contains(e.target) && e.target !== s && e.target !== base_div) {
            _close_dropdown();
            document.removeEventListener("click", closeOnClickOutside);
        }
    };
    requestAnimationFrame(() => {
        document.addEventListener("click", closeOnClickOutside);
    });

    // 存储当前触发器引用
    window._current_dropdown_trigger = s;
    s.classList.add("dropdown_active");
}

/**
 * 关闭当前下拉框
 * @private
 */
function _close_dropdown() {
    const d = document.getElementById("player_config_dropdown_panel");
    const trigger = window._current_dropdown_trigger;

    if (d) {
        d.hidePopover();
        d.classList.remove("flipped");
    }
    if (trigger) {
        trigger.classList.remove("dropdown_active");
        window._current_dropdown_trigger = null;
    }
}

