#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946
from pathlib import Path

from PIL import Image

from .file_path import PathData


class ImageProcessor:
    path_data: type[PathData]

    @classmethod
    def __init__(cls, path_data: type[PathData]):
        cls.path_data = path_data

    @classmethod
    def get_image(cls, path: Path | str) -> Image.Image | None:
        fp = cls.path_data.image_dir / path
        return Image.open(fp)

    @classmethod
    def get_id_cell_image(cls, _id: int):
        fp = cls.path_data.cell_image_dir / "id" / f"{_id}.png"
        return Image.open(fp)
