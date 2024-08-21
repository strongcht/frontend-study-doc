---
layout: doc
---

## 2024 年 8 月 14 日

## 348. 设计井字棋
+ 题目描述
请在 n × n 的棋盘上，实现一个判定井字棋（Tic-Tac-Toe）胜负的神器，判断每一次玩家落子后，是否有胜出的玩家。
在这个井字棋游戏中，会有 2 名玩家，他们将轮流在棋盘上放置自己的棋子。
在实现这个判定器的过程中，你可以假设以下这些规则一定成立：
      1. 每一步棋都是在棋盘内的，并且只能被放置在一个空的格子里；
      2. 一旦游戏中有一名玩家胜出的话，游戏将不能再继续；
      3. 一个玩家如果在同一行、同一列或者同一斜对角线上都放置了自己的棋子，那么他便获得胜利。

+ 示例
```
给定棋盘边长 n = 3, 玩家 1 的棋子符号是 "X"，玩家 2 的棋子符号是 "O"。

TicTacToe toe = new TicTacToe(3);

toe.move(0, 0, 1); -> 函数返回 0 (此时，暂时没有玩家赢得这场对决)
|X| | |
| | | |    // 玩家 1 在 (0, 0) 落子。
| | | |

toe.move(0, 2, 2); -> 函数返回 0 (暂时没有玩家赢得本场比赛)
|X| |O|
| | | |    // 玩家 2 在 (0, 2) 落子。
| | | |

toe.move(2, 2, 1); -> 函数返回 0 (暂时没有玩家赢得比赛)
|X| |O|
| | | |    // 玩家 1 在 (2, 2) 落子。
| | |X|

toe.move(1, 1, 2); -> 函数返回 0 (暂没有玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 2 在 (1, 1) 落子。
| | |X|

toe.move(2, 0, 1); -> 函数返回 0 (暂无玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 1 在 (2, 0) 落子。
|X| |X|

toe.move(1, 0, 2); -> 函数返回 0 (没有玩家赢得比赛)
|X| |O|
|O|O| |    // 玩家 2 在 (1, 0) 落子.
|X| |X|

toe.move(2, 1, 1); -> 函数返回 1 (此时，玩家 1 赢得了该场比赛)
|X| |O|
|O|O| |    // 玩家 1 在 (2, 1) 落子。
|X|X|X|
```

```js
class TicTacToe {
    private n;
    private cnt;
    private board;
    constructor(n) {
        this.n = n;
        // 记录每个人的每行每列落子数， 其中（0 _ n-1） 代表row; n 代表从上到下的斜边；
        // 同理 (n + 1 _ 2n) 代表列， 2n + 1代表从左到右的斜边
        this.cnt = [new Array(n * 2 + 2).fill(0), new Array(n * 2 + 2).fill(0)];
        this.board = Array.from(new Array(n), () => new Array(n).fill(''));
    }

    move(row, col, player) {
        this.set(row, col, player);
        const cur = this.cnt[player - 1];
        cur[row]++;
        cur[this.n + col]++;

        if(row == col) {
            cur[this.n]++
        }

        if(row + col === this.n - 1) {
            cur[2 * this.n + 1]++;
        }

        if(
            cur[row] === this.n ||
            cur[this.n + col] === this.n ||
            cur[this.n] === this.n ||
            cur[2 * this.n + 1] === this.n
        ) {
            return player;
        }

        return 0;
    }

    set(row, col, player) {
        this.board[row][col] = player == 1 ? 'X' : 'O';
    }
}
```

## 340. 至多包含 K 个不同字符的最长子串
+ 题目描述
> 给你一个字符串 s 和一个整数 k ，请你找出 至多 包含 k 个 不同 字符的最长子串，并返回该子串的长度。

+ 示例
```
输入：s = "eceba", k = 2
输出：3
解释：满足题目要求的子串是 "ece" ，长度为 3 。

输入：s = "aa", k = 1
输出：2
解释：满足题目要求的子串是 "aa" ，长度为 2 。
```

```js
function lengthOfLongestSubstringKDistinct(s, k) {
    const map = new Map();
    let res = 0;
    let r = 0;
    for(let i = 0; i < s.length; i++) {
        if(i != 0) {
            const val = map.get(s[i - 1]);
            if(val == 1) {
                map.delete(s[i - 1]);
            } else {
                map.set(s[i - 1], val - 1);
            }
        }

        while(map.size <= k && r < s.length) {
            if(map.size == k) {
                if(map.has(s[r])) {
                    const val = map.get(s[r]);
                    map.set(s[r], val + 1);
                    r++;
                } else {
                    break;
                }
            } else {
                if(!map.has(s[r]) ) {
                    map.set(s[r], 1);
                } else {
                    const val = map.get(s[r]);
                    map.set(s[r], val + 1);
                }
                r++;
            }
        }

        res = Math.max(r - i, res);
    }
    return res;
}

console.log(lengthOfLongestSubstringKDistinct('aa', 1))
```

```js
// 给你一个整数数组 nums ，按要求返回一个新数组 counts 。数组 counts 有该性质： counts[i] 的值是  nums[i] 右侧小于 nums[i] 的元素的数量。
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var countSmaller = function(nums) {
// 输入：nums = [5,2,6,1]
// 输出：[2,1,1,0] 
// 解释：
// 5 的右侧有 2 个更小的元素 (2 和 1)
// 2 的右侧仅有 1 个更小的元素 (1)
// 6 的右侧有 1 个更小的元素 (1)
// 1 的右侧有 0 个更小的元素
    // 会超时
    // const len = nums.length;
    // const res = [];
    
    // for(let i = len - 1; i >= 0; i--) {
    //     let count = 0;
    //     for(let j = i; j < len; j++) {
    //         if(nums[j] < nums[i]) {
    //             count++;
    //         }
    //     }
    //     res.unshift(count);
    // }
    // return res;

    // 二分查找



};

console.log(countSmaller([5,2,6,1]))
```

```js
// 数据样例1
// 输入：2 1 4
// 输出：2 7 4
// 样例2：
// 输入：2 3 6 1 4
// 输出：11 9 6 11 4
// 从每个下标开始，合并相邻的比自己大的价值，可以多次合并。

 // 找出左侧比a[i]小的最小值
    for(let i = 0; i < n; i++) {
        while(stack.length && stack[stack.length - 1] >= a[i]) {
            stack.pop();
        }
        if(stack.length) {
            left[i] = stack[stack.length - 1];
        }
        stack.push(a[i]);
    }

const maxSumSide = (nums) => {

    // dp[i] = Math.max(sumLeft[i], sumRight[i]);
    let stack = [];
    const len = nums.length;

    const left = new Array(len).fill(0);
    debugger;
    for(let i = 0; i < len; i++) {
        while(stack.length && stack[stack.length - 1] >= nums[i]) {
            stack.pop();
        }
        if(stack.length) {
            left[i] = stack[stack.length - 1];
        }
        stack.push(nums[i]);
    }


};


console.log(maxSumSide([2, 3, 6, 1, 4]))
```