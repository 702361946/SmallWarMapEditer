/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

/**
 * 加载 Cell 列表并渲染到页面
 */
async function loadCellList() {
    const cellGridDiv = document.getElementById('cell_grid_div');

    try {
        // 请求 CellMapping 配置
        const response = await fetch('/Game/SmallWar/MapEditor/Config/CellMapping');
        if (!response.ok) {
            console.error('加载 Cell 配置失败，状态码:', response.status);
            cellGridDiv.innerHTML = '<span style="color: red;">加载失败 (状态码: ' + response.status + ')</span>';
            return;
        }

        const cellMapping = await response.json();

        // 清空容器
        cellGridDiv.innerHTML = '';

        // 遍历所有 Cell 数据
        for (const [cellName, cellData] of Object.entries(cellMapping)) {
            const button = createCellButton(cellName, cellData);
            cellGridDiv.appendChild(button);
        }

    } catch (error) {
        console.error('加载 Cell 列表失败:', error);
        cellGridDiv.innerHTML = '<span style="color: red;">加载失败，请刷新重试</span>';
    }
}

/**
 * 创建单个 Cell 按钮
 * @param {string} cellName - 地块中文名称
 * @param {Object} cellData - 地块数据对象
 * @returns {HTMLButtonElement} 按钮元素
 */
function createCellButton(cellName, cellData) {
    const button = document.createElement('button');
    button.className = 'cell_grid_button';
    button.title = `${cellName} (ID: ${cellData.id})`;

    // 创建图片元素
    const img = document.createElement('img');
    img.src = `/Game/SmallWar/MapEditor/Image/cell/${cellData.id}`;
    img.className = 'cell_grid_button';
    img.alt = cellName;

    // 图片加载失败时的处理
    img.onerror = function() {
        img.src = ''; // 可以设置一个默认占位图
        img.alt = '图片加载失败';
    };

    // 创建名称标签
    const span = document.createElement('span');
    span.className = 'cell_grid_button';
    span.textContent = cellName;

    // 组装按钮
    button.appendChild(img);
    button.appendChild(span);

    // 点击事件
    button.addEventListener('click', function() {
        onCellSelected(cellName, cellData);
    });

    return button;
}

/**
 * 地块被选中时的回调
 * @param {string} cellName - 地块名称
 * @param {Object} cellData - 地块数据
 */
function onCellSelected(cellName, cellData) {
    console.log('选中地块:', cellName, cellData);
    // 这里可以添加选中后的逻辑，例如：
    // - 高亮显示
    // - 触发其他事件
    // - 保存选中状态
}