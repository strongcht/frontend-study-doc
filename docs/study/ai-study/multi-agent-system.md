# 多智能体系统（Multi-Agent System）

本章介绍多智能体系统（Multi-Agent System）。多智能体系统通过多个 Agent 的协作来完成复杂任务，这是构建大规模 AI 系统的关键技术，能够实现单一 Agent 无法完成的复杂功能。

---

## 多 Agent 架构基础

多 Agent 系统的核心挑战包括三个方面：

- **分工问题**：如何将任务合理分配给不同的 Agent
- **通信问题**：Agent 之间如何传递信息
- **协调问题**：如何确保多个 Agent 的行动一致且高效

### 基本架构模式

#### 层次架构（Hierarchical）

层次架构采用树状结构，有一个主 Agent 负责调度：

- 主 Agent（Orchestrator）负责任务分解和结果整合
- 从 Agent（Subagent）负责执行具体任务

```
Orchestrator (调度者)
    |
    +-- Agent A (专家A)
    +-- Agent B (专家B)
    +-- Agent C (专家C)
```

#### 平级架构（Peer-to-Peer）

平级架构中所有 Agent 地位平等，直接通信协作。适合 Agent 之间需要频繁对等交互的场景。

```
Agent A <--> Agent B
    |           |
    v           v
Agent C <--> Agent D
```

---

## 角色分工与协作

有效的多 Agent 系统需要明确的角色定义。每个 Agent 应该有自己的专长和职责范围。协作机制确保多个 Agent 能够协调工作。

### 常见角色定义

- **规划者（Planner）**：分解复杂任务，制定执行计划
- **执行者（Executor）**：调用工具，执行具体操作
- **审核者（Reviewer）**：评估结果，提出改进建议
- **协调者（Coordinator）**：管理 Agent 间的通信和任务分配

### 代码实现

```python
class Agent:
    """
    基础 Agent 类
    每个 Agent 有自己的角色、工具和执行逻辑
    """

    def __init__(self, role, llm, tools):
        self.role = role
        self.llm = llm
        self.tools = tools

    def execute(self, task, context=None):
        """
        执行任务
        :param task: 任务描述
        :param context: 上下文信息
        :return: 执行结果
        """
        prompt = self.build_prompt(task, context)
        response = self.llm.generate(prompt)

        if response.needs_tool_call:
            return self.execute_tool(response)

        return response.content

    def build_prompt(self, task, context):
        """构建 Agent 的提示词"""
        return f"角色：{self.role}\n任务：{task}\n上下文：{context}"

    def execute_tool(self, response):
        """执行工具调用"""
        tool_name = response.tool_name
        tool_input = response.tool_input
        tool = self.get_tool(tool_name)
        return tool.execute(tool_input)


class MultiAgentSystem:
    """
    多 Agent 协作系统
    负责管理多个 Agent 之间的协作
    """

    def __init__(self, agents, coordinator):
        self.agents = {a.role: a for a in agents}
        self.coordinator = coordinator

    def solve(self, task):
        """
        解决复杂任务
        通过协调多个 Agent 协作完成
        """
        # 第一步：协调者分析任务，决定需要哪些 Agent 参与
        plan = self.coordinator.decompose(task)

        # 第二步：分发任务给相应 Agent
        results = {}
        for role, subtask in plan.subtasks.items():
            agent = self.agents.get(role)
            if agent:
                results[role] = agent.execute(subtask)

        # 第三步：协调者整合结果
        final_result = self.coordinator.integrate(results)

        return final_result


class CoordinatorAgent:
    """协调者 Agent"""

    def __init__(self, llm):
        self.llm = llm

    def decompose(self, task):
        """
        分解任务
        分析任务，决定需要哪些 Agent 以及如何分工
        """
        prompt = f"""
分析以下任务，分解为子任务并分配给合适的 Agent。

任务：{task}

请输出：
1. 需要哪些 Agent（角色）
2. 每个 Agent 负责什么子任务
3. 子任务之间的依赖关系

输出格式：JSON
"""
        response = self.llm.generate(prompt)
        return Plan.parse(response)

    def integrate(self, results):
        """整合多个 Agent 的结果"""
        prompt = f"""
整合以下 Agent 的执行结果，生成最终回答。

结果列表：
{results}

请整合并输出最终结果。
"""
        return self.llm.generate(prompt)
```

---

## AutoGen 框架

