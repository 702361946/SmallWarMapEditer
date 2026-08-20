"""
Small War 网页地图编辑器 - FastAPI 主入口
Python 3.12+ | FastAPI

路由结构:
  api.xxx.com/Game/SmallWar/MapEditor/Config   -> 全量配置
  api.xxx.com/Game/SmallWar/MapEditor/Image/*  -> 图片服务
  api.xxx.com/Game/SmallWar/MapEditor/*        -> 地图API
  xxx.com/Game/SmallWar/MapEditor              -> 前端入口 (HTML)
"""

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from routes import router as config_router
from Server.routes.image_routes import router as image_router

# ── FastAPI 应用 ──
app = FastAPI(
    title="Small War 地图编辑器",
    description="基于 FastAPI 的网页地图编辑器后端",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 注册器: 路由注册 ──

# 地图API: /Game/SmallWar/MapEditor/*
app.include_router(config_router, prefix="/Game/SmallWar/MapEditor/Config")

# 图片服务: /Game/SmallWar/MapEditor/Image/*
app.include_router(image_router, prefix="/Game/SmallWar/MapEditor/Image")

# 静态文件: /Game/SmallWar/MapEditor/*
BASE_DIR = Path(__file__).parent.resolve()
STATIC_DIR = BASE_DIR / "static"
STATIC_DIR.mkdir(parents=True, exist_ok=True)
app.mount(
    "/Game/SmallWar/MapEditor",
    StaticFiles(directory=str(STATIC_DIR), html=True),
    name="static"
)

# ── 入口 ──
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=65000, reload=True)
