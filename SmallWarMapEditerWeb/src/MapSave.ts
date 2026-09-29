/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

export class CellItem {
    pos: Vector2;
    cell_id: number;
    unit_id: string;
    unit_belonging: number;
    burning: boolean;
    burning_time: number;

    constructor(
        pos: Vector2 | { x: number; y: number } | [number, number],
        cell_id = 0,
        unit_id = "",
        unit_belonging = 0,
        burning = false,
        burning_time = 0
    ) {
        if (Array.isArray(pos)) {
            this.pos = new Vector2(pos[0], pos[1]);
        } else if (pos instanceof Vector2) {
            this.pos = pos;
        } else {
            this.pos = new Vector2(pos.x, pos.y);
        }
        this.cell_id = cell_id;
        this.unit_id = unit_id;
        this.unit_belonging = unit_belonging;
        this.burning = burning;
        this.burning_time = burning_time;
    }
}

export class PlayerData {
    playerNumber: number;
    team: number;
    camp: string;
    color: number;
    techPoint: number;
    unitPlayerNumber: number;
    landUnits: string[];
    skyUnits: string[];
    shipUnits: string[];
    lockTechs: string[];
    lockUnits: string[];
    lockUpgrade: string[];
    type: number;
    isActive: boolean;

    constructor(
        playerNumber: number,
        team = 0,
        camp = "US",
        color = 0,
        isActive = false
    ) {
        this.playerNumber = playerNumber;
        this.team = team;
        this.camp = camp;
        this.color = color;
        this.techPoint = 0;
        this.unitPlayerNumber = 0;
        this.landUnits = [];
        this.skyUnits = [];
        this.shipUnits = [];
        this.lockTechs = [];
        this.lockUnits = [];
        this.lockUpgrade = [];
        this.type = 0;
        this.isActive = isActive;
    }

    reset(): void {
        this.team = 0;
        this.camp = "US";
        this.color = 0;
        this.techPoint = 0;
        this.unitPlayerNumber = 0;
        this.landUnits = [];
        this.skyUnits = [];
        this.shipUnits = [];
        this.lockTechs = [];
        this.lockUnits = [];
        this.lockUpgrade = [];
        this.type = 0;
        this.isActive = false;
    }
}

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    toJSON(): { x: number; y: number } {
        return {x: this.x, y: this.y};
    }
}

export class TileData {
    type: number;
    pos: Vector2;
    burning: boolean;
    burningTime: number;

    constructor({type = 10, pos = new Vector2(0, 0), burning = false, burningTime = 0}: {
        type?: number;
        pos?: Vector2 | { x: number; y: number };
        burning?: boolean;
        burningTime?: number;
    } = {}) {
        this.type = type;
        this.pos = pos instanceof Vector2 ? pos : new Vector2(pos.x, pos.y);
        this.burning = burning;
        this.burningTime = burningTime;
    }

    toJSON() {
        return {
            type: this.type,
            pos: this.pos.toJSON(),
            burning: this.burning,
            burningTime: this.burningTime
        };
    }
}

export class EasyUnitData {
    pos: Vector2;
    PlayerNumber: number;
    unitName: string;
    tag: string;

    constructor({pos, PlayerNumber, unitName = "BASE", tag = ""} = {} as any) {
        this.pos = pos instanceof Vector2 ? pos : new Vector2(pos.x, pos.y);
        this.PlayerNumber = PlayerNumber;
        this.unitName = unitName;
        this.tag = tag;
    }

    toJSON() {
        return {
            pos: this.pos.toJSON(),
            PlayerNumber: this.PlayerNumber,
            unitName: this.unitName,
            tag: this.tag
        };
    }
}

export class EasyPlayerData {
    playerNumber: number;
    team: number;
    techPoint: number;
    camp: string;
    unitPlayerNumber: number;
    landUnits: string[];
    skyUnits: string[];
    shipUnits: string[];
    lockTechs: string[];
    lockUnits: string[];
    lockUpgrade: string[];
    type: number;
    color: number;

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
                } = {} as any) {
        this.playerNumber = playerNumber;
        this.team = team;
        this.techPoint = techPoint;
        this.camp = camp;
        this.unitPlayerNumber = unitPlayerNumber;
        this.landUnits = landUnits;
        this.skyUnits = skyUnits;
        this.shipUnits = shipUnits;
        this.lockTechs = lockTechs;
        this.lockUnits = lockUnits;
        this.lockUpgrade = lockUpgrade;
        this.type = type;
        this.color = color;
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
        };
    }

    toServerJson(): Record<string, any> {
        const t: Record<string, any> = {
            playerNumber: this.playerNumber,
            team: this.team,
            techPoint: this.techPoint,
            camp: this.camp,
            unitPlayerNumber: this.unitPlayerNumber,
            type: this.type,
            color: this.color
        };
        if (this.landUnits.length !== 0) t.landUnits = this.landUnits;
        if (this.skyUnits.length !== 0) t.skyUnits = this.skyUnits;
        if (this.shipUnits.length !== 0) t.shipUnits = this.shipUnits;
        if (this.lockTechs.length !== 0) t.lockTechs = this.lockTechs;
        if (this.lockUnits.length !== 0) t.lockUnits = this.lockUnits;
        if (this.lockUpgrade.length !== 0) t.lockUpgrade = this.lockUpgrade;
        return t;
    }
}

export class VictoryCondition {
    toJSON() {
        return {};
    }
}

export class FailureCondition {
    toJSON() {
        return {};
    }
}

export class MapData {
    width: number;
    height: number;
    type: number;
    name: string;
    size: number;
    humanPlayerNumber: number;
    selectablePlayers: number[];
    tileDataList: TileData[];
    unitData: EasyUnitData[];
    bothPlace: Vector2[];
    playerDatas: EasyPlayerData[];
    victoryConditions: VictoryCondition[];
    failureConditions: FailureCondition[];

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
                } = {} as any) {
        this.width = width;
        this.height = height;
        this.type = type;
        this.name = name;
        this.size = size;
        this.humanPlayerNumber = humanPlayerNumber;
        this.selectablePlayers = selectablePlayers;
        this.tileDataList = tileDataList.map((t: any) => t instanceof TileData ? t : new TileData(t));
        this.unitData = unitData.map((u: any) => u instanceof EasyUnitData ? u : new EasyUnitData(u));
        this.bothPlace = bothPlace.map((v: any) => v instanceof Vector2 ? v : new Vector2(v.x, v.y));
        this.playerDatas = playerDatas.map((p: any) => p instanceof EasyPlayerData ? p : new EasyPlayerData(p));
        this.victoryConditions = victoryConditions.map((v: any) => v instanceof VictoryCondition ? v : new VictoryCondition());
        this.failureConditions = failureConditions.map((f: any) => f instanceof FailureCondition ? f : new FailureCondition());
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
        };
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
        };
    }
}

let _hexMap: CellItem[][] = [];

export function setHexMap(map: CellItem[][]): void {
    _hexMap = map;
}

export function getHexMap(): CellItem[][] {
    return _hexMap;
}
