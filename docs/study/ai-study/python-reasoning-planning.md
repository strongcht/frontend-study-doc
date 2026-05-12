# Python 推理与规划

## 概述

本章介绍 AI Agent 的核心推理与规划能力。与传统的指令执行模式不同，具备推理能力的 Agent 能够处理复杂的思维过程、将任务分解为可执行步骤，并基于上下文做出决策。

---

## ReAct 框架

ReAct（Reasoning + Acting）将推理与行动结合在循环框架中。Agent 在推理和行动之间交替进行，每次行动的结果都为下一次推理提供信息 — 模拟人类先思考再行动、观察结果后继续思考的方式。

### 工作原理

核心循环包含三个阶段：

1. **推理（Reasoning）**：Agent 基于当前上下文生成下一步行动
2. **行动（Action）**：Agent 执行选定的工具或动作
3. **观察（Observation）**：Agent 接收结果，更新上下文，返回步骤 1

### 代码实现

```python
class ReActAgent:
    """
    ReAct 框架的 Agent 实现
    核心机制：推理 -> 行动 -> 观察 -> 推理（循环）
    """

    def __init__(self, llm, tools, max_iterations=5):
        # LLM 实例，用于推理和生成
        self.llm = llm
        # 可用工具列表
        self.tools = tools
        # 最大迭代次数，防止无限循环
        self.max_iterations = max_iterations

    def run(self, task):
        """
        执行 ReAct 循环
        :param task: 用户任务描述
        :return: 执行结果
        """
        # 初始化上下文，包含任务和历史信息
        context = {
            "task": task,
            "steps": [],      # 已执行步骤的记录
            "observations": []  # 观察结果的记录
        }

        for i in range(self.max_iterations):
            # 阶段一：推理 - 基于当前上下文生成下一步行动
            reasoning = self.llm.reason(context)

            # 判断是否需要执行工具，还是直接返回答案
            if reasoning.needs_action:
                # 选择要使用的工具
                action = reasoning.select_tool(self.tools)
                # 执行工具并获取观察结果
                observation = action.execute(reasoning.tool_input)
                # 将观察结果添加到上下文
                context["observations"].append(observation)
            else:
                # 不需要行动，直接返回推理得出的答案
                return reasoning.answer

        # 达到最大迭代次数仍未完成
        return "达到最大迭代次数限制"
```

### 典型应用场景

ReAct 适合需要探索环境和收集信息的任务，如智能搜索、对话式问答、需要多个中间步骤的复杂问题求解。

> 注意：ReAct 的灵活性允许根据每一步的结果动态调整，但执行路径可能不稳定 — 最适合探索性任务。

---

## 思维链（Chain of Thought, CoT）

思维链是一种提示模型展示逐步推理过程的技术，而非直接跳到答案。

### 为什么需要 CoT

直接生成答案存在问题：中间推理步骤被跳过、错误难以定位、用户无法理解模型的思考过程。

### Zero-shot CoT

Zero-shot CoT 不需要示例即可触发逐步推理 — 只需在提示末尾添加触发短语如"让我们一步一步地思考"。

```python
# Zero-shot CoT 的提示词模板
prompt = """
问题：小明有 5 个苹果，小红给了他 3 个，小明吃掉了 2 个，还剩多少个？
让我们一步一步地思考：
"""

# 调用语言模型
response = llm.generate(prompt)

# 模型输出示例：
# 第一步：计算小明收到苹果后的总数
# 小明原来有 5 个苹果，小红给了他 3 个
# 5 + 3 = 8 个
#
# 第二步：计算吃掉后的数量
# 小明吃掉了 2 个
# 8 - 2 = 6 个
#
# 结论：还剩 6 个苹果
```

### Few-shot CoT

Few-shot CoT 提供带有详细推理过程的示例，帮助模型学习特定的推理模式。当 Zero-shot CoT 效果不够好时使用。

```python
# Few-shot CoT 的提示词模板
prompt = """
示例 1：
问题：小张有 10 元钱，买了 3 本书，每本 2 元，还剩多少？
让我们一步一步地思考：
- 小张原来有 10 元
- 每本书 2 元，买了 3 本，花费 3 × 2 = 6 元
- 10 - 6 = 4 元
答案：还剩 4 元

示例 2：
问题：一只猫每小时抓 2 只老鼠，8 小时抓了多少只？
让我们一步一步地思考：
- 每小时抓 2 只老鼠
- 8 小时抓了 8 × 2 = 16 只
答案：抓了 16 只

问题：{user_question}
让我们一步一步地思考：
"""

response = llm.generate(prompt)
```

