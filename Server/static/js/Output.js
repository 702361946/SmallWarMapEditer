/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

const output_button_div = document.getElementById(
    "output_button_div"
)

function build_output_all_button() {
    // gmap
    build_output_button("导出为gmap", () => output("gmap"))
    // json
    build_output_button("导出为json", () => output("json"))
}

function build_output_button(text, r_func) {
    const b = document.createElement("button")
    b.addEventListener("click", r_func)
    b.classList.add("output_button_button")
    const s = document.createElement("span")
    s.textContent = text
    s.classList.add("output_button_span")
    b.append(s)
    output_button_div.append(b)
}

async function output(_type = "gmap") {
    // 玩家部分
    let o_player_data = []
    let o_player_selectable_players = []
    for (let i of playerDataList) {
        if (i.isActive) {
            o_player_selectable_players.push(i.playerNumber)
        }
        o_player_data.push(o_player_func(i))
    }
    if (o_player_selectable_players.length < 2) {
        o_player_selectable_players = [1, 2]
    }

    // 格子部分
    let o_map_editor_cell_data = []
    let o_map_editor_unit_data = []
    let w = _hex_map.length
    if (w === 0) {
        // 检查内容
        return
    }
    let h = _hex_map[0].length
    if (h === 0) {
        return
    }
    for (let i of _hex_map) {
        for (let _i of i) {
            o_map_editor_cell_data.push(o_map_editor_cell_func(_i))
            let _u = o_map_editor_unit_func(_i)
            if (_u !== null) {
                o_map_editor_unit_data.push(_u)
            }
        }
    }

    // 填充
    let _map_data = new MapData({
        width: w,
        height: h,
        name: "WebMapEditorOutputMap",
        playerDatas: o_player_data,
        tileDataList: o_map_editor_cell_data,
        selectablePlayers: o_player_selectable_players,
        unitData: o_map_editor_unit_data
    })

    // 格式化
    let _json = map_data_to_server_json(_map_data)

    // 送后端校验
    try {
        const response = await fetch(
            '/Game/SmallWar/MapEditor/Output/json',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: _json
            }
        );

        if (!response.ok) {
            return;
        }
        _json = await response.json()
    } catch (e) {
        console.log(e)
    }

    _json = JSON.stringify(_json["data"])

    // 前端下载
    let blob = new Blob([_json], {type: "application/json"})
    output_download(blob, _type)
}

// /**
//  *
//  * @param {MapData} map_data
//  */
// function map_data_to_json(map_data) {
//     return JSON.stringify(map_data.toJSON())
// }

/**
 *
 * @param {MapData} map_data
 */
function map_data_to_server_json(map_data) {
    return JSON.stringify(map_data.toServerJson())
}

/**
 *
 * @param {Blob} blob
 * @param {string} _type
 */
function output_download(blob, _type = "gmap") {
    let url = URL.createObjectURL(blob)
    let a = document.createElement("a")
    a.href = url
    a.download = `map.${_type}`
    a.click()
    URL.revokeObjectURL(url)
}

/**
 *
 * @param {PlayerData} player_data
 */
function o_player_func(player_data) {
    if (!player_data.isActive) {
        player_data.reset()
    }
    return new EasyPlayerData({
        playerNumber: player_data.playerNumber,
        team: player_data.team,
        techPoint: player_data.techPoint,
        camp: player_data.camp,
        unitPlayerNumber: player_data.unitPlayerNumber,
        landUnits: player_data.landUnits,
        skyUnits: player_data.skyUnits,
        shipUnits: player_data.shipUnits,
        lockTechs: player_data.lockTechs,
        lockUnits: player_data.lockUnits,
        lockUpgrade: player_data.lockUpgrade,
        type: player_data.type,
        color: player_data.color
    });
}

/**
 *
 * @param {CellItem} cell_data
 */
function o_map_editor_cell_func(cell_data) {
    return new TileData({
        type: cell_data.cell_id,
        pos: new Vector2(cell_data.pos[0], cell_data.pos[1]),
        burning: cell_data.burning,
        burningTime: cell_data.burning_time
    })
}

/**
 *
 * @param {CellItem} cell_data
 * @return
 */
function o_map_editor_unit_func(cell_data) {
    if (cell_data.unit_id === "") return null
    return new EasyUnitData(
        {
            pos: new Vector2(cell_data.pos[0], cell_data.pos[1]),
            PlayerNumber: cell_data.unit_belonging,
            unitName: cell_data.unit_id
        }
    )
}

// 结构类
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x
        this.y = y
    }

    toJSON() {
        return {x: this.x, y: this.y}
    }
}

class TileData {
    constructor({type = 10, pos = new Vector2(0, 0), burning = false, burningTime = 0} = {}) {
        this.type = type
        this.pos = pos instanceof Vector2 ? pos : new Vector2(pos.x, pos.y)
        this.burning = burning
        this.burningTime = burningTime
    }

    toJSON() {
        return {
            type: this.type,
            pos: this.pos.toJSON(),
            burning: this.burning,
            burningTime: this.burningTime
        }
    }
}

class EasyUnitData {
    constructor({pos, PlayerNumber, unitName = "BASE", tag = ""} = {}) {
        this.pos = pos instanceof Vector2 ? pos : new Vector2(pos.x, pos.y)
        this.PlayerNumber = PlayerNumber
        this.unitName = unitName
        this.tag = tag
    }

