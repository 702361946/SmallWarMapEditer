/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const _hex_map_div = document.getElementById('map_editor_hex_map_div');

/**
 *
 * @type {CellItem[][]}
 * @private
 */
let _hex_map = []

/**
 *
 * @param {number} w 宽度
 * @param {number} h 高度
 * @returns {number[][]} 偏移表
 */
function _get_cell_flat_topped_offsets(w, h) {
    let w_half = w / 2
    let w_quarter = w / 4
    let h_half = h / 2
    return [
        [w_half, 0],           // 右
        [w_quarter, h_half],   // 右上
        [-w_quarter, h_half],  // 左上
        [-w_half, 0],          // 左
        [-w_quarter, -h_half], // 左下
        [w_quarter, -h_half]   // 右下
    ];
}

/**
 *
 * @param {number} cx 中心x坐标
 * @param {number} cy 中心y坐标
 * @param {number[][]} offsets 偏移坐标表
 * @returns {string}
 * @private
 */
function _qr_to_svg_points(cx, cy, offsets) {
    // 计算顶点绝对坐标并转为svg points
    // _svg_points: "x,y x,y x,y..."
    return offsets
        .map(
            (
                [dx, dy]
            ) =>
                `${(cx + dx).toFixed(1)},${(cy + dy).toFixed(1)}`
        )
        .join(' ');
}

function set_map_svg(map_w, map_h, m_svg) {
    const MIN_SCALE = 1;   // 最小缩放
    const MAX_SCALE = 2;     // 最大缩放
    const DRAG_THRESHOLD = 20; // 拖拽判定阈值（像素）

    const state = {
        vbX: 0, vbY: 0,          // viewBox 左上角
        vbW: map_w, vbH: map_h,  // viewBox 宽高
    };

    function applyViewBox() {
        m_svg.setAttribute('viewBox', `${state.vbX} ${state.vbY} ${state.vbW} ${state.vbH}`);
    }

    function clampState() {
        // 限制缩放范围
        state.vbW = Math.min(map_w / MIN_SCALE, Math.max(map_w / MAX_SCALE, state.vbW));
        state.vbH = state.vbW * (map_h / map_w); // 保持宽高比
        // 限制平移不越界（留一点余量）
        const margin = map_w * 0.2;
        state.vbX = Math.min(map_w + margin - state.vbW, Math.max(-margin, state.vbX));
        state.vbY = Math.min(map_h + margin - state.vbH, Math.max(-margin, state.vbY));
    }

    // 计算 viewBox 在元素内的实际渲染区域（扣除 meet 模式留白）
    function getViewMetrics() {
        const rect = m_svg.getBoundingClientRect();
        // meet 等比缩放取较小倍率
        const s = Math.min(rect.width / state.vbW, rect.height / state.vbH);
        const drawnW = state.vbW * s;
        const drawnH = state.vbH * s;
        // xMidYMid 居中，留白对半分
        const offX = (rect.width - drawnW) / 2;
        const offY = (rect.height - drawnH) / 2;
        return {rect, drawnW, drawnH, offX, offY};
    }

    // —— 滚轮缩放（以鼠标位置为中心）——
    m_svg.addEventListener('wheel', (e) => {
        e.preventDefault();
        const {rect, drawnW, drawnH, offX, offY} = getViewMetrics();

        // 鼠标在"实际渲染的地图区域"内的比例位置（0~1）
        const px = (e.clientX - rect.left - offX) / drawnW;
        const py = (e.clientY - rect.top - offY) / drawnH;

        const factor = e.deltaY < 0 ? 0.9 : 1.1; // 向上缩小 viewBox = 放大
        const newW = state.vbW * factor;
        const newH = state.vbH * factor;

        // 保持鼠标下的点不动：viewBox 左上角向鼠标方向补偿
        state.vbX += (state.vbW - newW) * px;
        state.vbY += (state.vbH - newH) * py;
        state.vbW = newW;
        state.vbH = newH;

        clampState();
        applyViewBox();
    }, {passive: false});

    // —— 拖拽平移（带阈值，点击不劫持 cell 的 click）——
    let dragInfo = null; // { startX, startY, active, id }

    m_svg.addEventListener('pointerdown', (e) => {
        // 只记录，不捕获，让 click 能正常到达 cell
        dragInfo = {startX: e.clientX, startY: e.clientY, active: false, id: e.pointerId};
    });

    m_svg.addEventListener('pointermove', (e) => {
        if (!dragInfo || e.pointerId !== dragInfo.id) return;

        if (!dragInfo.active) {
            const dist = Math.hypot(e.clientX - dragInfo.startX, e.clientY - dragInfo.startY);
            if (dist < DRAG_THRESHOLD) return;
            // 确认是拖拽，此刻才捕获指针（拖出边界也能继续）
            dragInfo.active = true;
            try {
                m_svg.setPointerCapture(e.pointerId);
            } catch (_) {
            }
            dragInfo.lastX = e.clientX;
            dragInfo.lastY = e.clientY;
            return; // 本次 move 只用于激活拖拽，不产生位移
        }

        const {drawnW, drawnH} = getViewMetrics();
        // 屏幕像素 → viewBox 单位
        const scaleX = state.vbW / drawnW;
        const scaleY = state.vbH / drawnH;
        state.vbX -= (e.clientX - dragInfo.lastX) * scaleX;
        state.vbY -= (e.clientY - dragInfo.lastY) * scaleY;
        dragInfo.lastX = e.clientX;
        dragInfo.lastY = e.clientY;

        clampState();
        applyViewBox();
    });

    function endDrag(e) {
        if (dragInfo?.active) {
            try {
                m_svg.releasePointerCapture(e.pointerId);
            } catch (_) {
            }
        }
        dragInfo = null;
    }

    m_svg.addEventListener('pointerup', endDrag);
    m_svg.addEventListener('pointercancel', endDrag);

    // 初始化
    m_svg.style.touchAction = 'none';
    m_svg.style.userSelect = 'none';
    clampState();
    applyViewBox();
}

