/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

let on_cell_id = 0
/**
 *
 * @type {number[]}
 */
let all_cell_id = []

/**
 * 加载 Cell 列表并渲染到页面
 */
async function b_o_c_load_cell_list() {
    try {
        // 请求 CellMapping 配置
        const response = await fetch('/Game/SmallWar/MapEditor/Config/CellMapping');
        if (!response.ok) {
            console.error('加载 Cell 配置失败，状态码:', response.status);
            let _s = document.createElement("span")
            _s.textContent = `加载失败 (状态码:${response.status})`
            b_o_t_append_to_div(_s)
            return;
        }

        const cellMapping = await response.json();

        // 遍历所有 Cell 数据
        for (const [cellName, cellData] of Object.entries(cellMapping)) {
            all_cell_id.push(cellData.id)
            const button = createCellButton(cellName, cellData);
            b_o_t_append_to_div(button);
        }

    } catch (error) {
        console.error('加载 Cell 列表失败:', error);
        let _s = document.createElement("span")
        _s.textContent = `加载失败,请刷新重试;${error}`
        b_o_t_append_to_div(_s)
    }
}

/**
 * 创建单个 Cell 按钮
 * @param {string} cellName - 地块中文名称
 * @param {Object} cellData - 地块数据对象
 * @returns {HTMLButtonElement} 按钮元素
 */
function createCellButton(cellName, cellData) {
    let _title = `${cellName} (ID: ${cellData.id})`
    let img_url = `/Game/SmallWar/MapEditor/Image/cell/${cellData.id}`

    return b_o_t_get_grid_block(
        img_url,
        cellName,
        _title,
        () => onCellSelected(cellName, cellData)
    )
}

/**
 * 地块被选中时的回调
 * @param {string} cellName - 地块名称
 * @param {Object} cellData - 地块数据
 */
function onCellSelected(cellName, cellData) {
    console.log('选中地块:', cellName, cellData)
    on_cell_id = cellData.id
}