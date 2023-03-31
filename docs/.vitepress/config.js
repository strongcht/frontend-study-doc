import { defineConfig } from 'vitepress';

export default defineConfig({
	base: '/doc/', // 根据部署的位置修改base 比如在服务器中的 nginx/html/doc 目录下 则base应为 /doc/  若在nginx/html下  则为 /
	// base: '/', 
	lastUpdated: true,
	title: 'CHT  frontend-study', // 站点的标题 并显示在导航栏中。
	description: '自定义的 description', // 站点的描述  这将作为<meta>标记渲染在页面HTML中。
	head: [['meta', { name: 'keywords', content: 'HTML, CSS, JavaScript, Vue, ES6' }]],
	themeConfig: {
		logo: '/pubilc/logo.jpg',
		lastUpdatedText: "最近更新时间",
		// 导航栏配置
		nav: [
			{ text: '每日笔记', link: '/notes/'},
			{ text: '学习笔记', link: '/study/'},
		],
		// 侧边栏配置
		sidebar: {
			'/study/': [{
					text: 'vue学习笔记',
					items: [
						{ text: 'vue2', link: '/study/vue/vue2' },
						{ text: 'vue3', link: '/study/vue/vue3' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}, {
					text: 'javaScript',
					items: [
						{ text: 'ES6', link: '/study/javaScript/ES6' }
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}, {
					text: 'CSS学习笔记',
					items: [
						{ text: 'grid布局', link: '/study/css/grid' },
						{ text: 'css3', link: '/study/css/css3' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}, {
					text: 'mapboxgl学习笔记',
					items: [
						{ text: 'mapboxgl', link: '/study/mapboxgl/API' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}, {
					text: '其他学习',
					items: [
						{ text: 'linux部署', link: '/study/other/linux' },
						{ text: 'Git指令', link: '/study/other/git' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				},
			],
			'/notes/': [
				{
					text: 'notes',
					items: [
						{ text: 'days', link: '/notes/days' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}
			],
		},
		// 社交链接
		socialLinks: [{ icon: "github", link: "https://github.com/chenhongtao-cht/frontend-study-doc.git" }],
		// 上下翻页
		// docFooter: { prev: '上一篇', next: '下一篇' },
		// 页脚
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2019-present Evan You'
		},
		markdown: {
			// 显示行号
			// lineNumbers: true,
			// options for markdown-it-anchor
			anchor: { permalink: false },

			// options for markdown-it-toc
			toc: { includeLevel: [1, 2] },

			config: (md) => {
			// use more markdown-it plugins!
			md.use(require('markdown-it-xxx'))
			}
		}
	}
});