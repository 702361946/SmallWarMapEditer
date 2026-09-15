#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946
from pydantic import BaseModel, Field, field_validator


# 通用模型
class Vector2(BaseModel):
    x: float = 0.0
    y: float = 0.0


# api获取
class CellData(BaseModel):
    id: int = 0
    name: str = ""
    groundType: int = 0
    money: bool = False
    moveCost: float = 1.0
    notBuilding: bool = False


class CellMapping(BaseModel):
    # 中文名: CellData
    cell_mapping: dict[str, CellData] = {}


class CellImage(BaseModel):
    image: bytes


# api返回
class TileData(BaseModel):
    type: int = 10
    pos: Vector2 = Vector2(x=0, y=0)
    burning: bool = False
    burningTime: int = 0

class EasyUnitData(BaseModel):
    pos: Vector2
    PlayerNumber: int
    unitName: str = "BASE"  # unit id
    tag: str = ""
    # command: object = None # 暂时不提供


class EventItem(BaseModel):
    pass

class EasyPlayerData(BaseModel):
    playerNumber: int
    team: int = 0
    techPoint: int = 0
    camp: str = "US"
    unitPlayerNumber: int = 0
    landUnits: list[str] = []
    skyUnits: list[str] = []
    shipUnits: list[str] = []
    lockTechs: list[str] = []
    lockUnits: list[str] = []
    lockUpgrade: list[str] = []
    type: int = 0
    color: int = 0

class VictoryCondition(BaseModel):
    pass

class FailureCondition(BaseModel):
    pass

class MapData(BaseModel):
    width: int = 21
    height: int = 15
    type: int = 1
    name: str = "unnamed"
    size: int = 0
    humanPlayerNumber: int = 1
    selectablePlayers: list[int] = []
    tileDataList: list[TileData] = []
    unitData: list[EasyUnitData] = []
    bothPlace: list[Vector2] = Field(default_factory=lambda: [Vector2(x=255, y=255)] * 9)
    playerDatas: list[EasyPlayerData]
    # events: list[EventItem] # 暂不提供
    victoryConditions: list[VictoryCondition] = []
    failureConditions: list[FailureCondition] = []

    @field_validator("tileDataList")
    @classmethod
    def validate_tile_count(cls, v, info):
        data = info.data
        width = data.get("width")
        height = data.get("height")
        if width is None or height is None:
            raise ValueError("tileDataList must have 'width' and 'height'")
        expected = width * height
        if len(v) != expected:
            raise ValueError(f"tileDataList length {len(v)} != width*height={expected}")
        return v

    @field_validator("bothPlace")
    @classmethod
    def validate_both_place_count(cls, v):
        if len(v) != 9:
            raise ValueError("bothPlace must have 'x' and 'y'")
        return v
