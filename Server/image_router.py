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

from file_processing import ImageProcessor, PathData

# ImageProcessor(PathData)

router = APIRouter(tags=["Image"])

@router.get("/cell/{cell_id}")
def get_cell_image(cell_id: int):
    """获取地形类型图标 PNG"""
    image = ImageProcessor.get_id_cell_image(cell_id)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="image/png")

@router.get("/{filepath:path}")
def get_static_image(filepath: str):
    """获取静态图片资源"""
    image = ImageProcessor.get_image(filepath)
    if image is None:
        raise HTTPException(status_code=404, detail="File not found")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return Response(content=buffer.getvalue(), media_type="image/png")
