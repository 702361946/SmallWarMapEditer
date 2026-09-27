/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

let on_belonging = 0

function b_o_b_load_belonging_list() {
    let b = createBelongingButton(
        0,
        "clear",
        "clear",
        "/Game/SmallWar/MapEditor/Image/match/clear"
    )
    b_o_t_append_to_div(b)

    for (let i = 1; i <= 8; i++) {
        let b = createBelongingButton(i)
        b_o_t_append_to_div(b)
    }
}

function createBelongingButton(bel, _title = "", s_t = "", img_url = "") {
    if (_title === "") {
        _title = `${bel}`
    }
    if (img_url === "") {
        img_url = `/Game/SmallWar/MapEditor/Image/belonging/${bel}`
    }
    if (s_t === "") {
        s_t = `玩家${bel}`
    }

    return b_o_t_get_grid_block(
        img_url,
        s_t,
        _title,
        () => onBelongingSelected(bel)
    )
}

/**
 *
 * @param {number} bel
 */
function onBelongingSelected(bel) {
    on_belonging = bel
}
