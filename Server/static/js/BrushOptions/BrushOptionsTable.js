/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const b_o_t_div = document.getElementById("brush_options_table_div")
/**
 *
 * @type {null | HTMLElement}
 */
let b_o_t_on_grid = null


function b_o_t_clear_div() {
    b_o_t_div.innerHTML = ""
}

function b_o_t_clear_on_grid() {
    if (b_o_t_on_grid === null) {
        return
    }
    b_o_t_on_grid.style.background = ""
}

/**
 *
 * @param {HTMLElement} e
 * @param {string} on_color
 */
function b_o_t_set_on_grid(e, on_color = "#ffff00") {
    b_o_t_clear_on_grid()
    b_o_t_on_grid = e
    e.style.background = on_color
}

/**
 *
 * @param {string} img_url
 * @param {string} span_text
 * @param {string} title_text
 * @param {function} r_f
 * @param {string} on_color
 */
function b_o_t_get_grid_block(
    img_url,
    span_text = "",
    title_text = "",
    r_f,
    on_color = "#ffff00"
) {
    const b = document.createElement('button')
    b.className = 'brush_options_table_grid_button'
    b.title = title_text

    // 创建图片元素
    const img = document.createElement('img')
    img.src = img_url
    img.className = 'brush_options_table_grid_img'

    // 图片加载失败时的处理
    img.onerror = () => {
        img.src = ''
        img.alt = '图片加载失败'
    };

    // 创建名称标签
    const s = document.createElement('span');
    s.className = 'brush_options_table_grid_span'
    s.textContent = span_text

    // 组装按钮
    b.append(img);
    b.append(s);

    // 点击事件
    b.addEventListener('click', () => {
        b_o_t_clear_on_grid()
        b_o_t_set_on_grid(b, on_color)
        r_f()
    });

    return b;
}

/**
 *
 * @param {HTMLElement} e
 */
function b_o_t_append_to_div(e) {
    b_o_t_div.append(e)
}