    toJSON() {
        return {
            pos: this.pos.toJSON(),
            PlayerNumber: this.PlayerNumber,
            unitName: this.unitName,
            tag: this.tag
        }
    }
}

class EasyPlayerData {
    constructor({
                    playerNumber,
                    team = 0,
                    techPoint = 0,
                    camp = "US",
                    unitPlayerNumber = 0,
                    landUnits = [],
                    skyUnits = [],
                    shipUnits = [],
                    lockTechs = [],
                    lockUnits = [],
                    lockUpgrade = [],
                    type = 0,
                    color = 0
                } = {}) {
        this.playerNumber = playerNumber
        this.team = team
        this.techPoint = techPoint
        this.camp = camp
        this.unitPlayerNumber = unitPlayerNumber
        this.landUnits = landUnits
        this.skyUnits = skyUnits
        this.shipUnits = shipUnits
        this.lockTechs = lockTechs
        this.lockUnits = lockUnits
        this.lockUpgrade = lockUpgrade
        this.type = type
        this.color = color
    }

    toJSON() {
        return {
            playerNumber: this.playerNumber,
            team: this.team,
            techPoint: this.techPoint,
            camp: this.camp,
            unitPlayerNumber: this.unitPlayerNumber,
            landUnits: this.landUnits,
            skyUnits: this.skyUnits,
            shipUnits: this.shipUnits,
            lockTechs: this.lockTechs,
            lockUnits: this.lockUnits,
            lockUpgrade: this.lockUpgrade,
            type: this.type,
            color: this.color
        }
    }

    toServerJson() {
        let t = {
            playerNumber: this.playerNumber,
            team: this.team,
            techPoint: this.techPoint,
            camp: this.camp,
            unitPlayerNumber: this.unitPlayerNumber,
            type: this.type,
            color: this.color
        }
        if (this.landUnits.length !== 0) {
            t.landUnits = this.landUnits
        }
        if (this.skyUnits.length !== 0) {
            t.skyUnits = this.skyUnits
        }
        if (this.shipUnits.length !== 0) {
            t.shipUnits = this.shipUnits
        }
        if (this.lockTechs.length !== 0) {
            t.lockTechs = this.lockTechs
        }
        if (this.lockUnits.length !== 0) {
            t.lockUnits = this.lockUnits
        }
        if (this.lockUpgrade.length !== 0) {
            t.lockUpgrade = this.lockUpgrade
        }
        return t
    }
}

class VictoryCondition {
    toJSON() {
        return {}
    }
}

class FailureCondition {
    toJSON() {
        return {}
    }
}

class MapData {
    constructor({
                    width = 21,
                    height = 15,
                    type = 1,
                    name = "unnamed",
                    size = 0,
                    humanPlayerNumber = 1,
                    selectablePlayers = [],
                    tileDataList = [],
                    unitData = [],
                    bothPlace = Array.from({length: 9}, () => new Vector2(255, 255)),
                    playerDatas,
                    victoryConditions = [],
                    failureConditions = []
                } = {}) {
        this.width = width
        this.height = height
        this.type = type
        this.name = name
        this.size = size
        this.humanPlayerNumber = humanPlayerNumber
        this.selectablePlayers = selectablePlayers
        this.tileDataList = tileDataList.map(t => t instanceof TileData ? t : new TileData(t))
        this.unitData = unitData.map(u => u instanceof EasyUnitData ? u : new EasyUnitData(u))
        this.bothPlace = bothPlace.map(v => v instanceof Vector2 ? v : new Vector2(v.x, v.y))
        this.playerDatas = playerDatas.map(p => p instanceof EasyPlayerData ? p : new EasyPlayerData(p))
        this.victoryConditions = victoryConditions.map(v => v instanceof VictoryCondition ? v : new VictoryCondition())
        this.failureConditions = failureConditions.map(f => f instanceof FailureCondition ? f : new FailureCondition())
    }

    toJSON() {
        return {
            width: this.width,
            height: this.height,
            type: this.type,
            name: this.name,
            size: this.size,
            humanPlayerNumber: this.humanPlayerNumber,
            selectablePlayers: this.selectablePlayers,
            tileDataList: this.tileDataList.map(t => t.toJSON()),
            unitData: this.unitData.map(u => u.toJSON()),
            bothPlace: this.bothPlace.map(v => v.toJSON()),
            playerDatas: this.playerDatas.map(p => p.toJSON()),
            victoryConditions: this.victoryConditions.map(v => v.toJSON()),
            failureConditions: this.failureConditions.map(f => f.toJSON())
        }
    }

    toServerJson() {
        return {
            width: this.width,
            height: this.height,
            type: this.type,
            name: this.name,
            size: this.size,
            humanPlayerNumber: this.humanPlayerNumber,
            selectablePlayers: this.selectablePlayers,
            tileDataList: this.tileDataList.map(t => t.toJSON()),
            unitData: this.unitData.map(u => u.toJSON()),
            bothPlace: this.bothPlace.map(v => v.toJSON()),
            playerDatas: this.playerDatas.map(p => p.toServerJson()),
            victoryConditions: this.victoryConditions.map(v => v.toJSON()),
            failureConditions: this.failureConditions.map(f => f.toJSON())
        }
    }
}