### CoT 的优势

三大核心价值：

| 优势 | 说明 |
|------|------|
| **可追溯性** | 分解的中间步骤可被检查 |
| **可解释性** | 用户能理解答案的来源 |
| **准确性提升** | 尤其对数学和逻辑任务效果显著 |

---

## 思维树（Tree of Thoughts, ToT）

ToT 将 CoT 从线性推理扩展为树状结构。在每个推理节点上探索多个可能的路径 — 实现多路径探索、回溯和全局评估。

### 与 CoT 的区别

| 特性 | CoT | ToT |
|------|-----|-----|
| **推理方式** | 线性推理，每步依赖前一步 | 空间推理，考虑多个分支 |
| **适用场景** | 路径清晰的问题 | 需要探索和规划的问题 |
| **回溯能力** | 无 | 支持回溯 |

### 代码实现

```python
class ToTAgent:
    """
    Tree of Thoughts Agent 实现
    核心机制：在每个节点生成多个候选分支，评估后选择最优继续
    """

    def __init__(self, llm, max_depth=4, beam_size=3):
        # LLM 实例
        self.llm = llm
        # 最大搜索深度
        self.max_depth = max_depth
        # 每层保留的候选节点数量（beam width）
        self.beam_size = beam_size

    def solve(self, problem):
        """
        使用 ToT 框架解决问题
        :param problem: 问题描述
        :return: 最优解
        """
        # 创建根节点，包含问题作为初始状态
        root = ThoughtNode(problem, depth=0)
        # 初始化前沿节点列表（待扩展的节点）
        frontier = [root]

        # 逐层扩展
        for depth in range(self.max_depth):
            # 存储所有候选节点
            all_candidates = []

            # 遍历所有前沿节点
            for node in frontier:
                # 为当前节点生成多个候选下一步
                candidates = self.llm.generate_thoughts(
                    node.content,    # 当前节点内容
                    n=self.beam_size  # 生成数量
                )
                # 创建新节点并加入候选列表
                for cand in candidates:
                    all_candidates.append(
                        ThoughtNode(cand, depth + 1, parent=node)
                    )

            # 评估所有候选节点
            evaluated = self.evaluator.rank(all_candidates)

            # 选择最优的 beam_size 个节点作为下一轮前沿
            frontier = evaluated[:self.beam_size]

            # 检查是否找到解决方案
            if self.is_solution(frontier):
                break

        # 回溯找到最优解
        return self.backtrack_best(frontier)
```

### 应用场景

ToT 适合创意写作（多个故事方向）、战略规划（评估行动结果）、需要多种可能性的复杂决策。

---

## 任务规划与 MCTS

蒙特卡洛树搜索（Monte Carlo Tree Search, MCTS）是一种用于复杂决策问题的启发式搜索算法，广泛应用于游戏 AI 和复杂任务规划。

### 核心思想

MCTS 通过随机模拟评估每个决策节点的潜力，使用采样和统计来指导搜索方向，而非评估所有路径。

### MCTS 四个步骤

1. **选择（Selection）**：从根节点递归选择最优子节点到叶节点，使用 UCB（Upper Confidence Bound）公式
2. **扩展（Expansion）**：在叶节点添加一个或多个子节点
3. **模拟（Simulation）**：从新节点随机模拟到终止状态
4. **反向传播（Backpropagation）**：更新模拟路径上所有节点的统计信息

### 代码实现

