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
},
{
	text: "第四章 LeetCode 题解",
	link: "/leetcode/problem/index.md",
	items: [
		{
			"text": "0001-0099",
			"items": [
				{
					"text": "0001-两数之和",
					"link": "/leetcode/problem/0001.md"
				},
				{
					"text": "0002-两数相加",
					"link": "/leetcode/problem/0002.md"
				},
				{
					"text": "0003-无重复字符的最长子串",
					"link": "/leetcode/problem/0003.md"
				},
				{
					"text": "0004-寻找两个正序数组的中位数",
					"link": "/leetcode/problem/0004.md"
				},
				{
					"text": "0005-最长回文子串",
					"link": "/leetcode/problem/0005.md"
				},
				{
					"text": "0006-N 字形变换",
					"link": "/leetcode/problem/0006.md"
				},
				{
					"text": "0007-整数反转",
					"link": "/leetcode/problem/0007.md"
				},
				{
					"text": "0008-字符串转换整数 (atoi)",
					"link": "/leetcode/problem/0008.md"
				},
				{
					"text": "0009-回文数",
					"link": "/leetcode/problem/0009.md"
				},
				{
					"text": "0010-正则表达式匹配",
					"link": "/leetcode/problem/0010.md"
				},
				{
					"text": "0011-盛最多水的容器",
					"link": "/leetcode/problem/0011.md"
				},
				{
					"text": "0012-整数转罗马数字",
					"link": "/leetcode/problem/0012.md"
				},
				{
					"text": "0013-罗马数字转整数",
					"link": "/leetcode/problem/0013.md"
				},
				{
					"text": "0014-最长公共前缀",
					"link": "/leetcode/problem/0014.md"
				},
				{
					"text": "0015-三数之和",
					"link": "/leetcode/problem/0015.md"
				},
				{
					"text": "0016-最接近的三数之和",
					"link": "/leetcode/problem/0016.md"
				},
				{
					"text": "0017-电话号码的字母组合",
					"link": "/leetcode/problem/0017.md"
				},
				{
					"text": "0018-四数之和",
					"link": "/leetcode/problem/0018.md"
				},
				{
					"text": "0019-删除链表的倒数第 N 个结点",
					"link": "/leetcode/problem/0019.md"
				},
				{
					"text": "0020-有效的括号",
					"link": "/leetcode/problem/0020.md"
				},
				{
					"text": "0021-合并两个有序链表",
					"link": "/leetcode/problem/0021.md"
				},
				{
					"text": "0022-括号生成",
					"link": "/leetcode/problem/0022.md"
				},
				{
					"text": "0023-合并 K 个升序链表",
					"link": "/leetcode/problem/0023.md"
				},
				{
					"text": "0024-两两交换链表中的节点",
					"link": "/leetcode/problem/0024.md"
				},
				{
					"text": "0025-K 个一组翻转链表",
					"link": "/leetcode/problem/0025.md"
				},
				{
					"text": "0026-删除有序数组中的重复项",
					"link": "/leetcode/problem/0026.md"
				},
				{
					"text": "0027-移除元素",
					"link": "/leetcode/problem/0027.md"
				},
				{
					"text": "0034-在排序数组中查找元素的第一个和最后一个位置",
					"link": "/leetcode/problem/0034.md"
				},
				{
					"text": "0035-搜索插入位置",
					"link": "/leetcode/problem/0035.md"
				},
				{
					"text": "0036-有效的数独",
					"link": "/leetcode/problem/0036.md"
				},
				{
					"text": "0039-组合总和",
					"link": "/leetcode/problem/0039.md"
				},
				{
					"text": "0040-组合总和 II",
					"link": "/leetcode/problem/0040.md"
				},
				{
					"text": "0041-缺失的第一个正数",
					"link": "/leetcode/problem/0041.md"
				},
				{
					"text": "0042-接雨水",
					"link": "/leetcode/problem/0042.md"
				},
				{
					"text": "0044-通配符匹配",
					"link": "/leetcode/problem/0044.md"
				},
				{
					"text": "0045-跳跃游戏 II",
					"link": "/leetcode/problem/0045.md"
				},
				{
					"text": "0046-全排列",
					"link": "/leetcode/problem/0046.md"
				},
				{
					"text": "0047-全排列 II",
					"link": "/leetcode/problem/0047.md"
				},
				{
					"text": "0048-旋转图像",
					"link": "/leetcode/problem/0048.md"
				},
				{
					"text": "0050-Pow(x, n)",
					"link": "/leetcode/problem/0050.md"
				},
				{
					"text": "0051-N 皇后",
					"link": "/leetcode/problem/0051.md"
				},
				{
					"text": "0052-N 皇后 II",
					"link": "/leetcode/problem/0052.md"
				},
				{
					"text": "0053-最大子数组和",
					"link": "/leetcode/problem/0053.md"
				},
				{
					"text": "0054-螺旋矩阵",
					"link": "/leetcode/problem/0054.md"
				},
				{
					"text": "0055-跳跃游戏",
					"link": "/leetcode/problem/0055.md"
				},
				{
					"text": "0058-最后一个单词的长度",
					"link": "/leetcode/problem/0058.md"
				},
				{
					"text": "0059-螺旋矩阵 II",
					"link": "/leetcode/problem/0059.md"
				},
				{
					"text": "0061-旋转链表",
					"link": "/leetcode/problem/0061.md"
				},
				{
					"text": "0062-不同路径",
					"link": "/leetcode/problem/0062.md"
				},
				{
					"text": "0063-不同路径 II",
					"link": "/leetcode/problem/0063.md"
				},
				{
					"text": "0064-最小路径和",
					"link": "/leetcode/problem/0064.md"
				},
				{
					"text": "0066-加一",
					"link": "/leetcode/problem/0066.md"
				},
				{
					"text": "0070-爬楼梯",
					"link": "/leetcode/problem/0070.md"
				},
				{
					"text": "0071-简化路径",
					"link": "/leetcode/problem/0071.md"
				},
				{
					"text": "0072-编辑距离",
					"link": "/leetcode/problem/0072.md"
				},
				{
					"text": "0073-矩阵置零",
					"link": "/leetcode/problem/0073.md"
				},
				{
					"text": "0074-搜索二维矩阵",
					"link": "/leetcode/problem/0074.md"
				},
				{
					"text": "0076-最小覆盖子串",
					"link": "/leetcode/problem/0076.md"
				},
				{
					"text": "0077-组合",
					"link": "/leetcode/problem/0077.md"
				},
				{
					"text": "0078-子集",
					"link": "/leetcode/problem/0078.md"
				},
				{
					"text": "0079-单词搜索",
					"link": "/leetcode/problem/0079.md"
				},
				{
					"text": "0080-删除有序数组中的重复项 II",
					"link": "/leetcode/problem/0080.md"
				},
				{
					"text": "0081-搜索旋转排序数组 II",
					"link": "/leetcode/problem/0081.md"
				},
				{
					"text": "0082-删除排序链表中的重复元素 II",
					"link": "/leetcode/problem/0082.md"
				},
				{
					"text": "0083-删除排序链表中的重复元素",
					"link": "/leetcode/problem/0083.md"
				},
				{
					"text": "0086-分隔链表",
					"link": "/leetcode/problem/0086.md"
				},
				{
					"text": "0088-合并两个有序数组",
					"link": "/leetcode/problem/0088.md"
				},
				{
					"text": "0090-子集 II",
					"link": "/leetcode/problem/0090.md"
				},
				{
					"text": "0092-反转链表 II",
					"link": "/leetcode/problem/0092.md"
				},
				{
					"text": "0093-复原 IP 地址",
					"link": "/leetcode/problem/0093.md"
				},
				{
					"text": "0094-二叉树的中序遍历",
					"link": "/leetcode/problem/0094.md"
				},
				{
					"text": "0095-不同的二叉搜索树 II",
					"link": "/leetcode/problem/0095.md"
				},
				{
					"text": "0096-不同的二叉搜索树",
					"link": "/leetcode/problem/0096.md"
				},
				{
					"text": "0098-验证二叉搜索树",
					"link": "/leetcode/problem/0098.md"
				},
				{
					"text": "0099-恢复二叉搜索树",
					"link": "/leetcode/problem/0099.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0100-0199",
			"items": [
				{
					"text": "0100-相同的树",
					"link": "/leetcode/problem/0100.md"
				},
				{
					"text": "0101-对称二叉树",
					"link": "/leetcode/problem/0101.md"
				},
				{
					"text": "0102-二叉树的层序遍历",
					"link": "/leetcode/problem/0102.md"
				},
				{
					"text": "0103-二叉树的锯齿形层序遍历",
					"link": "/leetcode/problem/0103.md"
				},
				{
					"text": "0104-二叉树的最大深度",
					"link": "/leetcode/problem/0104.md"
				},
				{
					"text": "0105-从前序与中序遍历序列构造二叉树",
					"link": "/leetcode/problem/0105.md"
				},
				{
					"text": "0106-从中序与后序遍历序列构造二叉树",
					"link": "/leetcode/problem/0106.md"
				},
				{
					"text": "0107-二叉树的层序遍历 II",
					"link": "/leetcode/problem/0107.md"
				},
				{
					"text": "0108-将有序数组转换为二叉搜索树",
					"link": "/leetcode/problem/0108.md"
				},
				{
					"text": "0109-有序链表转换二叉搜索树",
					"link": "/leetcode/problem/0109.md"
				},
				{
					"text": "0110-平衡二叉树",
					"link": "/leetcode/problem/0110.md"
				},
				{
					"text": "0111-二叉树的最小深度",
					"link": "/leetcode/problem/0111.md"
				},
				{
					"text": "0112-路径总和",
					"link": "/leetcode/problem/0112.md"
				},
				{
					"text": "0113-路径总和 II",
					"link": "/leetcode/problem/0113.md"
				},
				{
					"text": "0114-二叉树展开为链表",
					"link": "/leetcode/problem/0114.md"
				},
				{
					"text": "0116-填充每个节点的下一个右侧节点指针",
					"link": "/leetcode/problem/0116.md"
				},
				{
					"text": "0117-填充每个节点的下一个右侧节点指针 II",
					"link": "/leetcode/problem/0117.md"
				},
				{
					"text": "0120-三角形最小路径和",
					"link": "/leetcode/problem/0120.md"
				},
				{
					"text": "0121-买卖股票的最佳时机",
					"link": "/leetcode/problem/0121.md"
				},
				{
					"text": "0122-买卖股票的最佳时机 II",
					"link": "/leetcode/problem/0122.md"
				},
				{
					"text": "0123-买卖股票的最佳时机 III",
					"link": "/leetcode/problem/0123.md"
				},
				{
					"text": "0125-验证回文串",
					"link": "/leetcode/problem/0125.md"
				},
				{
					"text": "0128-最长连续序列",
					"link": "/leetcode/problem/0128.md"
				},
				{
					"text": "0129-求根节点到叶节点数字之和",
					"link": "/leetcode/problem/0129.md"
				},
				{
					"text": "0131-分割回文串",
					"link": "/leetcode/problem/0131.md"
				},
				{
					"text": "0133-克隆图",
					"link": "/leetcode/problem/0133.md"
				},
				{
					"text": "0134-加油站",
					"link": "/leetcode/problem/0134.md"
				},
				{
					"text": "0136-只出现一次的数字",
					"link": "/leetcode/problem/0136.md"
				},
				{
					"text": "0138-复制带随机指针的链表",
					"link": "/leetcode/problem/0138.md"
				},
				{
					"text": "0139-单词拆分",
					"link": "/leetcode/problem/0139.md"
				},
				{
					"text": "0141-环形链表",
					"link": "/leetcode/problem/0141.md"
				},
				{
					"text": "0142-环形链表 II",
					"link": "/leetcode/problem/0142.md"
				},
				{
					"text": "0143-重排链表",
					"link": "/leetcode/problem/0143.md"
				},
				{
					"text": "0144-二叉树的前序遍历",
					"link": "/leetcode/problem/0144.md"
				},
				{
					"text": "0145-二叉树的后序遍历",
					"link": "/leetcode/problem/0145.md"
				},
				{
					"text": "0146-LRU 缓存",
					"link": "/leetcode/problem/0146.md"
				},
				{
					"text": "0147-对链表进行插入排序",
					"link": "/leetcode/problem/0147.md"
				},
				{
					"text": "0148-排序链表",
					"link": "/leetcode/problem/0148.md"
				},
				{
					"text": "0150-逆波兰表达式求值",
					"link": "/leetcode/problem/0150.md"
				},
				{
					"text": "0151-反转字符串中的单词",
					"link": "/leetcode/problem/0151.md"
				},
				{
					"text": "0152-乘积最大子数组",
					"link": "/leetcode/problem/0152.md"
				},
				{
					"text": "0153-寻找旋转排序数组中的最小值",
					"link": "/leetcode/problem/0153.md"
				},
				{
					"text": "0154-寻找旋转排序数组中的最小值 II",
					"link": "/leetcode/problem/0154.md"
				},
				{
					"text": "0155-最小栈",
					"link": "/leetcode/problem/0155.md"
				},
				{
					"text": "0156-上下翻转二叉树",
					"link": "/leetcode/problem/0156.md"
				},
				{
					"text": "0160-相交链表",
					"link": "/leetcode/problem/0160.md"
				},
				{
					"text": "0162-寻找峰值",
					"link": "/leetcode/problem/0162.md"
				},
				{
					"text": "0167-两数之和 II - 输入有序数组",
					"link": "/leetcode/problem/0167.md"
				},
				{
					"text": "0169-多数元素",
					"link": "/leetcode/problem/0169.md"
				},
				{
					"text": "0173-二叉搜索树迭代器",
					"link": "/leetcode/problem/0173.md"
				},
				{
					"text": "0174-地下城游戏",
					"link": "/leetcode/problem/0174.md"
				},
				{
					"text": "0188-买卖股票的最佳时机 IV",
					"link": "/leetcode/problem/0188.md"
				},
				{
					"text": "0189-轮转数组",
					"link": "/leetcode/problem/0189.md"
				},
				{
					"text": "0191-位1的个数",
					"link": "/leetcode/problem/0191.md"
				},
				{
					"text": "0198-打家劫舍",
					"link": "/leetcode/problem/0198.md"
				},
				{
					"text": "0199-二叉树的右视图",
					"link": "/leetcode/problem/0199.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0200-0299",
			"items": [
				{
					"text": "0202-快乐数",
					"link": "/leetcode/problem/0202.md"
				},
				{
					"text": "0203-移除链表元素",
					"link": "/leetcode/problem/0203.md"
				},
				{
					"text": "0206-反转链表",
					"link": "/leetcode/problem/0206.md"
				},
				{
					"text": "0215-数组中的第K个最大元素",
					"link": "/leetcode/problem/0215.md"
				},
				{
					"text": "0216-组合总和 III",
					"link": "/leetcode/problem/0216.md"
				},
				{
					"text": "0217-存在重复元素",
					"link": "/leetcode/problem/0217.md"
				},
				{
					"text": "0219-存在重复元素 II",
					"link": "/leetcode/problem/0219.md"
				},
				{
					"text": "0221-最大正方形",
					"link": "/leetcode/problem/0221.md"
				},
				{
					"text": "0222-完全二叉树的节点个数",
					"link": "/leetcode/problem/0222.md"
				},
				{
					"text": "0224-基本计算器",
					"link": "/leetcode/problem/0224.md"
				},
				{
					"text": "0225-用队列实现栈",
					"link": "/leetcode/problem/0225.md"
				},
				{
					"text": "0226-翻转二叉树",
					"link": "/leetcode/problem/0226.md"
				},
				{
					"text": "0230-二叉搜索树中第K小的元素",
					"link": "/leetcode/problem/0230.md"
				},
				{
					"text": "0232-用栈实现队列",
					"link": "/leetcode/problem/0232.md"
				},
				{
					"text": "0234-回文链表",
					"link": "/leetcode/problem/0234.md"
				},
				{
					"text": "0235-二叉搜索树的最近公共祖先",
					"link": "/leetcode/problem/0235.md"
				},
				{
					"text": "0236-二叉树的最近公共祖先",
					"link": "/leetcode/problem/0236.md"
				},
				{
					"text": "0237-删除链表中的节点",
					"link": "/leetcode/problem/0237.md"
				},
				{
					"text": "0238-除自身以外数组的乘积",
					"link": "/leetcode/problem/0238.md"
				},
				{
					"text": "0240-搜索二维矩阵 II",
					"link": "/leetcode/problem/0240.md"
				},
				{
					"text": "0242-有效的字母异位词",
					"link": "/leetcode/problem/0242.md"
				},
				{
					"text": "0257-二叉树的所有路径",
					"link": "/leetcode/problem/0257.md"
				},
				{
					"text": "0259-较小的三数之和",
					"link": "/leetcode/problem/0259.md"
				},
				{
					"text": "0264-丑数 II",
					"link": "/leetcode/problem/0264.md"
				},
				{
					"text": "0268-丢失的数字",
					"link": "/leetcode/problem/0268.md"
				},
				{
					"text": "0278-第一个错误的版本",
					"link": "/leetcode/problem/0278.md"
				},
				{
					"text": "0279-完全平方数",
					"link": "/leetcode/problem/0279.md"
				},
				{
					"text": "0283-移动零",
					"link": "/leetcode/problem/0283.md"
				},
				{
					"text": "0290-单词规律",
					"link": "/leetcode/problem/0290.md"
				},
				{
					"text": "0297-二叉树的序列化与反序列化",
					"link": "/leetcode/problem/0297.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0300-0399",
			"items": [
				{
					"text": "0300-最长递增子序列",
					"link": "/leetcode/problem/0300.md"
				},
				{
					"text": "0303-区域和检索 - 数组不可变",
					"link": "/leetcode/problem/0303.md"
				},
				{
					"text": "0307-区域和检索 - 数组可修改",
					"link": "/leetcode/problem/0307.md"
				},
				{
					"text": "0309-最佳买卖股票时机含冷冻期",
					"link": "/leetcode/problem/0309.md"
				},
				{
					"text": "0316-去除重复字母",
					"link": "/leetcode/problem/0316.md"
				},
				{
					"text": "0322-零钱兑换",
					"link": "/leetcode/problem/0322.md"
				},
				{
					"text": "0328-奇偶链表",
					"link": "/leetcode/problem/0328.md"
				},
				{
					"text": "0343-整数拆分",
					"link": "/leetcode/problem/0343.md"
				},
				{
					"text": "0344-反转字符串",
					"link": "/leetcode/problem/0344.md"
				},
				{
					"text": "0345-反转字符串中的元音字母",
					"link": "/leetcode/problem/0345.md"
				},
				{
					"text": "0346-数据流中的移动平均值",
					"link": "/leetcode/problem/0346.md"
				},
				{
					"text": "0347-前 K 个高频元素",
					"link": "/leetcode/problem/0347.md"
				},
				{
					"text": "0354-undefined",
					"link": "/leetcode/problem/0354.md"
				},
				{
					"text": "0355-undefined",
					"link": "/leetcode/problem/0355.md"
				},
				{
					"text": "0366-undefined",
					"link": "/leetcode/problem/0366.md"
				},
				{
					"text": "0369-undefined",
					"link": "/leetcode/problem/0369.md"
				},
				{
					"text": "0373-undefined",
					"link": "/leetcode/problem/0373.md"
				},
				{
					"text": "0374-undefined",
					"link": "/leetcode/problem/0374.md"
				},
				{
					"text": "0375-undefined",
					"link": "/leetcode/problem/0375.md"
				},
				{
					"text": "0378-undefined",
					"link": "/leetcode/problem/0378.md"
				},
				{
					"text": "0379-undefined",
					"link": "/leetcode/problem/0379.md"
				},
				{
					"text": "0380-O(1) 时间插入、删除和获取随机元素",
					"link": "/leetcode/problem/0380.md"
				},
				{
					"text": "0382-undefined",
					"link": "/leetcode/problem/0382.md"
				},
				{
					"text": "0383-undefined",
					"link": "/leetcode/problem/0383.md"
				},
				{
					"text": "0392-undefined",
					"link": "/leetcode/problem/0392.md"
				},
				{
					"text": "0394-字符串解码",
					"link": "/leetcode/problem/0394.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0400-0499",
			"items": [
				{
					"text": "0416-分割等和子集",
					"link": "/leetcode/problem/0416.md"
				},
				{
					"text": "0426-undefined",
					"link": "/leetcode/problem/0426.md"
				},
				{
					"text": "0430-undefined",
					"link": "/leetcode/problem/0430.md"
				},
				{
					"text": "0442-undefined",
					"link": "/leetcode/problem/0442.md"
				},
				{
					"text": "0445-undefined",
					"link": "/leetcode/problem/0445.md"
				},
				{
					"text": "0450-删除二叉搜索树中的节点",
					"link": "/leetcode/problem/0450.md"
				},
				{
					"text": "0451-undefined",
					"link": "/leetcode/problem/0451.md"
				},
				{
					"text": "0474-undefined",
					"link": "/leetcode/problem/0474.md"
				},
				{
					"text": "0485-undefined",
					"link": "/leetcode/problem/0485.md"
				},
				{
					"text": "0494-目标和",
					"link": "/leetcode/problem/0494.md"
				},
				{
					"text": "0496-undefined",
					"link": "/leetcode/problem/0496.md"
				},
				{
					"text": "0498-undefined",
					"link": "/leetcode/problem/0498.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0500-0599",
			"items": [
				{
					"text": "0503-undefined",
					"link": "/leetcode/problem/0503.md"
				},
				{
					"text": "0506-undefined",
					"link": "/leetcode/problem/0506.md"
				},
				{
					"text": "0509-undefined",
					"link": "/leetcode/problem/0509.md"
				},
				{
					"text": "0514-undefined",
					"link": "/leetcode/problem/0514.md"
				},
				{
					"text": "0516-undefined",
					"link": "/leetcode/problem/0516.md"
				},
				{
					"text": "0518-undefined",
					"link": "/leetcode/problem/0518.md"
				},
				{
					"text": "0530-undefined",
					"link": "/leetcode/problem/0530.md"
				},
				{
					"text": "0543-二叉树的直径",
					"link": "/leetcode/problem/0543.md"
				},
				{
					"text": "0559-undefined",
					"link": "/leetcode/problem/0559.md"
				},
				{
					"text": "0572-undefined",
					"link": "/leetcode/problem/0572.md"
				},
				{
					"text": "0583-undefined",
					"link": "/leetcode/problem/0583.md"
				},
				{
					"text": "0589-undefined",
					"link": "/leetcode/problem/0589.md"
				},
				{
					"text": "0590-undefined",
					"link": "/leetcode/problem/0590.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0600-0699",
			"items": [
				{
					"text": "0611-undefined",
					"link": "/leetcode/problem/0611.md"
				},
				{
					"text": "0617-合并二叉树",
					"link": "/leetcode/problem/0617.md"
				},
				{
					"text": "0622-undefined",
					"link": "/leetcode/problem/0622.md"
				},
				{
					"text": "0637-undefined",
					"link": "/leetcode/problem/0637.md"
				},
				{
					"text": "0654-undefined",
					"link": "/leetcode/problem/0654.md"
				},
				{
					"text": "0678-undefined",
					"link": "/leetcode/problem/0678.md"
				},
				{
					"text": "0682-undefined",
					"link": "/leetcode/problem/0682.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0700-0799",
			"items": [
				{
					"text": "0700-undefined",
					"link": "/leetcode/problem/0700.md"
				},
				{
					"text": "0701-undefined",
					"link": "/leetcode/problem/0701.md"
				},
				{
					"text": "0703-undefined",
					"link": "/leetcode/problem/0703.md"
				},
				{
					"text": "0704-undefined",
					"link": "/leetcode/problem/0704.md"
				},
				{
					"text": "0705-undefined",
					"link": "/leetcode/problem/0705.md"
				},
				{
					"text": "0706-undefined",
					"link": "/leetcode/problem/0706.md"
				},
				{
					"text": "0707-undefined",
					"link": "/leetcode/problem/0707.md"
				},
				{
					"text": "0712-undefined",
					"link": "/leetcode/problem/0712.md"
				},
				{
					"text": "0714-undefined",
					"link": "/leetcode/problem/0714.md"
				},
				{
					"text": "0724-undefined",
					"link": "/leetcode/problem/0724.md"
				},
				{
					"text": "0739-每日温度",
					"link": "/leetcode/problem/0739.md"
				},
				{
					"text": "0783-二叉搜索树节点最小距离",
					"link": "/leetcode/problem/0783.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0800-0899",
			"items": [
				{
					"text": "0844-比较含退格的字符串",
					"link": "/leetcode/problem/0844.md"
				},
				{
					"text": "0876-链表的中间结点",
					"link": "/leetcode/problem/0876.md"
				},
				{
					"text": "0880-索引处的解码字符串",
					"link": "/leetcode/problem/0880.md"
				},
				{
					"text": "0889-根据前序和后序遍历构造二叉树",
					"link": "/leetcode/problem/0889.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "0900-0999",
			"items": [
				{
					"text": "0931-下降路径最小和",
					"link": "/leetcode/problem/0931.md"
				},
				{
					"text": "0946-验证栈序列",
					"link": "/leetcode/problem/0946.md"
				},
				{
					"text": "0958-二叉树的完全性检验",
					"link": "/leetcode/problem/0958.md"
				},
				{
					"text": "0973-最接近原点的 K 个点",
					"link": "/leetcode/problem/0973.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "1000-1099",
			"items": [
				{
					"text": "1008-前序遍历构造二叉搜索树",
					"link": "/leetcode/problem/1008.md"
				},
				{
					"text": "1021-删除最外层的括号",
					"link": "/leetcode/problem/1021.md"
				},
				{
					"text": "1047-删除字符串中的所有相邻重复项",
					"link": "/leetcode/problem/1047.md"
				},
				{
					"text": "1049-最后一块石头的重量 II",
					"link": "/leetcode/problem/1049.md"
				},
				{
					"text": "1081-不同字符的最小子序列",
					"link": "/leetcode/problem/1081.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "1100-1199",
			"items": [
				{
					"text": "1137-第 N 个泰波那契数",
					"link": "/leetcode/problem/1137.md"
				},
				{
					"text": "1143-最长公共子序列",
					"link": "/leetcode/problem/1143.md"
				},
				{
					"text": "1190-反转每对括号间的子串",
					"link": "/leetcode/problem/1190.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "1300-1399",
			"items": [
				{
					"text": "1312-让字符串成为回文串的最少插入次数",
					"link": "/leetcode/problem/1312.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "1400-1499",
			"items": [
				{
					"text": "1441-用栈操作构建数组",
					"link": "/leetcode/problem/1441.md"
				},
				{
					"text": "1472-设计浏览器历史记录",
					"link": "/leetcode/problem/1472.md"
				},
				{
					"text": "1475-商品折扣后的最终价格",
					"link": "/leetcode/problem/1475.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "1500-1599",
			"items": [
				{
					"text": "1522-N 叉树的直径",
					"link": "/leetcode/problem/1522.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "2100-2199",
			"items": [
				{
					"text": "2196-根据描述创建二叉树",
					"link": "/leetcode/problem/2196.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "面试题",
			"items": [
				{
					"text": "i_16.25-undefined",
					"link": "/leetcode/problem/i_16.25.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "剑指 Offer",
			"items": [
				{
					"text": "jz_offer_03_1-数组中重复的数字",
					"link": "/leetcode/problem/jz_offer_03_1.md"
				},
				{
					"text": "jz_offer_04_1-二维数组中的查找",
					"link": "/leetcode/problem/jz_offer_04_1.md"
				},
				{
					"text": "jz_offer_05_1-替换空格",
					"link": "/leetcode/problem/jz_offer_05_1.md"
				},
				{
					"text": "jz_offer_06_1-从尾到头打印链表",
					"link": "/leetcode/problem/jz_offer_06_1.md"
				},
				{
					"text": "jz_offer_07_1-重建二叉树",
					"link": "/leetcode/problem/jz_offer_07_1.md"
				},
				{
					"text": "jz_offer_09_1-用两个栈实现队列",
					"link": "/leetcode/problem/jz_offer_09_1.md"
				},
				{
					"text": "jz_offer_10_1-undefined",
					"link": "/leetcode/problem/jz_offer_10_1.md"
				},
				{
					"text": "jz_offer_10_2-undefined",
					"link": "/leetcode/problem/jz_offer_10_2.md"
				},
				{
					"text": "jz_offer_11_1-旋转数组的最小数字",
					"link": "/leetcode/problem/jz_offer_11_1.md"
				},
				{
					"text": "jz_offer_12_1-矩阵中的路径",
					"link": "/leetcode/problem/jz_offer_12_1.md"
				},
				{
					"text": "jz_offer_13_1-机器人的运动范围",
					"link": "/leetcode/problem/jz_offer_13_1.md"
				},
				{
					"text": "jz_offer_14_1-剪绳子",
					"link": "/leetcode/problem/jz_offer_14_1.md"
				},
				{
					"text": "jz_offer_14_2-剪绳子 II",
					"link": "/leetcode/problem/jz_offer_14_2.md"
				},
				{
					"text": "jz_offer_15_1-二进制中1的个数",
					"link": "/leetcode/problem/jz_offer_15_1.md"
				},
				{
					"text": "jz_offer_16_1-数值的整数次方",
					"link": "/leetcode/problem/jz_offer_16_1.md"
				},
				{
					"text": "jz_offer_17_1-打印从1到最大的n位数",
					"link": "/leetcode/problem/jz_offer_17_1.md"
				},
				{
					"text": "jz_offer_18_1-删除链表的节点",
					"link": "/leetcode/problem/jz_offer_18_1.md"
				},
				{
					"text": "jz_offer_19_1-正则表达式匹配",
					"link": "/leetcode/problem/jz_offer_19_1.md"
				},
				{
					"text": "jz_offer_21_1-调整数组顺序使奇数位于偶数前面",
					"link": "/leetcode/problem/jz_offer_21_1.md"
				},
				{
					"text": "jz_offer_22_1-链表中倒数第k个节点",
					"link": "/leetcode/problem/jz_offer_22_1.md"
				},
				{
					"text": "jz_offer_24_1-反转链表",
					"link": "/leetcode/problem/jz_offer_24_1.md"
				},
				{
					"text": "jz_offer_25_1-合并两个排序的链表",
					"link": "/leetcode/problem/jz_offer_25_1.md"
				},
				{
					"text": "jz_offer_26_1-树的子结构",
					"link": "/leetcode/problem/jz_offer_26_1.md"
				},
				{
					"text": "jz_offer_27_1-二叉树的镜像",
					"link": "/leetcode/problem/jz_offer_27_1.md"
				},
				{
					"text": "jz_offer_28_1-对称的二叉树",
					"link": "/leetcode/problem/jz_offer_28_1.md"
				},
				{
					"text": "jz_offer_29_1-顺时针打印矩阵",
					"link": "/leetcode/problem/jz_offer_29_1.md"
				},
				{
					"text": "jz_offer_30_1-包含min函数的栈",
					"link": "/leetcode/problem/jz_offer_30_1.md"
				},
				{
					"text": "jz_offer_31_1-栈的压入、弹出序列",
					"link": "/leetcode/problem/jz_offer_31_1.md"
				},
				{
					"text": "jz_offer_32_1-从上到下打印二叉树",
					"link": "/leetcode/problem/jz_offer_32_1.md"
				},
				{
					"text": "jz_offer_32_2-从上到下打印二叉树 II",
					"link": "/leetcode/problem/jz_offer_32_2.md"
				},
				{
					"text": "jz_offer_32_3-从上到下打印二叉树 III",
					"link": "/leetcode/problem/jz_offer_32_3.md"
				},
				{
					"text": "jz_offer_33_1-二叉搜索树的后序遍历序列",
					"link": "/leetcode/problem/jz_offer_33_1.md"
				},
				{
					"text": "jz_offer_34_1-二叉树中和为某一值的路径",
					"link": "/leetcode/problem/jz_offer_34_1.md"
				},
				{
					"text": "jz_offer_35_1-复杂链表的复制",
					"link": "/leetcode/problem/jz_offer_35_1.md"
				},
				{
					"text": "jz_offer_36_1-二叉搜索树与双向链表",
					"link": "/leetcode/problem/jz_offer_36_1.md"
				},
				{
					"text": "jz_offer_37_1-序列化二叉树",
					"link": "/leetcode/problem/jz_offer_37_1.md"
				},
				{
					"text": "jz_offer_38_1-字符串的排列",
					"link": "/leetcode/problem/jz_offer_38_1.md"
				},
				{
					"text": "jz_offer_39_1-数组中出现次数超过一半的数字",
					"link": "/leetcode/problem/jz_offer_39_1.md"
				},
				{
					"text": "jz_offer_42_1-连续子数组的最大和",
					"link": "/leetcode/problem/jz_offer_42_1.md"
				},
				{
					"text": "jz_offer_47_1-礼物的最大价值",
					"link": "/leetcode/problem/jz_offer_47_1.md"
				},
				{
					"text": "jz_offer_48_1-最长不含重复字符的子字符串",
					"link": "/leetcode/problem/jz_offer_48_1.md"
				},
				{
					"text": "jz_offer_49_1-丑数",
					"link": "/leetcode/problem/jz_offer_49_1.md"
				},
				{
					"text": "jz_offer_50_1-第一个只出现一次的字符",
					"link": "/leetcode/problem/jz_offer_50_1.md"
				},
				{
					"text": "jz_offer_52_1-两个链表的第一个公共节点",
					"link": "/leetcode/problem/jz_offer_52_1.md"
				},
				{
					"text": "jz_offer_53_1-在排序数组中查找数字 I",
					"link": "/leetcode/problem/jz_offer_53_1.md"
				},
				{
					"text": "jz_offer_53_2-0～n-1中缺失的数字",
					"link": "/leetcode/problem/jz_offer_53_2.md"
				},
				{
					"text": "jz_offer_54_1-二叉搜索树的第k大节点",
					"link": "/leetcode/problem/jz_offer_54_1.md"
				},
				{
					"text": "jz_offer_55_1-二叉树的深度",
					"link": "/leetcode/problem/jz_offer_55_1.md"
				},
				{
					"text": "jz_offer_58_1-undefined",
					"link": "/leetcode/problem/jz_offer_58_1.md"
				},
				{
					"text": "jz_offer_61_1-扑克牌中的顺子",
					"link": "/leetcode/problem/jz_offer_61_1.md"
				},
				{
					"text": "jz_offer_63_1-股票的最大利润",
					"link": "/leetcode/problem/jz_offer_63_1.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		},
		{
			"text": "jz_offer_II",
			"items": [
				{
					"text": "jz_offer_II_027-回文链表",
					"link": "/leetcode/problem/jz_offer_II_027.md"
				},
				{
					"text": "jz_offer_II_031-最近最少使用缓存",
					"link": "/leetcode/problem/jz_offer_II_031.md"
				},
				{
					"text": "jz_offer_II_101-分割等和子集",
					"link": "/leetcode/problem/jz_offer_II_101.md"
				}
			],
			"collapsible": true,
			"collapsed": true
		}
	],
	"collapsible": true,
	"collapsed": true
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