#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946
from pathlib import Path

from PIL import Image
from PIL.ImageFile import ImageFile

from .file_path import PathData


class ImageProcessor:
    _c = {}

    @classmethod
    def _load_tool(cls, fp: Path) -> ImageFile:
        if fp in cls._c.keys():
            return cls._c[fp]
        i = Image.open(fp)
        cls._c[fp] = i
        return i

    @classmethod
    def get_image(cls, path: Path | str) -> ImageFile | None:
        fp = PathData.image_dir / path
        return cls._load_tool(fp)

    @classmethod
    def get_id_cell_image(cls, _id: str):
        fp = PathData.cell_image_dir / "id" / f"{_id}.png"
        return cls._load_tool(fp)

    @classmethod
    def get_id_unit_image(cls, _id: str):
        fp = PathData.unit_image_dir / "id" / f"{_id}.png"
        return cls._load_tool(fp)

    @classmethod
    def get_belonging_image(cls, _id: str):
        fp = PathData.belonging_image_dir / f"{_id}.png"
        return cls._load_tool(fp)
