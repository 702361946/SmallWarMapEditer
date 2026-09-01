/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const _hex_map_div = document.getElementById('map_editor_hex_map_div');

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

/**
 *
 * @param {number} q col(列)
 * @param {number} r row(行)
 * @param {number} width 宽度
 * @param {number} height 高度
 */
function buildHexMap(q, r, width, height) {
    // 1. 顶点偏移模板（flat-topped）
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

            const points = _qr_to_svg_points(cx, cy, offsets);

            // 4. 插入 polygon
            const cell = document.createElementNS(svgNs, 'polygon');
            cell.setAttribute('points', points);
            cell.setAttribute('class', 'map_editor_six_cell');
            // cell.dataset.q = _q.toString();
            // cell.dataset.r = _r.toString();

            // 交互示例
            cell.addEventListener('click', () => {
                console.log('点击了', _q, _r);
            });

            svg.append(cell);
        }
    }

    // 设置 SVG 尺寸
    const svg_w = map_w;
    const svg_h = map_h;
    svg.setAttribute('width', svg_w.toString());
    svg.setAttribute('height', svg_h.toString());
    // h已翻转,所以h偏移为正
    svg.setAttribute('viewBox', `${-w_half} ${h_half} ${svg_w} ${svg_h}`);

    _hex_map_div.append(svg);
}

// 使用
// buildHexMap(8, 6, 40);