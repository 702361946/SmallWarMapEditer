/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const b_o_div = document.getElementById("brush_options_switch_div")
/**
 *
 * @type {{cell: function(), unit: function(), belonging: function()}}
 */
let b_o_brush_type = {
    "cell": () => {
    },
    "unit": () => {
    },
    "belonging": () => {
    }
}
let b_o_on_brush = "cell"

/**
 *
 * @param {string} t 必须包含在b_o_brush_type.key中
 */
function b_o_set_on_brush(t) {
    let flag = false
    for (let k in b_o_brush_type) {
        if (t === k) {
            flag = true
            break
        }
    }
    if (!flag) {
        return false
    }

    b_o_on_brush = t
    return true
}

function b_o_build_all_switch_button() {
    b_o_build_switch_cell_button()
    b_o_build_switch_unit_button()
    b_o_build_switch_belonging_button()
}

function _get_switch_button(_s_t, _f, brush_type) {
    // span
    let _s = document.createElement("span")
    _s.textContent = _s_t

    // button
    let _b = document.createElement("button")
    _b.addEventListener(
        "click",
        () => {
            if (b_o_set_on_brush(brush_type)) {
                b_o_t_clear_div()
                _f()
            }
        }
    )

    _b.append(_s)
    return _b;
}

function b_o_build_switch_cell_button() {
    let _s_t = "地块刷子"
    let _b = _get_switch_button(
        _s_t,
        b_o_build_all_cell_grid,
        "cell"
    );
    b_o_div.append(_b)
}

function b_o_build_switch_unit_button() {
    let _s_t = "单位刷子"
    let _b = _get_switch_button(
        _s_t,
        b_o_build_all_unit_grid,
        "unit"
    );
    b_o_div.append(_b)
}

function b_o_build_switch_belonging_button() {
    let _s_t = "归属刷子"
    let _b = _get_switch_button(
        _s_t,
        b_o_build_all_belonging_grid,
        "belonging"
    );
    b_o_div.append(_b)
}

function b_o_build_all_cell_grid() {
    b_o_c_load_cell_list().then()
}

function b_o_build_all_unit_grid() {
    b_o_u_load_unit_list().then()

}

function b_o_build_all_belonging_grid() {

}
