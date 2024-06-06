//vite.config.js
import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";
import flexSearchIndexOptions from "flexsearch";
import path from 'path';
//default options
const options = {
    ...flexSearchIndexOptions,
    previewLength: 100, //搜索结果预览长度
    buttonLabel: "搜索",
    placeholder: "请输入关键词",
};

export default defineConfig({
    plugins: [SearchPlugin(options)],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
    server: {
        port: 8989,
    },
    ignoreDeadLinks: true
});

