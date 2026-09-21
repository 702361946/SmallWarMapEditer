"""
配置加载模块
路径: Server/Config/
"""

#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946

from pathlib import Path
from file_processing import PathData
from dependency.modules._file_operations import Json


# 路径
class PathConfig:
    base_dir = Path(__file__).parent.resolve()
    config_dir = base_dir / "Config"

    @classmethod
    def init_mkdir(cls):
        cls.config_dir.mkdir(parents=True, exist_ok=True)


PathConfig.init_mkdir()

json = Json(file_save_path=str(PathConfig.config_dir))

_p = PathConfig.base_dir / "Files" / "Image"
PathData(image_dir=_p, cell_image_dir=_p / "Cell", unit_image_dir=_p / "Unit")


# 固定参
class GameFixedParameter:
    camps: dict[str, str] = {
        "US": "末日兵器",
        "StyleSteelTide": "钢铁洪流",
        "StyleMindbreaker": "大脑杀手",
        "StyleFlameArsenal": "火焰兵工",
        "StyleGlacialLegion": "极寒军团",
    }
    map_types: dict[int, str] = {
        0: "Random (完全随机)",
        1: "Continent (大陆型)",
        2: "LargeIslands (大岛屿)",
        3: "Archipelago (群岛)",
        4: "Lakes (湖泊型)",
        5: "Plains (平原型)",
        6: "Fjord (峡湾型)",
        7: "River (河流型)",
        8: "TwoContinents (双大陆)",
        9: "Maze (迷宫型)",
    }
    # 胜利条件
    victory_conditions: dict[int, str] = {
        0: "DestroyAllEnemyPlayers (消灭所有敌方)",
        1: "DestroyOnePlayer (消灭任一玩家)",
        2: "DestroyTargetUnit (摧毁目标单位)",
        3: "StickTo (坚守至指定回合)",
        4: "UnitMoveTo (单位移动至目标)",
    }
    # 失败条件
    failure_conditions: dict[int, str] = {
        0: "DestroyAllFriendlyPlayers (所有友方被消灭)",
        1: "DestroyOnePlayer (任一友方被消灭)",
        2: "DestroyTargetUnit (目标单位被摧毁)",
        3: "StickTo (未坚守至指定回合)",
        4: "UnitMoveTo (单位未移动至目标)",
    }

    player_colors: list[str] = [
        "#FF4444", "#4488FF", "#44FF44", "#FFAA00",
        "#FF44FF", "#00FFFF", "#FFFF44", "#888888",
    ]

class GameParameter(GameFixedParameter):
    cell_mapping: dict[str, str | int | float | bool]
    unit_mapping: dict[str, str | int | float | bool]

    @classmethod
    def __init__(cls):
        cm = json.load("CellMapping")
        um = json.load("UnitMapping")
        if not cm.ok:
            raise FileNotFoundError("Cell mapping file not found.")
        if not um.ok:
            raise FileNotFoundError("Unit mapping file not found.")
        cls.cell_mapping = cm.get()
        cls.unit_mapping = um.get()

GameParameter()


