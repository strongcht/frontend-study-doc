import { defineConfig } from 'vitepress';
const leetcodeConfig = [{

	text: "第一章 序章",
	items: [
		{
			text: "1.4 学习计划",
			link: "/leetcode/outline/plan/README.md",
		},
		{
			text: "1.5 题解标签",
			link: "/leetcode/outline/tag/README.md",
		},
	],
	collapsible: true, // 菜单是否为可折叠的
	collapsed: true // 是否默认折叠 
},
{
	text: "第二章 数据结构",
	link: "/leetcode/ds/README.md",
	items: [
		{ text: '2.1 数组', link: '/leetcode/ds/array.md' },
		{ text: '2.2 链表', link: '/leetcode/ds/linked_list.md' },
		{ text: '2.3 栈', link: '/leetcode/ds/stack.md' },
		{ text: '2.4 队列', link: '/leetcode/ds/queue.md' },
		{ text: '2.5 哈希表', link: '/leetcode/ds/hash_table.md' },
		{ text: '2.6 树', link: '/leetcode/ds/tree.md' },
		{ text: '2.7 堆', link: '/leetcode/ds/heap.md' },
		{ text: '2.8 图', link: '/leetcode/ds/graph.md' },
		{ text: '2.9 字符串', link: '/leetcode/ds/string.md' },
	],
	collapsible: true,
	collapsed: true
},
{
	text: "第三章 算法",
	link: "/leetcode/algorithm/README.md",
	items: [
		{
			text: "3.1 枚举算法",
			link: "/leetcode/algorithm/enumeration.md"
		},
		{
			text: "3.2 递归算法",
			link: "/leetcode/algorithm/recursion.md"
		},
		{
			text: "3.3 分治算法",
			link: "/leetcode/algorithm/divide_conquer.md"
		},
		{
			text: "3.4 回溯算法",
			link: "/leetcode/algorithm/backtracking.md"
		},
		{
			text: "3.5 贪心算法",
			link: "/leetcode/algorithm/greed.md"
		},
		{
			text: "3.6 动态规划",
			link: "/leetcode/algorithm/dynamic_programming.md"
		},
		{
			text: "3.7 位运算",
			link: "/leetcode/algorithm/bit.md"
		},
		{
			text: "3.8 排序算法",
			link: "/leetcode/algorithm/sort.md"
		},
		{
			text: "3.9 二分查找",
			link: "/leetcode/algorithm/binary_search.md"
		},
		{
			text: "3.10 双指针",
			link: "/leetcode/algorithm/two_pointer.md"
		},
		{
			text: "3.11 滑动窗口",
			link: "/leetcode/algorithm/slide_window.md"
		}

	],
	collapsible: true,
	collapsed: true
}];

