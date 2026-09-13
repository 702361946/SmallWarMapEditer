#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946

from fastapi import APIRouter

from models import MapData

router = APIRouter(tags=["Output"])


# 请求体内嵌入 RESTful 方式
@router.post("/json")
async def output_json_body(map_data: MapData):
    """
    通过请求体 JSON 嵌入接收地图数据并保存

    Request Body:
        application/json -> MapData
    """
    return {
        "ok": True,
        "message": "Map saved successfully",
        "data": map_data.model_dump(mode="json"),
    }
