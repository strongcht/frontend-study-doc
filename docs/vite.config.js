//vite.config.js
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";
import flexSearchIndexOptions from "flexsearch";
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path';
//default options
const options = {
    ...flexSearchIndexOptions,
    previewLength: 100, //搜索结果预览长度
    buttonLabel: "搜索",
    placeholder: "请输入关键词",
};

export default defineConfig({
    plugins: [SearchPlugin(options), vueJsx()],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    server: {
        port: 8989,
        host: '0.0.0.0'
    },
    ignoreDeadLinks: true
});

