#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946
from pathlib import Path

from PIL import Image

from .file_path import PathData


class ImageProcessor:
    @classmethod
    def get_image(cls, path: Path | str) -> Image.Image | None:
        fp = PathData.image_dir / path
        return Image.open(fp)

    @classmethod
    def get_id_cell_image(cls, _id: str):
        fp = PathData.cell_image_dir / "id" / f"{_id}.png"
        return Image.open(fp)

    @classmethod
    def get_id_unit_image(cls, _id: str):
        fp = PathData.unit_image_dir / "id" / f"{_id}.png"
        return Image.open(fp)