```python
import math

class MCTSNode:
    """
    MCTS 树节点
    存储节点状态、统计数据和子节点关系
    """

    def __init__(self, state, parent=None, action=None):
        # 当前状态
        self.state = state
        # 父节点引用
        self.parent = parent
        # 从父节点到达此节点的动作
        self.action = action
        # 子节点列表
        self.children = []
        # 此节点的访问次数
        self.visit_count = 0
        # 此节点的累计奖励值
        self.reward = 0.0

    def is_fully_expanded(self):
        """检查是否已扩展所有可能的子节点"""
        return len(self.children) > 0

    def is_terminal(self):
        """检查是否为终止节点（游戏结束或目标达成）"""
        return self.state.is_terminal()

    def uct_child(self):
        """
        使用 UCT 公式选择最优子节点
        UCT = reward/visits + C * sqrt(ln(parent_visits)/visits)
        C 是探索常数，通常设为 sqrt(2)
        """
        # 探索常数，平衡探索与利用
        C = math.sqrt(2)

        return max(
            self.children,
            key=lambda c: c.reward / c.visit_count +
                         C * math.sqrt(math.log(self.visit_count) / c.visit_count)
        )


class MCTSPlanner:
    """
    MCTS 规划器
    使用蒙特卡洛树搜索为 Agent 生成行动规划
    """

    def __init__(self, simulation_limit=1000, exploration_constant=1.41):
        # 最大模拟次数
        self.simulation_limit = simulation_limit
        # 探索常数
        self.exploration_constant = exploration_constant

    def plan(self, initial_state):
        """
        从初始状态开始规划
        :param initial_state: 初始状态
        :return: 最优动作
        """
        # 创建根节点
        root = MCTSNode(initial_state)

        # 执行多次模拟
        for _ in range(self.simulation_limit):
            # 1. 选择：从根节点向下选择最优子节点直到叶节点
            node = self._selection(root)

            # 2. 扩展：如果不是终止节点，扩展一个新节点
            if not node.is_terminal():
                node = self._expansion(node)

            # 3. 模拟：从新节点开始随机模拟到终止
            reward = self._simulation(node)

            # 4. 反向传播：更新路径上所有节点的统计
            self._backpropagation(node, reward)

        # 返回根节点最优子节点对应的动作
        return root.best_child().action

    def _selection(self, node):
        """选择阶段：选择最优子节点"""
        while node.is_fully_expanded() and not node.is_terminal():
            node = node.uct_child()
        return node

    def _expansion(self, node):
        """扩展阶段：添加新子节点"""
        possible_actions = node.state.get_possible_actions()
        for action in possible_actions:
            new_state = node.state.apply_action(action)
            child = MCTSNode(new_state, parent=node, action=action)
            node.children.append(child)
        return node.children[0]

    def _simulation(self, node):
        """模拟阶段：随机模拟到游戏结束"""
        state = node.state
        while not state.is_terminal():
            actions = state.get_possible_actions()
            action = random.choice(actions)
            state = state.apply_action(action)
        return state.get_reward()

    def _backpropagation(self, node, reward):
        """反向传播：更新统计信息"""
        while node is not None:
            node.visit_count += 1
            node.reward += reward
            node = node.parent
```

> 注意：MCTS 计算成本较高 — 适合有明确终止条件的深度规划。对于实时任务，应限制模拟次数或使用替代方法。

---

## Reflexion（自我反思）

Reflexion 赋予 Agent 自我反思能力 — 在失败后分析错误、调整策略并重试。Agent 观察结果并自问：我为什么失败了？应该如何改进？

### 代码实现

```python
class ReflexionAgent:
    """
    具有自我反思能力的 Agent
    核心机制：执行 -> 评审 -> 反思 -> 重试
    """

    def __init__(self, actor, reviewer, max_retries=3):
        # 执行器：负责执行具体任务
        self.actor = actor
        # 评审器：负责评估执行结果
        self.reviewer = reviewer
        # 最大重试次数
        self.max_retries = max_retries

    def run(self, task):
        """
        执行带自我反思的任务
        :param task: 任务描述
        :return: 执行结果
        """
        history = []

        for attempt in range(self.max_retries):
            # 阶段一：尝试执行任务
            result = self.actor.execute(task, history)

            history.append({
                "attempt": attempt,
                "result": result
            })

            # 阶段二：评审结果
            feedback = self.reviewer.evaluate(task, result)

            # 阶段三：检查是否成功
            if feedback.is_success:
                return result

            # 阶段四：反思失败原因
            reflection = self.reviewer.reflect(
                task, result, feedback
            )

            history.append({
                "type": "reflection",
                "content": reflection
            })

        return history


class Reviewer:
    """评审器：评估执行结果并生成反思"""

    def evaluate(self, task, result):
        is_success = self.check_success(task, result)

        if is_success:
            return EvaluationResult(is_success=True)
        else:
            failure_reasons = self.analyze_failures(task, result)
            return EvaluationResult(
                is_success=False,
                reasons=failure_reasons
            )

    def reflect(self, task, result, feedback):
        prompt = f"""
任务：{task}
执行结果：{result}
失败原因：{feedback.reasons}

请分析失败原因，并给出改进建议。
重点说明：
1. 哪里出了问题？
2. 下次应该如何避免？
3. 需要改变什么策略？
"""
        return self.llm.generate(prompt)
```

### 应用场景

Reflexion 适合需要持续改进的任务（对话系统、代码生成）、错误成本高但重试成本低的场景、以及需要从失败中学习的情况。

---

## 任务分解策略

复杂任务通常需要分解为可管理的子任务。有效的分解是规划能力的基础。

### 递归任务分解

递归地将任务拆分为更小的子任务，直到可以直接执行。

