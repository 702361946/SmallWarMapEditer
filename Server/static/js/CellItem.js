/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

class CellItem {
    pos
    cell_id = 0
    unit_id = ""
    unit_belonging = 0
    burning = false
    burning_time = 0

    constructor(
        pos,
        cell_id = 0,
        unit_id = "",
        unit_belonging = 0,
        burning = false,
        burning_time = 0
    ) {
        if (pos.length !== 2) return
        if (!cell_id in all_cell_id) cell_id = 0
        if (unit_belonging > 8) unit_belonging = 0
        if (burning_time <= 0) {
            burning = false
            burning_time = 0
        }

        this.pos = pos
        this.cell_id = cell_id
        this.unit_id = unit_id
        this.unit_belonging = unit_belonging
        this.burning = burning
        this.burning_time = burning_time
    }
}