export default defineConfig({
	base: '/doc/', // 根据部署的位置修改base 比如在服务器中的 nginx/html/doc 目录下 则base应为 /doc/  若在nginx/html下  则为 /
	// base: '/', 
	lastUpdated: true,
	title: 'CHT  frontend-study', // 站点的标题 并显示在导航栏中。
	description: '自定义的 description', // 站点的描述  这将作为<meta>标记渲染在页面HTML中。
	head: [['meta', { name: 'keywords', content: 'HTML, CSS, JavaScript, Vue, ES6' }]],
	themeConfig: {
		logo: '/logo.png',
		lastUpdatedText: "最近更新时间",
		// 导航栏配置
		nav: [
			{ text: '每日笔记', link: '/notes/' },
			{ text: '学习笔记', link: '/study/' },
			{ text: 'leetcode', link: '/leetcode/' },
		],
		// 侧边栏配置
		sidebar: {
			'/study/': [{
				text: 'vue2学习笔记',
				items: [
					{ text: 'vue2', link: '/study/vue/vue2/Vue2' },
					{ text: '介绍', link: '/study/vue/vue2/introduction/README' },
					{ text: '源码目录设计和架构设计', link: '/study/vue/vue2/design/README' },
					{
						text: 'Rollup构建版本',
						items: [
							{ text: 'Rollup基础知识', link: '/study/vue/vue2/rollup/README' },
							{ text: 'Vue中的Rollup构建', link: '/study/vue/vue2/rollup/vue' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '从入口到构造函数整体流程',
						items: [
							{ text: '整体流程', link: '/study/vue/vue2/entry/README' },
							{ text: 'initGlobalAPI', link: '/study/vue/vue2/entry/global' },
							{ text: 'initMixin流程', link: '/study/vue/vue2/entry/init' },
							{ text: 'stateMixin流程', link: '/study/vue/vue2/entry/state' },
							{ text: 'eventsMixin流程', link: '/study/vue/vue2/entry/events' },
							{ text: 'lifecycleMixin流程', link: '/study/vue/vue2/entry/lifecycle' },
							{ text: 'renderMixin流程', link: '/study/vue/vue2/entry/render' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '响应式原理',
						items: [
							{ text: '介绍', link: '/study/vue/vue2/reactive/README' },
							{ text: '前置核心概念', link: '/study/vue/vue2/reactive/prepare' },
							{ text: 'props处理', link: '/study/vue/vue2/reactive/props' },
							{ text: 'methods处理', link: '/study/vue/vue2/reactive/methods' },
							{ text: 'data处理', link: '/study/vue/vue2/reactive/data' },
							{ text: 'computed处理', link: '/study/vue/vue2/reactive/computed' },
							{ text: 'watch处理', link: '/study/vue/vue2/reactive/watch' },
							{ text: '深入响应式原理', link: '/study/vue/vue2/reactive/reactive' },
							{ text: '依赖收集', link: '/study/vue/vue2/reactive/dep' },
							{ text: '派发更新', link: '/study/vue/vue2/reactive/notify' },
							{ text: 'nextTick实现原理', link: '/study/vue/vue2/reactive/nexttick' },
							{ text: '变化侦测注意事项', link: '/study/vue/vue2/reactive/problem' },
							{ text: '变化侦测API实现', link: '/study/vue/vue2/reactive/api' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '虚拟DOM和VNode',
						items: [
							{ text: '虚拟DOM', link: '/study/vue/vue2/dom/README' },
							{ text: 'VNode介绍', link: '/study/vue/vue2/dom/vnode' },
							{ text: 'Diff算法', link: '/study/vue/vue2/dom/diff' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '组件化',
						items: [
							{ text: '介绍', link: '/study/vue/vue2/component/README' },
							{ text: '$mount方法', link: '/study/vue/vue2/component/mount' },
							{ text: 'render和renderProxy', link: '/study/vue/vue2/component/render' },
							{ text: 'createElement', link: '/study/vue/vue2/component/createElement' },
							{ text: 'createComponent', link: '/study/vue/vue2/component/createComponent' },
							{ text: '合并策略', link: '/study/vue/vue2/component/merge' },
							{ text: 'update和patch', link: '/study/vue/vue2/component/patch' },
							{ text: '组件生命周期', link: '/study/vue/vue2/component/lifecycle' },
							{ text: '组件注册', link: '/study/vue/vue2/component/register' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '编译原理',
						items: [
							{ text: '介绍', link: '/study/vue/vue2/compile/README' },
							{ text: 'compileToFunctions', link: '/study/vue/vue2/compile/compileToFunctions' },
							{ text: 'parse模板解析', link: '/study/vue/vue2/compile/parse' },
							{ text: 'optimize优化', link: '/study/vue/vue2/compile/optimize' },
							{ text: 'codegen代码生成', link: '/study/vue/vue2/compile/codegen' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '扩展',
						items: [
							{ text: '扩展', link: '/study/vue/vue2/expand/README' },
							{ text: 'directive指令', link: '/study/vue/vue2/expand/directive' },
							{ text: 'filter过滤器', link: '/study/vue/vue2/expand/filter' },
							{ text: 'event事件处理', link: '/study/vue/vue2/expand/event' },
							{ text: 'v-model', link: '/study/vue/vue2/expand/vmodel' },
							{ text: '插槽', link: '/study/vue/vue2/expand/slot' },
							{ text: 'Keep-Alive', link: '/study/vue/vue2/expand/keep-alive' },
							{ text: 'Transition', link: '/study/vue/vue2/expand/transition' },
							{ text: 'Transition-Group', link: '/study/vue/vue2/expand/transition-group' },
							{ text: 'Vue.use插件机制', link: '/study/vue/vue2/expand/plugin' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: 'Vue-Router',
						items: [
							{ text: '介绍', link: '/study/vue/vue2/router/README' },
							{ text: '路由安装', link: '/study/vue/vue2/router/install' },
							{ text: 'matcher介绍', link: '/study/vue/vue2/router/matcher' },
							{ text: '路由切换', link: '/study/vue/vue2/router/change' },
							{ text: '内置组件', link: '/study/vue/vue2/router/components' },
							{ text: '路由hooks钩子函数', link: '/study/vue/vue2/router/hooks' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: 'Vuex',
						items: [
							{ text: '介绍', link: '/study/vue/vue2/vuex/README' },
							{ text: 'Vuex安装', link: '/study/vue/vue2/vuex/install' },
							{ text: 'Vuex初始化', link: '/study/vue/vue2/vuex/init' },
							{ text: 'Vuex辅助API', link: '/study/vue/vue2/vuex/utils' },
							{ text: 'Store实例API', link: '/study/vue/vue2/vuex/api' },
						],
						collapsible: true, // 菜单是否为可折叠的
						collapsed: true // 是否默认折叠 
					},
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: 'java学习笔记',
				items: [
					{ text: '配置环境', link: '/study/java/base-config/java环境的安装以及IntelliJ IDEA安装' },
					// {
					// 	text: 'Rollup构建版本',
					// 	items: [
					// 		{ text: 'Rollup基础知识', link: '/study/vue/vue2/rollup/README' },
					// 		{ text: 'Vue中的Rollup构建', link: '/study/vue/vue2/rollup/vue' },
					// 	],
					// 	collapsible: true,
					// 	collapsed: true
					// },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: 'vue3学习笔记',
				items: [
					{ text: 'vue3', link: '/study/vue/vue3/Vue3' },
					{ text: 'vue3diff', link: '/study/vue/vue3/source-code/diff' },
					{
						text: 'Vue-Router',
						items: [
							{ text: '介绍', link: '/study/vue/vue3/router/README' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: 'Pinia',
						items: [
							{ text: '介绍', link: '/study/vue/vue3/pinia/README' },
						],
						collapsible: true, // 菜单是否为可折叠的
						collapsed: true // 是否默认折叠 
					},
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			},
			{
				text: '面试',
				items: [
					{ text: '20240129-面试题', link: '/study/interview/20240129' },
					{ text: '学习资料(一)HTML', link: '/study/interview/20240326-学习资料(一)HTML' },
					{ text: '学习资料(二)CSS', link: '/study/interview/20240326-学习资料(二)CSS' },
					{ text: '学习资料(三)JS', link: '/study/interview/20240327-学习资料(三)JS' },
					{ text: '学习资料(四)Vue', link: '/study/interview/20240328-学习资料(四)Vue' },
					{ text: '学习资料(五)浏览器', link: '/study/interview/20240327-学习资料(五)浏览器' },
					{ text: '学习资料(六)性能优化', link: '/study/interview/20240327-学习资料(六)性能优化' },
					{ text: '学习资料(七)手写代码', link: '/study/interview/20240327-学习资料(七)手写代码' },
					{ text: '学习资料(八)输出结果', link: '/study/interview/20240327-学习资料(八)输出结果' },
					{ text: '2024-05-24-面试题', link: '/study/interview/2024-05-24' },
					{
						text: 'javaScript',
						items: [
							{ text: '2024-04-10-面试题', link: '/study/interview/javaScript/2024-04-10-学习资料' },
						],
						collapsible: true,
						collapsed: true
					},
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: 'javaScript',
				items: [
					{ text: 'ES6', link: '/study/javaScript/ES6' },
					{ text: 'ECMAScript', link: '/study/javaScript/ECMAScript' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: 'CSS学习笔记',
				items: [
					{ text: 'grid布局', link: '/study/css/grid' },
					{ text: 'css3', link: '/study/css/css3' },
					{ text: 'H5C3', link: '/study/css/H5C3' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: 'webpack学习笔记',
				items: [
					{ text: '追本溯源', link: '/study/webpack/source' },
					{ text: '安装', link: '/study/webpack/install' },
					{ text: '起步', link: '/study/webpack/start' },
					{ text: '打包静态资源', link: '/study/webpack/static' },
					{ text: 'webpack核心', link: '/study/webpack/core' },
					{ text: 'webpack进阶', link: '/study/webpack/advanced' },
					{ text: 'webpack配置案例', link: '/study/webpack/case' },
					{ text: 'webpack性能优化', link: '/study/webpack/optimization' },
					{ text: '编写自己的Loader', link: '/study/webpack/loader' },
					{ text: '编写自己的Plugin', link: '/study/webpack/plugin' },
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
					{ text: 'Nginx简单使用', link: '/study/other/Nginx的简单使用' },
					{ text: '抓包工具Whistle', link: '/study/other/Whistle' },
					{ text: '服务器安装mysql', link: '/study/other/mysql' },
					{ text: 'Git指令', link: '/study/other/git' },
					{ text: 'Docker', link: '/study/other/Docker' },
					{ text: '其他概念', link: '/study/other/其他概念' },
					{ text: 'rollup', link: '/study/other/rollup' },
					{ text: '性能优化', link: '/study/other/performance-optimization' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			},
			{
				text: 'nodejs',
				items: [
					{ text: 'Nodejs', link: '/study/nodejs/NodeJS' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			},
			{
				text: 'xiaochengxu',
				items: [
					{ text: '微信小程序', link: '/study/xiaochengxu/微信小程序' },
					{ text: 'uniapp', link: '/study/xiaochengxu/uniapp' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}, {
				text: '数据结构与算法',
				items: [
					{
						text: '数据结构',
						items: [
							{ text: '数组', link: '/study/algo/data-structure/Array' },
							{ text: '栈', link: '/study/algo/data-structure/Stack' },
							{ text: '队列', link: '/study/algo/data-structure/Queue' },
							{ text: '优先队列', link: '/study/algo/data-structure/PriorityQueue' },
							{ text: '单向链表', link: '/study/algo/data-structure/LinkedList' },
							{ text: '双向链表', link: '/study/algo/data-structure/DoubleLinkedList' },
							{ text: '集合', link: '/study/algo/data-structure/Set' },
							{ text: '字典', link: '/study/algo/data-structure/Map' },
							{ text: '哈希表', link: '/study/algo/data-structure/HashTable' },
							{ text: '树', link: '/study/algo/data-structure/Tree' },
							{ text: '二叉树', link: '/study/algo/data-structure/BinaryTree' },
							{ text: '二叉搜索树', link: '/study/algo/data-structure/BinarySearchTree' },
							{ text: '图', link: '/study/algo/data-structure/Graph' },
						],
						collapsible: true,
						collapsed: true
					},
					{
						text: '算法',
						items: [
							{ text: '排序', link: '/study/algo/algorithm/sort' },
							{ text: '搜索', link: '/study/algo/algorithm/search' },
							{ text: '设计思想', link: '/study/algo/algorithm/idea' },
							{ text: '经典算法', link: '/study/algo/algorithm/classic' },
						],
						collapsible: true,
						collapsed: true
					},
					{ text: 'LeetCode高频算法', link: '/study/algo/leetCode' },
					{ text: 'LeetCode题解', link: '/study/algo/leetcode-master/index' },
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			}

			],
			'/notes/': [
				{
					text: 'days学习笔记',
					items: [
						{ text: 'vue2filters中无法获取this', link: '/notes/days/20230330-vue2filters中无法获取this' },
						{ text: 'object-fit属性', link: '/notes/days/20230331-object-fit属性' },
						{ text: '变动的数字', link: '/notes/days/20230403-变动的数字' },
						{ text: 'vue3中effectScope', link: '/notes/days/20230407-vue3中effectScope' },
						{ text: '?? vs ||', link: '/notes/days/20230410-合并vs逻辑' },
						{ text: '接入qiankun总结', link: '/notes/days/20230413-接入qiankun总结' },
						{ text: 'border-image', link: '/notes/days/20230414-border-image' },
						{ text: '第三方库', link: '/notes/days/20230424-第三方库' },
						{ text: '单行省略号多行省略号', link: '/notes/days/20230428-单行省略号多行省略号' },
						{ text: 'css中使用v-bind', link: '/notes/days/20230529-css中使用v-bind' },
						{ text: ':global()', link: '/notes/days/20230530-global()' },
						{ text: '函数式组件', link: '/notes/days/20230531-函数式组件' },
						{ text: 'vue前端打包体积分析', link: '/notes/days/20230710-vue前端打包体积分析' },
						{ text: '回流和重绘', link: '/notes/days/20230726-回流和重绘' },
						{ text: 'TypeScript', link: '/notes/days/20230728-TypeScript' },
						{ text: 'git不区分带小写问题', link: '/notes/days/20230928-git不区分大小写问题' },
						{ text: '2024-03-01-动态规划', link: '/notes/days/2024-03-01-动态规划' },
						{ text: '2024-03-04-贪心算法', link: '/notes/days/2024-03-04-贪心算法' },
						{ text: '202402-29-hello-算法', link: '/notes/days/202402-29-hello-算法' },
						{ text: '2024-03-08vue2中的修饰符', link: '/notes/days/2024-03-08-vue2中的修饰符' },
						{ text: '20231226-webpack-loader-and-plugin', link: '/notes/days/20231226-webpack-loader-and-plugin' },
						{ text: '2024-04-22-webComponents学习笔记', link: '/notes/days/2024-04-22-webComponents学习笔记' },
						{ text: '2024-05-15-xss攻击前端处理', link: '/notes/days/2024-05-15-xss攻击前端处理' },
					],
					collapsible: true, // 菜单是否为可折叠的
					collapsed: true // 是否默认折叠 
				}
			],
			'leetcode': leetcodeConfig
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