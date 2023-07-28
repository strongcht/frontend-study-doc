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
					text: 'vue2学习笔记',
					items: [
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
			},{
					text: 'vue3学习笔记',
					items: [
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
						{ text: '服务器安装mysql', link: '/study/other/mysql' },
						{ text: 'Git指令', link: '/study/other/git' },
						{ text: 'rollup', link: '/study/other/rollup' },
						{ text: '性能优化', link: '/study/other/performance-optimization' },
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