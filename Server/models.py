"""
结构声明 - Pydantic 数据模型
Small War 地图数据结构规范
"""

from typing import List
from pydantic import BaseModel, Field, field_validator


# ── 核心数据结构 ──

class Vector2(BaseModel):
    x: float = 0.0
    y: float = 0.0


class Command(BaseModel):
    type: int = 0
    pos: Vector2 = Field(default_factory=Vector2)
    tag: str = ""


class TileData(BaseModel):
    type: int = 10
    pos: Vector2 = Field(default_factory=Vector2)
    burning: bool = False
    burningTime: int = 0


class EasyUnitData(BaseModel):
    pos: Vector2 = Field(default_factory=Vector2)
    unitName: str = ""
    PlayerNumber: int = 1
    tag: str = ""
    command: Command = Field(default_factory=Command)


class EasyPlayerData(BaseModel):
    playerNumber: int = 0
    team: int = 0
    money: int = 1000
    techPoint: int = 0
    camp: str = "US"
    unitPlayerNumber: int = 0
    landUnits: List[str] = Field(default_factory=list)
    skyUnits: List[str] = Field(default_factory=list)
    shipUnits: List[str] = Field(default_factory=list)
    lockTechs: List[str] = Field(default_factory=list)
    lockUnits: List[str] = Field(default_factory=list)
    lockUpgrade: List[str] = Field(default_factory=list)
    type: int = 1
    color: int = 0


class VictoryCondition(BaseModel):
    condition: int = 0
    arg1: str = ""
    arg2: str = ""
    pos: Vector2 = Field(default_factory=Vector2)


class FailureCondition(BaseModel):
    condition: int = 0
    arg1: str = ""
    arg2: str = ""
    pos: Vector2 = Field(default_factory=Vector2)


class MapData(BaseModel):
    width: int = 21
    height: int = 15
    type: int = 1
    name: str = "unnamed"
    size: int = 0
    selectablePlayers: List[int] = Field(default_factory=lambda: [1, 2])
    tileDataList: List[TileData] = Field(default_factory=list)
    unitData: List[EasyUnitData] = Field(default_factory=list)
    bothPlace: List[Vector2] = Field(default_factory=list)
    playerDatas: List[EasyPlayerData] = Field(default_factory=list)
    humanPlayerNumber: int = 1
    victoryConditions: List[VictoryCondition] = Field(default_factory=list)
    failureConditions: List[FailureCondition] = Field(default_factory=list)

    @field_validator("tileDataList")
    @classmethod
    def validate_tile_count(cls, v, info):
        data = info.data
        if "width" in data and "height" in data:
            expected = data["width"] * data["height"]
            if len(v) != expected:
                raise ValueError(f"tileDataList length {len(v)} != width*height={expected}")
        return v

    @field_validator("bothPlace")
    @classmethod
    def validate_both_place(cls, v, info):
        data = info.data
        if "playerDatas" in data:
            expected = len(data["playerDatas"])
            if len(v) != expected:
                raise ValueError(f"bothPlace length {len(v)} != playerDatas length {expected}")
        return v


# ── API 请求模型 ──

class MirrorRequest(BaseModel):
    mirror_type: str = "horizontal"


# ── API 响应模型 ──

class CellTypeInfo(BaseModel):
    id: int
    name: str
    groundType: int
    moveCost: float
    money: bool
    notBuilding: bool
    color: str


class ConfigResponse(BaseModel):
    cell_types: List[CellTypeInfo]
    camps: dict
    map_types: dict
    command_types: dict
    victory_conditions: dict
    failure_conditions: dict
    player_colors: List[str]
    unit_types: List[str]
