"""
回调模块 - 地图编辑器 API 路由
前端持有完整状态，后端仅做: 配置提供、数据校验、镜像计算、导出
"""

#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946

from fastapi import APIRouter, HTTPException

from config import GameParameter

router = APIRouter(tags=["config"])

@router.get("/{config_name}")
def get_config(config_name: str):
    match config_name:
        case "CellMapping":
            return get_config_cell_mapping()
        case "UnitMapping":
            return get_config_unit_mapping()
        case _:
            raise HTTPException(404, f"Not Config {config_name}")

def get_config_cell_mapping():
    return GameParameter.cell_mapping


def get_config_unit_mapping():
    return GameParameter.unit_mapping
