/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

let on_unit_id = 0
/**
 *
 * @type {number[]}
 */
let all_unit_id = []

/**
 * 加载 Unit 列表并渲染到页面
 */
async function b_o_u_load_unit_list() {
    try {
        // 请求 CellMapping 配置
        const response = await fetch('/Game/SmallWar/MapEditor/Config/UnitMapping');
        if (!response.ok) {
            console.error('加载 Unit 配置失败，状态码:', response.status);
            let _s = document.createElement("span")
            _s.textContent = `加载失败 (状态码:${response.status})`
            b_o_t_append_to_div(_s)
            return;
        }

        const unitMapping = await response.json();

        // 遍历所有 Unit 数据
        for (const [name, data] of Object.entries(unitMapping)) {
            all_unit_id.push(data.id)
            const button = createUnitButton(name, data);
            b_o_t_append_to_div(button);
        }

    } catch (error) {
        console.error('加载 Unit 列表失败:', error);
        let _s = document.createElement("span")
        _s.textContent = `加载失败,请刷新重试;${error}`
        b_o_t_append_to_div(_s)
    }
}

/**
 * 创建单个 Cell 按钮
 * @param {string} unitName - 地块中文名称
 * @param {Object} unitData - 地块数据对象
 * @returns {HTMLButtonElement} 按钮元素
 */
function createUnitButton(unitName, unitData) {
    let _title = `${unitName} (ID: ${unitData.id})`
    let img_url = `/Game/SmallWar/MapEditor/Image/unit/${unitData.id}`

    return b_o_t_get_grid_block(
        img_url,
        unitName,
        _title,
        () => onUnitSelected(unitName, unitData)
    )
}

/**
 * 单位被选中时的回调
 * @param {string} name - 名称
 * @param {Object} data - 数据
 */
function onUnitSelected(name, data) {
    console.log('选中单位:', name, data)
    on_unit_id = data.id
}