AutoGen 是微软开发的多 Agent 编程框架。它提供了一套简洁的 API 来构建多 Agent 对话系统，大大简化了多 Agent 系统的开发复杂度。

### 核心概念

- **AssistantAgent**：能够调用工具的智能助手 Agent
- **UserProxyAgent**：代表用户行为，可以执行代码和工具调用
- **GroupChat**：支持多个 Agent 之间的群聊协作
- **GroupChatManager**：管理群聊中的 Agent 交互

### 代码示例

```python
import autogen
from autogen import AssistantAgent, UserProxyAgent, GroupChat, GroupChatManager

# ==================== 配置 LLM ====================
llm_config = {
    "model": "gpt-4",
    "api_key": "your-api-key",
    "temperature": 0.7
}

# ==================== 创建单个 Agent ====================
assistant = AssistantAgent(
    name="assistant",
    system_message="你是一个有用的 Python 编程助手。你可以帮助用户编写、调试和优化代码。",
    llm_config=llm_config
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER",
    max_consecutive_auto_reply=10
)

# ==================== 单 Agent 对话 ====================
user_proxy.initiate_chat(
    assistant,
    message="帮我写一个快速排序算法"
)

# ==================== 多 Agent 群聊 ====================
coder = AssistantAgent(
    name="coder",
    system_message="你是一个 Python 编程专家，负责编写代码。",
    llm_config=llm_config
)

reviewer = AssistantAgent(
    name="reviewer",
    system_message="你是一个代码审查专家，负责审查代码质量。",
    llm_config=llm_config
)

group_chat = GroupChat(
    agents=[coder, reviewer],
    messages=[],
    max_round=10
)

manager = GroupChatManager(
    groupchat=group_chat,
    llm_config=llm_config
)

user_proxy.initiate_chat(
    manager,
    message="写一个快速排序算法并审查代码"
)
```

### 具有工具调用能力的 AutoGen 示例

```python
import autogen
from autogen import AssistantAgent, UserProxyAgent

# 定义工具列表
tools = [
    {
        "name": "calculate",
        "description": "执行数学计算",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "要计算的数学表达式，如 '2+3*5'"
                }
            },
            "required": ["expression"]
        }
    },
    {
        "name": "search_web",
        "description": "搜索网页信息",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "搜索关键词"
                }
            },
            "required": ["query"]
        }
    }
]

assistant = AssistantAgent(
    name="assistant",
    system_message="你是一个有用的助手。当需要计算或查找信息时，你可以调用相关工具。",
    llm_config={"model": "gpt-4", "api_key": "your-api-key"},
    tools=tools
)

user_proxy = UserProxyAgent(
    name="user_proxy",
    human_input_mode="NEVER"
)

user_proxy.initiate_chat(
    assistant,
    message="计算 (15 + 25) * 2 等于多少？"
)
```

---

## A2A 与 MCP 协议

多 Agent 系统需要标准化的通信协议。A2A 和 MCP 是两个重要的协议标准。

### A2A（Agent-to-Agent）协议

A2A 协议定义了 Agent 之间通信的标准格式，支持代理发现、任务协作和状态同步。

#### 核心功能

- **代理发现（Agent Discovery）**：Agent 能够发现其他 Agent 的能力和服务
- **任务协作（Task Collaboration）**：多个 Agent 能够协同完成复杂任务
- **状态同步（State Synchronization）**：Agent 之间能够同步状态信息

### MCP（Model Context Protocol）协议

MCP 是一种开放标准协议，使得 AI 模型能够安全地与外部工具和数据源连接。MCP 是工具接入的标准协议，类似于 USB 接口的作用。

#### 核心组件

- **Host**：运行 AI 应用的宿主环境
- **Client**：与 MCP 服务器建立连接的客户端
- **Server**：提供工具和资源的服务端

#### MCP 工具定义示例

```json
{
    "name": "filesystem",
    "description": "文件系统操作工具",
    "version": "1.0.0",
    "tools": [
        {
            "name": "read_file",
            "description": "读取文件内容",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件路径，必填"
                    },
                    "encoding": {
                        "type": "string",
                        "description": "文件编码，可选，默认为 utf-8"
                    }
                },
                "required": ["path"]
            }
        },
        {
            "name": "write_file",
            "description": "写入文件内容",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件路径，必填"
                    },
                    "content": {
                        "type": "string",
                        "description": "文件内容，必填"
                    }
                },
                "required": ["path", "content"]
            }
        },
        {
            "name": "list_directory",
            "description": "列出目录内容",
            "inputSchema": {
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "目录路径"
                    }
                }
            }
        }
    ],
    "resources": [
        {
            "uri": "file://config",
            "description": "配置文件"
        }
    ]
}
```

