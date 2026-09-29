/*
 * Copyright (c) 2026.
 * @702361946
 * 702361946@qq.com
 * https://github.com/702361946
 */

import {defineConfig} from "vite";

export default defineConfig({
    server: {
        proxy: {
            "/Game/SmallWar/MapEditor": {
                target: "http://localhost:65000",
                changeOrigin: true,
            },
        },
    },
});
