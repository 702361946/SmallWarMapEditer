#  Copyright (c) 2026.
#  @702361946
#  702361946@qq.com
#  https://github.com/702361946

from pathlib import Path

class PathData:
    image_dir: Path
    cell_image_dir: Path
    unit_image_dir: Path

    @classmethod
    def __init__(cls, image_dir, cell_image_dir, unit_image_dir):
        cls.image_dir = image_dir
        cls.cell_image_dir = cell_image_dir
        cls.unit_image_dir = unit_image_dir
        cls.image_dir.mkdir(parents=True, exist_ok=True)
        cls.cell_image_dir.mkdir(parents=True, exist_ok=True)
        cls.unit_image_dir.mkdir(parents=True, exist_ok=True)

    @classmethod
    def get_image_path(cls, image_name: str):
        return cls.image_dir / image_name

    @classmethod
    def get_cell_image_path(cls, image_name: str):
        return cls.cell_image_dir / image_name

    @classmethod
    def get_unit_image_path(cls, image_name: str):
        return cls.unit_image_dir / image_name
