/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

/**
 *
 * @type {HTMLSpanElement}
 */
const xy_span = document.getElementById("map_config_information_xy_span")

const m_c_button_div = document.getElementById("map_config_button_div")

let set_map_xy = [30, 20]

function updata_xy_info(x, y) {
    xy_span.textContent = `x: ${x}&y: ${y}`
}

function m_c_build_all_button() {
    m_c_build_reset_button()
    m_c_build_set_button()
}

function m_c_build_set_button() {
    let _d = document.createElement("div")
    _d.classList.add("map_config_button_set_div")

    // input
    let _i_d = document.createElement("div")
    _i_d.classList.add("map_config_button_set_input_div")

    /**
     *
     * @param {string} d_v 默认值
     * @param {string} s_t span text
     * @return {[HTMLDivElement | HTMLInputElement]}
     * @private
     */
    function _get_input(d_v, s_t) {
        let __d = document.createElement("div")
        __d.classList.add("map_config_button_set_input_input_div")

        let __i = document.createElement("input")
        __i.defaultValue = d_v
        __i.classList.add("map_config_button_set_input_input")

        let __s = document.createElement("span")
        __s.textContent = s_t

        __d.append(__s, __i)
        return [__d, __i]
    }

    let _i_x = _get_input(set_map_xy[0].toString(), "x:")
    let _i_y = _get_input(set_map_xy[1].toString(), "y:")

    _i_d.append(_i_x[0], _i_y[0])

    // r_f
    /**
     *
     * @param {HTMLInputElement} i_x
     * @param {HTMLInputElement} i_y
     * @private
     */
    function _r_f(i_x, i_y) {
        let _x = i_x.value
        let _y = i_y.value

        try {
            _x = Number(_x)
            _y = Number(_y)
            if (_x > 99 || _y > 99) {
                console.log("x or y > 99")
                return
            }
            if (_x < 5 || _y < 5) {
                console.log("x or y < 5")
                return;
            }
            set_map_xy = [_x, _y]
            buildHexMap(set_map_xy[0], set_map_xy[1], 32, 32)
        } catch (e) {
            console.log(e)
        }
    }

    // button
    let _b = document.createElement("button")
    _b.classList.add("map_config_button_set_button")
    _b.addEventListener("click", () => _r_f(_i_x[1], _i_y[1]))

    let _s = document.createElement("span")
    _s.textContent = "设置为输入值"

    _b.append(_s)

    //
    _d.append(_b, _i_d)
    m_c_button_div.append(_d)
}

function m_c_build_reset_button() {
    // 回调函数
    let _f = () => buildHexMap(set_map_xy[0], set_map_xy[1], 32, 32)

    // button本体
    let _b = document.createElement("button")
    _b.addEventListener("click", _f)

    // info
    let _s = document.createElement("span")
    _s.textContent = "重置地图"

    _b.append(_s)
    m_c_button_div.append(_b)
}