/**
 *
 * @param {number} q col(列)
 * @param {number} r row(行)
 * @param {number} width 宽度
 * @param {number} height 高度
 */
function buildHexMap(q, r, width, height) {
    // 重置表格
    _hex_map = []
    for (let _r = 0; _r < r; _r++) {
        let _add = []
        for (let _q = 0; _q < q; _q++) {
            _add.push(new CellItem([_q, _r]))
        }
        _hex_map.push(_add)
    }

    // 顶点偏移模板（flat-topped）
    let w_half = width / 2
    let h_half = height / 2
    const map_h = height * r + h_half
    const map_w = width * q * (3 / 4) + width / 4
    const offsets = _get_cell_flat_topped_offsets(width, height);

    // 创建 SVG 容器
    const svgNs = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNs, 'svg');
    svg.style.display = 'block';

    // 遍历网格
    // odd-q
    for (let _q = 0; _q < q; _q++) {
        for (let _r = 0; _r < r; _r++) {
            let cx = _q * width * (3 / 4)
            let cy = _r * height
            if (_q % 2 === 1) {
                cy += h_half
            }

            // 目标游戏开发者从下为y0, 重置y
            cy = map_h - cy

            // svg网格偏移
            cx += w_half
            cy -= h_half

            const points = _qr_to_svg_points(cx, cy, offsets);

            // 4. 插入 polygon
            const cell = document.createElementNS(svgNs, 'polygon');
            const img = document.createElementNS(svgNs, 'image');

            cell.dataset.x = _q.toString()
            cell.dataset.y = _r.toString()
            img.dataset.x = _q.toString()
            img.dataset.y = _r.toString()

            cell.setAttribute('points', points);
            cell.setAttribute('class', 'map_editor_six_cell');

            img.setAttribute('width', '32');
            img.setAttribute('height', '48');

            // 让图片中心对准 cell 中心，y 多向上偏 8px（高出的部分）
            img.setAttribute('x', (cx - 16).toString());
            img.setAttribute('y', (cy - 32).toString());

            set_cell_image(0, img)

            svg.append(cell);
            svg.append(img);  // image应在cell后绘制

            // 写入表格

            // 交互
            let r_f = () => {
                console.log('点击了', _q, _r, img);
                set_cell_image(on_cell_id, img)
            }
            cell.addEventListener('click', r_f);
            img.addEventListener('click', r_f)
        }
    }

    // 设置 SVG 尺寸
    const svg_w = map_w;
    const svg_h = map_h;
    svg.setAttribute('width', svg_w.toString());
    svg.setAttribute('height', svg_h.toString());
    svg.setAttribute('viewBox', `0 0 ${svg_w} ${svg_h}`);

    // 缩放层
    const m_svg = document.createElementNS(svgNs, 'svg');
    m_svg.setAttribute('width', '100%');
    m_svg.setAttribute('height', '100%');
    m_svg.setAttribute('viewBox', `0 0 ${map_w} ${map_h}`);

    set_map_svg(map_w, map_h, m_svg);

    m_svg.append(svg)

    _hex_map_div.append(m_svg);
}

/**
 *
 * @param {number} cell_id
 * @param {SVGImageElement} cell
 */
function set_cell_image(cell_id, cell) {
    cell.setAttribute(
        'href',
        `/Game/SmallWar/MapEditor/Image/cell/${encodeURIComponent(cell_id)}`
    );

    if (!"x" in cell.dataset) {
        return
    }
    if (!"y" in cell.dataset) {
        return
    }

    // console.log("debug", cell.dataset.x, cell.dataset.y)
    _hex_map[Number(cell.dataset.y)][Number(cell.dataset.x)].cell_id = cell_id
}
