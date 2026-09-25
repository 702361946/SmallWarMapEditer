"""
回调模块 - 图片服务路由
地形图标生成、静态图片服务
"""
#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946

from io import BytesIO

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from file_processing import ImageProcessor  # , PathData

# ImageProcessor(PathData)

router = APIRouter(tags=["Image"])


@router.get("/match/{case_string}")
def get_case_image(case_string: str):
    _p = None
    match case_string:
        case "clear":
            _p = "Unit/clear.png"
        case _:
            raise HTTPException(404)

    if _p is None:
        raise HTTPException(404)

    image = ImageProcessor.get_image(_p)
    if image is None:
        raise HTTPException(404)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="image/png")

@router.get("/cell/{cell_id}")
def get_cell_image(cell_id: str):
    """获取地形类型图标 PNG"""
    image = ImageProcessor.get_id_cell_image(cell_id)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="image/png")


@router.get("/unit/{unit_id}")
def get_unit_image(unit_id: str):
    image = ImageProcessor.get_id_unit_image(unit_id)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="image/png")
