/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import "./index.css";

import {CELL_SIZE, MAP_DEFAULT_XY} from "./Config";
import buildHexMap from "./MapEditor/MapEditor";
import {BTUIRegister} from "./LTool/BrushTab/BTUIRegister";
import {BrushTab} from "./LTool/BrushTab/BrushTab";
import {BrushRangeTab} from "./LTool/BrushRangeTab/BrushRangeTab";
import {LToolPlayer} from "./LTool/LToolPlayer";
import {LToolMapConfig} from "./LTool/LToolMapConfig";
import {Output} from "./Output";

// 初始化地图编辑器
buildHexMap(MAP_DEFAULT_XY[0], MAP_DEFAULT_XY[1], CELL_SIZE, CELL_SIZE);

// 初始化范围笔刷设置
new BrushRangeTab("brush_range_options_div");

// 初始化刷子选项
const brushTab = new BrushTab("brush_options_table_div");
const btuiRegister = new BTUIRegister("brush_options_switch_div");
btuiRegister.buildAllSwitchButton({
    cell: () => brushTab.loadCellList(),
    unit: () => brushTab.loadUnitList(),
    belonging: () => brushTab.loadBelongingList()
});
brushTab.loadCellList().then();

// 初始化玩家配置
const lToolPlayer = new LToolPlayer("player_list");
(window as any)._lToolPlayer = lToolPlayer;
(window as any).addPlayer = () => lToolPlayer.addPlayer();
(window as any).removePlayer = () => lToolPlayer.removePlayer();
lToolPlayer.addPlayer();
(window as any)._playerDataList = lToolPlayer.playerDataList;

// 初始化地图配置
const lToolMapConfig = new LToolMapConfig("map_config_information_xy_span", "map_config_button_div");
lToolMapConfig.buildAllButton();

// 初始化导出按钮
const output = new Output("output_button_div");
output.buildAllButton();
