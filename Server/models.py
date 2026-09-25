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
    command: object = Field(default={"type": 0, "pos": {"x": 0.0, "y": 0.0}, "tag": ""})


class EventItem(BaseModel):
    pass


class EasyPlayerData(BaseModel):
    playerNumber: int
    team: int = Field(default=0)
    techPoint: int = Field(default=0)
    camp: str = Field(default="US")
    unitPlayerNumber: int = Field(default=0)
    landUnits: list[str] = Field(default_factory=lambda: list())
    skyUnits: list[str] = Field(default_factory=lambda: list())
    shipUnits: list[str] = Field(default_factory=lambda: list())
    lockTechs: list[str] = Field(default_factory=lambda: list())
    lockUnits: list[str] = Field(default_factory=lambda: list())
    lockUpgrade: list[str] = Field(default_factory=lambda: list())
    type: int = Field(default=0)
    color: int = Field(default=0)

    @field_validator("landUnits")
    @classmethod
    def validate_land_units(cls, v):
        return v


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
    playerDatas: list[EasyPlayerData]
    humanPlayerNumber: int = 1
    selectablePlayers: list[int] = []
    tileDataList: list[TileData] = []
    unitData: list[EasyUnitData] = []
    bothPlace: list[Vector2] = Field(default_factory=lambda: [Vector2(x=255, y=255)] * 9)
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
