/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

export const BASE_URL = '/Game/SmallWar/MapEditor';

export const URLS = {
    image: {
        cell: (id: number): string => `${BASE_URL}/Image/cell/${encodeURIComponent(id)}`,
        unit: (id: string): string => `${BASE_URL}/Image/unit/${encodeURIComponent(id)}`,
        belonging: (bel: number): string => `${BASE_URL}/Image/belonging/${bel}`,
        match: {
            clear: `${BASE_URL}/Image/match/clear`
        }
    },
    config: {
        cellMapping: `${BASE_URL}/Config/CellMapping`,
        unitMapping: `${BASE_URL}/Config/UnitMapping`
    },
    output: {
        json: `${BASE_URL}/Output/json`
    }
} as const;