```python
def decompose(task, is_executable_fn, decompose_fn):
    """
    递归分解任务
    :param task: 要分解的任务
    :param is_executable_fn: 判断任务是否可直接执行的函数
    :param decompose_fn: 分解任务的函数
    :return: 可执行任务列表
    """
    if is_executable_fn(task):
        return [task]

    subtasks = decompose_fn(task)

    result = []
    for subtask in subtasks:
        result.extend(
            decompose(subtask, is_executable_fn, decompose_fn)
        )

    return result


# 示例：判断任务是否可执行
def is_code_complete(task):
    return task.get("type") == "code" and len(task.get("dependencies", [])) == 0


# 示例：分解复杂任务
def decompose_programming_task(task):
    if "write_function" in task["type"]:
        return [
            {"type": "understand_requirements", "task": task["spec"]},
            {"type": "write_code", "spec": task["spec"]},
            {"type": "write_tests", "function": task["function_name"]},
            {"type": "verify_tests", "function": task["function_name"]}
        ]
    return [task]
```

### 并行任务分解

识别可并行运行的独立子任务，提高执行效率。

### 层次任务分解

在不同抽象层级组织任务，高层任务调用低层任务，形成任务层级树。适合需要多层抽象的复杂系统。

---

## Plan-and-Execute 模式

这种架构将规划与执行分离 — Agent 先规划整个任务流程，然后按计划执行。

### 与 ReAct 的区别

| 特性 | ReAct | Plan-and-Execute |
|------|-------|------------------|
| **方式** | 边推理边执行 | 先规划后执行 |
| **灵活性** | 更灵活 | 更稳定 |
| **路径** | 可能不稳定 | 路径明确 |
| **适用场景** | 需要动态调整 | 结构稳定的任务 |

### 代码实现

```python
class PlanAndExecuteAgent:
    """
    Plan-and-Execute 架构的 Agent
    核心机制：先完整规划，再按计划执行
    """

    def __init__(self, planner, executor):
        self.planner = planner
        self.executor = executor

    def run(self, task):
        # ==================== 规划阶段 ====================
        plan = self.planner.create_plan(task)

        # ==================== 执行阶段 ====================
        results = []

        for step in plan.steps:
            result = self.executor.execute(step)
            results.append(result)

            if self.needs_replan(results):
                plan = self.planner.replan(task, results)

        return self.summarize(results)

    def needs_replan(self, results):
        last_result = results[-1]
        if last_result.is_unexpected():
            return True
        if last_result.blocks_future():
            return True
        return False


class Planner:
    """规划器：生成任务执行计划"""

    def create_plan(self, task):
        prompt = f"""
任务：{task}

请制定详细的执行计划，包括：
1. 需要执行的步骤顺序
2. 每个步骤的具体操作
3. 步骤之间的依赖关系

输出格式：
步骤1: [操作描述]
步骤2: [操作描述]
...
"""
        plan_text = self.llm.generate(prompt)
        return Plan.parse(plan_text)

    def replan(self, task, results):
        completed = [r for r in results if r.is_success]
        failed = [r for r in results if not r.is_success]

        prompt = f"""
原始任务：{task}
已完成步骤：{completed}
失败步骤：{failed}

请制定调整后的执行计划：
"""
        plan_text = self.llm.generate(prompt)
        return Plan.parse(plan_text)


class Executor:
    """执行器：执行具体的计划步骤"""

    def execute(self, step):
        if step.type == "tool_call":
            return self.execute_tool_call(step)
        elif step.type == "code":
            return self.execute_code(step)
        elif step.type == "query":
            return self.execute_query(step)

        return Result(success=False, error="Unknown step type")
```

> 注意：Plan-and-Execute 适合结构稳定、可提前规划的任务。对于需要灵活性的环境，ReAct 可能更合适。

---

## 章节总结

本章介绍了 AI Agent 推理与规划的核心能力：

| 技术 | 描述 |
|------|------|
| **ReAct** | 推理 + 行动循环；执行过程中动态调整策略 |
| **CoT（思维链）** | 逐步展示推理过程；提高复杂任务准确性 |
| **ToT（思维树）** | CoT 的扩展，支持多路径探索和回溯 |
| **MCTS** | 启发式搜索，用于复杂决策/规划问题 |
| **Reflexion** | 自我反思能力；从失败中学习和改进 |
| **任务分解** | 规划的基础：递归、并行和层次分解 |
| **Plan-and-Execute** | 先规划后执行模式，适合结构稳定的任务 |

这些技术可以单独使用，也可以组合使用来构建更强大的 Agent 系统。