> **注意**：A2A 和 MCP 解决的问题不同。A2A 解决的是 Agent 之间的通信问题，MCP 解决的是 Agent 与外部工具的连接问题。两者可以结合使用，构建完整的多 Agent 系统。

---

## 主从 Agent 模式

主从模式是一种经典的多 Agent 架构模式。主 Agent（Orchestrator）负责任务分解和结果整合，从 Agent（Subagent）负责执行具体任务。

### 适用场景

- 任务可以清晰地分解为独立子任务的场景
- 需要不同专业技能的 Agent 协作完成的场景
- 需要中央协调和控制的复杂工作流

### 代码实现

```python
class OrchestratorAgent:
    """
    主编排 Agent（主 Agent）
    负责任务分解、分配和结果整合
    """

    def __init__(self, llm, subagents):
        self.llm = llm
        self.subagents = {a.role: a for a in subagents}

    def handle_request(self, request):
        """
        处理用户请求
        完整的编排流程
        """
        # ==================== 分析阶段 ====================
        plan = self.llm.plan(request)

        if len(plan.subtasks) == 1:
            target_role = plan.target_role
            return self.subagents[target_role].execute(plan.subtasks[0])

        # ==================== 多 Agent 协作阶段 ====================
        task_queue = self.create_task_queue(plan.subtasks)
        results = []

        while task_queue:
            parallel_tasks = self.get_parallel_tasks(task_queue)
            parallel_results = self.execute_in_parallel(parallel_tasks)
            results.extend(parallel_results)
            task_queue = self.update_queue(task_queue, parallel_results)

        # ==================== 整合阶段 ====================
        return self.integrate_results(results)

    def get_parallel_tasks(self, task_queue):
        """获取可以并行执行的任务"""
        ready_tasks = []
        for task in task_queue.tasks:
            if all(dep in task_queue.completed for dep in task.dependencies):
                ready_tasks.append(task)
        return ready_tasks

    def execute_in_parallel(self, tasks):
        """并行执行多个任务"""
        import concurrent.futures

        results = []
        with concurrent.futures.ThreadPoolExecutor() as executor:
            future_to_task = {
                executor.submit(self.execute_task, task): task
                for task in tasks
            }

            for future in concurrent.futures.as_completed(future_to_task):
                task = future_to_task[future]
                try:
                    result = future.result()
                    results.append(result)
                except Exception as e:
                    results.append(TaskResult(task=task, error=str(e)))

        return results

    def integrate_results(self, results):
        """整合多个 Agent 的结果"""
        prompt = f"""
整合以下 Agent 的执行结果，生成最终回答。

结果列表：
{results}

请整合成一个完整、连贯的回答。
"""
        return self.llm.generate(prompt)


class Subagent:
    """从 Agent 基类"""

    def __init__(self, role, llm, tools=None):
        self.role = role
        self.llm = llm
        self.tools = tools or []

    def execute(self, task):
        """执行任务的具体逻辑"""
        raise NotImplementedError
```

### 主从模式的优缺点

| 优点 | 缺点 |
|------|------|
| 结构清晰，易于理解和实现 | 主 Agent 成为单点故障 |
| 中央协调，易于控制 | 主 Agent 可能成为性能瓶颈 |
| 适合层次分明的任务 | 灵活性较低，难以动态调整 |
| 调试方便，可追踪每个子任务 | 不适合对等交互频繁的场景 |

---

## 章节小结

本章介绍了多智能体系统的核心概念和实现方法：

- **多 Agent 架构基础**：介绍了层次架构和平级架构两种基本模式
- **角色分工与协作**：通过明确的角色定义提高系统效率
- **AutoGen 框架**：提供了简化多 Agent 开发的编程框架
- **A2A 和 MCP 协议**：Agent 通信和工具接入的标准协议
- **主从 Agent 模式**：适合有明确层次结构的复杂任务

选择合适的多 Agent 架构需要根据具体场景：对于简单场景，单个 Agent 即可满足需求；对于复杂场景，需要根据任务特点选择合适的架构模式。
