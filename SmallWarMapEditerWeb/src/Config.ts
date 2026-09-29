/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

export const CAMP_NAME_MAP: Record<string, string> = {
    'US': '末日兵器',
    'StyleSteelTide': '钢铁洪流',
    'StyleMindbreaker': '大脑杀手',
    'StyleFlameArsenal': '火焰兵工',
    'StyleGlacialLegion': '极寒军团'
};

export const PLAYER_COLOR_LIST: (string | null)[] = [
    null,
    '#e94560',
    '#fbbf24',
    '#4ade80',
    '#38bdf8',
    '#a78bfa',
    '#f472b6',
    '#fb923c',
    '#2dd4bf'
];

export const PLAYER_TEAM_LIST: (number | null)[] = [
    null,
    1, 2, 3, 4
];

export const MAP_DEFAULT_XY: [number, number] = [30, 20];
export const MAP_MIN_XY = 5;
export const MAP_MAX_XY = 99;
export const CELL_SIZE = 32;
export const CELL_IMG_W = 32;
export const CELL_IMG_H = 48;
export const UNIT_IMG_SIZE = 32;
export const BEL_IMG_SIZE = 8;
