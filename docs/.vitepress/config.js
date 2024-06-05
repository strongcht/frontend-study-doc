import { defineConfig } from 'vitepress';

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
			'/algo/': [{
				text: 'leetcode',
				items: [
					// [
					// 	{
					// 		text: "0001.两数之和",
					// 		link: "/study/algo/leetcode-master/0001-两数之和"
					// 	},
					// 	{
					// 		text: "0005.最长回文子串",
					// 		link: "/study/algo/leetcode-master/0005-最长回文子串"
					// 	},
					// 	{
					// 		text: "0015.三数之和",
					// 		link: "/study/algo/leetcode-master/0015-三数之和"
					// 	},
					// 	{
					// 		text: "0017.电话号码的字母组合",
					// 		link: "/study/algo/leetcode-master/0017-电话号码的字母组合"
					// 	},
					// 	{
					// 		text: "0018.四数之和",
					// 		link: "/study/algo/leetcode-master/0018-四数之和"
					// 	},
					// 	{
					// 		text: "0019.删除链表的倒数第N个节点",
					// 		link: "/study/algo/leetcode-master/0019-删除链表的倒数第N个节点"
					// 	},
					// 	{
					// 		text: "0020.有效的括号",
					// 		link: "/study/algo/leetcode-master/0020-有效的括号"
					// 	},
					// 	{
					// 		text: "0024.两两交换链表中的节点",
					// 		link: "/study/algo/leetcode-master/0024-两两交换链表中的节点"
					// 	},
					// 	{
					// 		text: "0027.移除元素",
					// 		link: "/study/algo/leetcode-master/0027-移除元素"
					// 	},
					// 	{
					// 		text: "0028.实现strStr",
					// 		link: "/study/algo/leetcode-master/0028-实现strStr"
					// 	},
					// 	{
					// 		text: "0031.下一个排列",
					// 		link: "/study/algo/leetcode-master/0031-下一个排列"
					// 	},
					// 	{
					// 		text: "0034.在排序数组中查找元素的第一个和最后一个位置",
					// 		link: "/study/algo/leetcode-master/0034-在排序数组中查找元素的第一个和最后一个位置"
					// 	},
					// 	{
					// 		text: "0035.搜索插入位置",
					// 		link: "/study/algo/leetcode-master/0035-搜索插入位置"
					// 	},
					// 	{
					// 		text: "0037.解数独",
					// 		link: "/study/algo/leetcode-master/0037-解数独"
					// 	},
					// 	{
					// 		text: "0039.组合总和",
					// 		link: "/study/algo/leetcode-master/0039-组合总和"
					// 	},
					// 	{
					// 		text: "0040.组合总和II",
					// 		link: "/study/algo/leetcode-master/0040-组合总和II"
					// 	},
					// 	{
					// 		text: "0042.接雨水",
					// 		link: "/study/algo/leetcode-master/0042-接雨水"
					// 	},
					// 	{
					// 		text: "0045.跳跃游戏II",
					// 		link: "/study/algo/leetcode-master/0045-跳跃游戏II"
					// 	},
					// 	{
					// 		text: "0046.全排列",
					// 		link: "/study/algo/leetcode-master/0046-全排列"
					// 	},
					// 	{
					// 		text: "0047.全排列II",
					// 		link: "/study/algo/leetcode-master/0047-全排列II"
					// 	},
					// 	{
					// 		text: "0051.N皇后",
					// 		link: "/study/algo/leetcode-master/0051-N皇后"
					// 	},
					// 	{
					// 		text: "0052.N皇后II",
					// 		link: "/study/algo/leetcode-master/0052-N皇后II"
					// 	},
					// 	{
					// 		text: "0053.最大子序和（动态规划）",
					// 		link: "/study/algo/leetcode-master/0053-最大子序和（动态规划）"
					// 	},
					// 	{
					// 		text: "0053.最大子序和",
					// 		link: "/study/algo/leetcode-master/0053-最大子序和"
					// 	},
					// 	{
					// 		text: "0054.螺旋矩阵",
					// 		link: "/study/algo/leetcode-master/0054-螺旋矩阵"
					// 	},
					// 	{
					// 		text: "0055.跳跃游戏",
					// 		link: "/study/algo/leetcode-master/0055-跳跃游戏"
					// 	},
					// 	{
					// 		text: "0056.合并区间",
					// 		link: "/study/algo/leetcode-master/0056-合并区间"
					// 	},
					// 	{
					// 		text: "0059.螺旋矩阵II",
					// 		link: "/study/algo/leetcode-master/0059-螺旋矩阵II"
					// 	},
					// 	{
					// 		text: "0062.不同路径",
					// 		link: "/study/algo/leetcode-master/0062-不同路径"
					// 	},
					// 	{
					// 		text: "0063.不同路径II",
					// 		link: "/study/algo/leetcode-master/0063-不同路径II"
					// 	},
					// 	{
					// 		text: "0070.爬楼梯",
					// 		link: "/study/algo/leetcode-master/0070-爬楼梯"
					// 	},
					// 	{
					// 		text: "0070.爬楼梯完全背包版本",
					// 		link: "/study/algo/leetcode-master/0070-爬楼梯完全背包版本"
					// 	},
					// 	{
					// 		text: "0072.编辑距离",
					// 		link: "/study/algo/leetcode-master/0072-编辑距离"
					// 	},
					// 	{
					// 		text: "0077.组合",
					// 		link: "/study/algo/leetcode-master/0077-组合"
					// 	},
					// 	{
					// 		text: "0077.组合优化",
					// 		link: "/study/algo/leetcode-master/0077-组合优化"
					// 	},
					// 	{
					// 		text: "0078.子集",
					// 		link: "/study/algo/leetcode-master/0078-子集"
					// 	},
					// 	{
					// 		text: "0084.柱状图中最大的矩形",
					// 		link: "/study/algo/leetcode-master/0084-柱状图中最大的矩形"
					// 	},
					// 	{
					// 		text: "0090.子集II",
					// 		link: "/study/algo/leetcode-master/0090-子集II"
					// 	},
					// 	{
					// 		text: "0093.复原IP地址",
					// 		link: "/study/algo/leetcode-master/0093-复原IP地址"
					// 	},
					// 	{
					// 		text: "0096.不同的二叉搜索树",
					// 		link: "/study/algo/leetcode-master/0096-不同的二叉搜索树"
					// 	},
					// 	{
					// 		text: "0098.验证二叉搜索树",
					// 		link: "/study/algo/leetcode-master/0098-验证二叉搜索树"
					// 	},
					// 	{
					// 		text: "0100.相同的树",
					// 		link: "/study/algo/leetcode-master/0100-相同的树"
					// 	},
					// 	{
					// 		text: "0101.对称二叉树",
					// 		link: "/study/algo/leetcode-master/0101-对称二叉树"
					// 	},
					// 	{
					// 		text: "0102.二叉树的层序遍历",
					// 		link: "/study/algo/leetcode-master/0102-二叉树的层序遍历"
					// 	},
					// 	{
					// 		text: "0104.二叉树的最大深度",
					// 		link: "/study/algo/leetcode-master/0104-二叉树的最大深度"
					// 	},
					// 	{
					// 		text: "0106.从中序与后序遍历序列构造二叉树",
					// 		link: "/study/algo/leetcode-master/0106-从中序与后序遍历序列构造二叉树"
					// 	},
					// 	{
					// 		text: "0108.将有序数组转换为二叉搜索树",
					// 		link: "/study/algo/leetcode-master/0108-将有序数组转换为二叉搜索树"
					// 	},
					// 	{
					// 		text: "0110.平衡二叉树",
					// 		link: "/study/algo/leetcode-master/0110-平衡二叉树"
					// 	},
					// 	{
					// 		text: "0111.二叉树的最小深度",
					// 		link: "/study/algo/leetcode-master/0111-二叉树的最小深度"
					// 	},
					// 	{
					// 		text: "0112.路径总和",
					// 		link: "/study/algo/leetcode-master/0112-路径总和"
					// 	},
					// 	{
					// 		text: "0115.不同的子序列",
					// 		link: "/study/algo/leetcode-master/0115-不同的子序列"
					// 	},
					// 	{
					// 		text: "0116.填充每个节点的下一个右侧节点指针",
					// 		link: "/study/algo/leetcode-master/0116-填充每个节点的下一个右侧节点指针"
					// 	},
					// 	{
					// 		text: "0121.买卖股票的最佳时机",
					// 		link: "/study/algo/leetcode-master/0121-买卖股票的最佳时机"
					// 	},
					// 	{
					// 		text: "0122.买卖股票的最佳时机II（动态规划）",
					// 		link: "/study/algo/leetcode-master/0122-买卖股票的最佳时机II（动态规划）"
					// 	},
					// 	{
					// 		text: "0122.买卖股票的最佳时机II",
					// 		link: "/study/algo/leetcode-master/0122-买卖股票的最佳时机II"
					// 	},
					// 	{
					// 		text: "0123.买卖股票的最佳时机III",
					// 		link: "/study/algo/leetcode-master/0123-买卖股票的最佳时机III"
					// 	},
					// 	{
					// 		text: "0127.单词接龙",
					// 		link: "/study/algo/leetcode-master/0127-单词接龙"
					// 	},
					// 	{
					// 		text: "0129.求根到叶子节点数字之和",
					// 		link: "/study/algo/leetcode-master/0129-求根到叶子节点数字之和"
					// 	},
					// 	{
					// 		text: "0130.被围绕的区域",
					// 		link: "/study/algo/leetcode-master/0130-被围绕的区域"
					// 	},
					// 	{
					// 		text: "0131.分割回文串",
					// 		link: "/study/algo/leetcode-master/0131-分割回文串"
					// 	},
					// 	{
					// 		text: "0132.分割回文串II",
					// 		link: "/study/algo/leetcode-master/0132-分割回文串II"
					// 	},
					// 	{
					// 		text: "0134.加油站",
					// 		link: "/study/algo/leetcode-master/0134-加油站"
					// 	},
					// 	{
					// 		text: "0135.分发糖果",
					// 		link: "/study/algo/leetcode-master/0135-分发糖果"
					// 	},
					// 	{
					// 		text: "0139.单词拆分",
					// 		link: "/study/algo/leetcode-master/0139-单词拆分"
					// 	},
					// 	{
					// 		text: "0141.环形链表",
					// 		link: "/study/algo/leetcode-master/0141-环形链表"
					// 	},
					// 	{
					// 		text: "0142.环形链表II",
					// 		link: "/study/algo/leetcode-master/0142-环形链表II"
					// 	},
					// 	{
					// 		text: "0143.重排链表",
					// 		link: "/study/algo/leetcode-master/0143-重排链表"
					// 	},
					// 	{
					// 		text: "0150.逆波兰表达式求值",
					// 		link: "/study/algo/leetcode-master/0150-逆波兰表达式求值"
					// 	},
					// 	{
					// 		text: "0151.翻转字符串里的单词",
					// 		link: "/study/algo/leetcode-master/0151-翻转字符串里的单词"
					// 	},
					// 	{
					// 		text: "0160.相交链表",
					// 		link: "/study/algo/leetcode-master/0160-相交链表"
					// 	},
					// 	{
					// 		text: "0188.买卖股票的最佳时机IV",
					// 		link: "/study/algo/leetcode-master/0188-买卖股票的最佳时机IV"
					// 	},
					// 	{
					// 		text: "0189.旋转数组",
					// 		link: "/study/algo/leetcode-master/0189-旋转数组"
					// 	},
					// 	{
					// 		text: "0198.打家劫舍",
					// 		link: "/study/algo/leetcode-master/0198-打家劫舍"
					// 	},
					// 	{
					// 		text: "0200.岛屿数量.广搜版",
					// 		link: "/study/algo/leetcode-master/0200-岛屿数量-广搜版"
					// 	},
					// 	{
					// 		text: "0200.岛屿数量.深搜版",
					// 		link: "/study/algo/leetcode-master/0200-岛屿数量-深搜版"
					// 	},
					// 	{
					// 		text: "0202.快乐数",
					// 		link: "/study/algo/leetcode-master/0202-快乐数"
					// 	},
					// 	{
					// 		text: "0203.移除链表元素",
					// 		link: "/study/algo/leetcode-master/0203-移除链表元素"
					// 	},
					// 	{
					// 		text: "0205.同构字符串",
					// 		link: "/study/algo/leetcode-master/0205-同构字符串"
					// 	},
					// 	{
					// 		text: "0206.翻转链表",
					// 		link: "/study/algo/leetcode-master/0206-翻转链表"
					// 	},
					// 	{
					// 		text: "0209.长度最小的子数组",
					// 		link: "/study/algo/leetcode-master/0209-长度最小的子数组"
					// 	},
					// 	{
					// 		text: "0213.打家劫舍II",
					// 		link: "/study/algo/leetcode-master/0213-打家劫舍II"
					// 	},
					// 	{
					// 		text: "0216.组合总和III",
					// 		link: "/study/algo/leetcode-master/0216-组合总和III"
					// 	},
					// 	{
					// 		text: "0222.完全二叉树的节点个数",
					// 		link: "/study/algo/leetcode-master/0222-完全二叉树的节点个数"
					// 	},
					// 	{
					// 		text: "0225.用队列实现栈",
					// 		link: "/study/algo/leetcode-master/0225-用队列实现栈"
					// 	},
					// 	{
					// 		text: "0226.翻转二叉树",
					// 		link: "/study/algo/leetcode-master/0226-翻转二叉树"
					// 	},
					// 	{
					// 		text: "0232.用栈实现队列",
					// 		link: "/study/algo/leetcode-master/0232-用栈实现队列"
					// 	},
					// 	{
					// 		text: "0234.回文链表",
					// 		link: "/study/algo/leetcode-master/0234-回文链表"
					// 	},
					// 	{
					// 		text: "0235.二叉搜索树的最近公共祖先",
					// 		link: "/study/algo/leetcode-master/0235-二叉搜索树的最近公共祖先"
					// 	},
					// 	{
					// 		text: "0236.二叉树的最近公共祖先",
					// 		link: "/study/algo/leetcode-master/0236-二叉树的最近公共祖先"
					// 	},
					// 	{
					// 		text: "0239.滑动窗口最大值",
					// 		link: "/study/algo/leetcode-master/0239-滑动窗口最大值"
					// 	},
					// 	{
					// 		text: "0242.有效的字母异位词",
					// 		link: "/study/algo/leetcode-master/0242-有效的字母异位词"
					// 	},
					// 	{
					// 		text: "0257.二叉树的所有路径",
					// 		link: "/study/algo/leetcode-master/0257-二叉树的所有路径"
					// 	},
					// 	{
					// 		text: "0279.完全平方数",
					// 		link: "/study/algo/leetcode-master/0279-完全平方数"
					// 	},
					// 	{
					// 		text: "0283.移动零",
					// 		link: "/study/algo/leetcode-master/0283-移动零"
					// 	},
					// 	{
					// 		text: "0300.最长上升子序列",
					// 		link: "/study/algo/leetcode-master/0300-最长上升子序列"
					// 	},
					// 	{
					// 		text: "0309.最佳买卖股票时机含冷冻期",
					// 		link: "/study/algo/leetcode-master/0309-最佳买卖股票时机含冷冻期"
					// 	},
					// 	{
					// 		text: "0322.零钱兑换",
					// 		link: "/study/algo/leetcode-master/0322-零钱兑换"
					// 	},
					// 	{
					// 		text: "0332.重新安排行程",
					// 		link: "/study/algo/leetcode-master/0332-重新安排行程"
					// 	},
					// 	{
					// 		text: "0337.打家劫舍III",
					// 		link: "/study/algo/leetcode-master/0337-打家劫舍III"
					// 	},
					// 	{
					// 		text: "0343.整数拆分",
					// 		link: "/study/algo/leetcode-master/0343-整数拆分"
					// 	},
					// 	{
					// 		text: "0344.反转字符串",
					// 		link: "/study/algo/leetcode-master/0344-反转字符串"
					// 	},
					// 	{
					// 		text: "0347.前K个高频元素",
					// 		link: "/study/algo/leetcode-master/0347-前K个高频元素"
					// 	},
					// 	{
					// 		text: "0349.两个数组的交集",
					// 		link: "/study/algo/leetcode-master/0349-两个数组的交集"
					// 	},
					// 	{
					// 		text: "0376.摆动序列",
					// 		link: "/study/algo/leetcode-master/0376-摆动序列"
					// 	},
					// 	{
					// 		text: "0377.组合总和Ⅳ",
					// 		link: "/study/algo/leetcode-master/0377-组合总和Ⅳ"
					// 	},
					// 	{
					// 		text: "0377-组合总和IV(完全背包的排列问题二维迭代理解)",
					// 		link: "/study/algo/leetcode-master/0377-组合总和IV(完全背包的排列问题二维迭代理解)"
					// 	},
					// 	{
					// 		text: "0383.赎金信",
					// 		link: "/study/algo/leetcode-master/0383-赎金信"
					// 	},
					// 	{
					// 		text: "0392.判断子序列",
					// 		link: "/study/algo/leetcode-master/0392-判断子序列"
					// 	},
					// 	{
					// 		text: "0404.左叶子之和",
					// 		link: "/study/algo/leetcode-master/0404-左叶子之和"
					// 	},
					// 	{
					// 		text: "0406.根据身高重建队列",
					// 		link: "/study/algo/leetcode-master/0406-根据身高重建队列"
					// 	},
					// 	{
					// 		text: "0416.分割等和子集",
					// 		link: "/study/algo/leetcode-master/0416-分割等和子集"
					// 	},
					// 	{
					// 		text: "0417.太平洋大西洋水流问题",
					// 		link: "/study/algo/leetcode-master/0417-太平洋大西洋水流问题"
					// 	},
					// 	{
					// 		text: "0435.无重叠区间",
					// 		link: "/study/algo/leetcode-master/0435-无重叠区间"
					// 	},
					// 	{
					// 		text: "0450.删除二叉搜索树中的节点",
					// 		link: "/study/algo/leetcode-master/0450-删除二叉搜索树中的节点"
					// 	},
					// 	{
					// 		text: "0452.用最少数量的箭引爆气球",
					// 		link: "/study/algo/leetcode-master/0452-用最少数量的箭引爆气球"
					// 	},
					// 	{
					// 		text: "0454.四数相加II",
					// 		link: "/study/algo/leetcode-master/0454-四数相加II"
					// 	},
					// 	{
					// 		text: "0455.分发饼干",
					// 		link: "/study/algo/leetcode-master/0455-分发饼干"
					// 	},
					// 	{
					// 		text: "0459.重复的子字符串",
					// 		link: "/study/algo/leetcode-master/0459-重复的子字符串"
					// 	},
					// 	{
					// 		text: "0463.岛屿的周长",
					// 		link: "/study/algo/leetcode-master/0463-岛屿的周长"
					// 	},
					// 	{
					// 		text: "0474.一和零",
					// 		link: "/study/algo/leetcode-master/0474-一和零"
					// 	},
					// 	{
					// 		text: "0491.递增子序列",
					// 		link: "/study/algo/leetcode-master/0491-递增子序列"
					// 	},
					// 	{
					// 		text: "0494.目标和",
					// 		link: "/study/algo/leetcode-master/0494-目标和"
					// 	},
					// 	{
					// 		text: "0496.下一个更大元素I",
					// 		link: "/study/algo/leetcode-master/0496-下一个更大元素I"
					// 	},
					// 	{
					// 		text: "0501.二叉搜索树中的众数",
					// 		link: "/study/algo/leetcode-master/0501-二叉搜索树中的众数"
					// 	},
					// 	{
					// 		text: "0503.下一个更大元素II",
					// 		link: "/study/algo/leetcode-master/0503-下一个更大元素II"
					// 	},
					// 	{
					// 		text: "0509.斐波那契数",
					// 		link: "/study/algo/leetcode-master/0509-斐波那契数"
					// 	},
					// 	{
					// 		text: "0513.找树左下角的值",
					// 		link: "/study/algo/leetcode-master/0513-找树左下角的值"
					// 	},
					// 	{
					// 		text: "0516.最长回文子序列",
					// 		link: "/study/algo/leetcode-master/0516-最长回文子序列"
					// 	},
					// 	{
					// 		text: "0518.零钱兑换II",
					// 		link: "/study/algo/leetcode-master/0518-零钱兑换II"
					// 	},
					// 	{
					// 		text: "0530.二叉搜索树的最小绝对差",
					// 		link: "/study/algo/leetcode-master/0530-二叉搜索树的最小绝对差"
					// 	},
					// 	{
					// 		text: "0538.把二叉搜索树转换为累加树",
					// 		link: "/study/algo/leetcode-master/0538-把二叉搜索树转换为累加树"
					// 	},
					// 	{
					// 		text: "0541.反转字符串II",
					// 		link: "/study/algo/leetcode-master/0541-反转字符串II"
					// 	},
					// 	{
					// 		text: "0583.两个字符串的删除操作",
					// 		link: "/study/algo/leetcode-master/0583-两个字符串的删除操作"
					// 	},
					// 	{
					// 		text: "0617.合并二叉树",
					// 		link: "/study/algo/leetcode-master/0617-合并二叉树"
					// 	},
					// 	{
					// 		text: "0647.回文子串",
					// 		link: "/study/algo/leetcode-master/0647-回文子串"
					// 	},
					// 	{
					// 		text: "0649.Dota2参议院",
					// 		link: "/study/algo/leetcode-master/0649-Dota2参议院"
					// 	},
					// 	{
					// 		text: "0654.最大二叉树",
					// 		link: "/study/algo/leetcode-master/0654-最大二叉树"
					// 	},
					// 	{
					// 		text: "0657.机器人能否返回原点",
					// 		link: "/study/algo/leetcode-master/0657-机器人能否返回原点"
					// 	},
					// 	{
					// 		text: "0669.修剪二叉搜索树",
					// 		link: "/study/algo/leetcode-master/0669-修剪二叉搜索树"
					// 	},
					// 	{
					// 		text: "0673.最长递增子序列的个数",
					// 		link: "/study/algo/leetcode-master/0673-最长递增子序列的个数"
					// 	},
					// 	{
					// 		text: "0674.最长连续递增序列",
					// 		link: "/study/algo/leetcode-master/0674-最长连续递增序列"
					// 	},
					// 	{
					// 		text: "0684.冗余连接",
					// 		link: "/study/algo/leetcode-master/0684-冗余连接"
					// 	},
					// 	{
					// 		text: "0685.冗余连接II",
					// 		link: "/study/algo/leetcode-master/0685-冗余连接II"
					// 	},
					// 	{
					// 		text: "0695.岛屿的最大面积",
					// 		link: "/study/algo/leetcode-master/0695-岛屿的最大面积"
					// 	},
					// 	{
					// 		text: "0700.二叉搜索树中的搜索",
					// 		link: "/study/algo/leetcode-master/0700-二叉搜索树中的搜索"
					// 	},
					// 	{
					// 		text: "0701.二叉搜索树中的插入操作",
					// 		link: "/study/algo/leetcode-master/0701-二叉搜索树中的插入操作"
					// 	},
					// 	{
					// 		text: "0704.二分查找",
					// 		link: "/study/algo/leetcode-master/0704-二分查找"
					// 	},
					// 	{
					// 		text: "0707.设计链表",
					// 		link: "/study/algo/leetcode-master/0707-设计链表"
					// 	},
					// 	{
					// 		text: "0714.买卖股票的最佳时机含手续费（动态规划）",
					// 		link: "/study/algo/leetcode-master/0714-买卖股票的最佳时机含手续费（动态规划）"
					// 	},
					// 	{
					// 		text: "0714.买卖股票的最佳时机含手续费",
					// 		link: "/study/algo/leetcode-master/0714-买卖股票的最佳时机含手续费"
					// 	},
					// 	{
					// 		text: "0718.最长重复子数组",
					// 		link: "/study/algo/leetcode-master/0718-最长重复子数组"
					// 	},
					// 	{
					// 		text: "0724.寻找数组的中心索引",
					// 		link: "/study/algo/leetcode-master/0724-寻找数组的中心索引"
					// 	},
					// 	{
					// 		text: "0738.单调递增的数字",
					// 		link: "/study/algo/leetcode-master/0738-单调递增的数字"
					// 	},
					// 	{
					// 		text: "0739.每日温度",
					// 		link: "/study/algo/leetcode-master/0739-每日温度"
					// 	},
					// 	{
					// 		text: "0746.使用最小花费爬楼梯",
					// 		link: "/study/algo/leetcode-master/0746-使用最小花费爬楼梯"
					// 	},
					// 	{
					// 		text: "0763.划分字母区间",
					// 		link: "/study/algo/leetcode-master/0763-划分字母区间"
					// 	},
					// 	{
					// 		text: "0797.所有可能的路径",
					// 		link: "/study/algo/leetcode-master/0797-所有可能的路径"
					// 	},
					// 	{
					// 		text: "0827.最大人工岛",
					// 		link: "/study/algo/leetcode-master/0827-最大人工岛"
					// 	},
					// 	{
					// 		text: "0841.钥匙和房间",
					// 		link: "/study/algo/leetcode-master/0841-钥匙和房间"
					// 	},
					// 	{
					// 		text: "0844.比较含退格的字符串",
					// 		link: "/study/algo/leetcode-master/0844-比较含退格的字符串"
					// 	},
					// 	{
					// 		text: "0860.柠檬水找零",
					// 		link: "/study/algo/leetcode-master/0860-柠檬水找零"
					// 	},
					// 	{
					// 		text: "0922.按奇偶排序数组II",
					// 		link: "/study/algo/leetcode-master/0922-按奇偶排序数组II"
					// 	},
					// 	{
					// 		text: "0925.长按键入",
					// 		link: "/study/algo/leetcode-master/0925-长按键入"
					// 	},
					// 	{
					// 		text: "0941.有效的山脉数组",
					// 		link: "/study/algo/leetcode-master/0941-有效的山脉数组"
					// 	},
					// 	{
					// 		text: "0968.监控二叉树",
					// 		link: "/study/algo/leetcode-master/0968-监控二叉树"
					// 	},
					// 	{
					// 		text: "0977.有序数组的平方",
					// 		link: "/study/algo/leetcode-master/0977-有序数组的平方"
					// 	},
					// 	{
					// 		text: "1002.查找常用字符",
					// 		link: "/study/algo/leetcode-master/1002-查找常用字符"
					// 	},
					// 	{
					// 		text: "1005.K次取反后最大化的数组和",
					// 		link: "/study/algo/leetcode-master/1005-K次取反后最大化的数组和"
					// 	},
					// 	{
					// 		text: "1020.飞地的数量",
					// 		link: "/study/algo/leetcode-master/1020-飞地的数量"
					// 	},
					// 	{
					// 		text: "1035.不相交的线",
					// 		link: "/study/algo/leetcode-master/1035-不相交的线"
					// 	},
					// 	{
					// 		text: "1047.删除字符串中的所有相邻重复项",
					// 		link: "/study/algo/leetcode-master/1047-删除字符串中的所有相邻重复项"
					// 	},
					// 	{
					// 		text: "1049.最后一块石头的重量II",
					// 		link: "/study/algo/leetcode-master/1049-最后一块石头的重量II"
					// 	},
					// 	{
					// 		text: "1143.最长公共子序列",
					// 		link: "/study/algo/leetcode-master/1143-最长公共子序列"
					// 	},
					// 	{
					// 		text: "1207.独一无二的出现次数",
					// 		link: "/study/algo/leetcode-master/1207-独一无二的出现次数"
					// 	},
					// 	{
					// 		text: "1221.分割平衡字符串",
					// 		link: "/study/algo/leetcode-master/1221-分割平衡字符串"
					// 	},
					// 	{
					// 		text: "1254.统计封闭岛屿的数目",
					// 		link: "/study/algo/leetcode-master/1254-统计封闭岛屿的数目"
					// 	},
					// 	{
					// 		text: "1356.根据数字二进制下1的数目排序",
					// 		link: "/study/algo/leetcode-master/1356-根据数字二进制下1的数目排序"
					// 	},
					// 	{
					// 		text: "1365.有多少小于当前数字的数字",
					// 		link: "/study/algo/leetcode-master/1365-有多少小于当前数字的数字"
					// 	},
					// 	{
					// 		text: "1382.将二叉搜索树变平衡",
					// 		link: "/study/algo/leetcode-master/1382-将二叉搜索树变平衡"
					// 	},
					// 	{
					// 		text: "1791.找出星型图的中心节点",
					// 		link: "/study/algo/leetcode-master/1791-找出星型图的中心节点"
					// 	},
					// 	{
					// 		text: "1971.寻找图中是否存在路径",
					// 		link: "/study/algo/leetcode-master/1971-寻找图中是否存在路径"
					// 	}
					// ]
				],
				collapsible: true, // 菜单是否为可折叠的
				collapsed: true // 是否默认折叠 
			},
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