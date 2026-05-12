# AI Agent 核心组件

一个完整的 AI Agent 系统由多个核心组件协同工作。本文将深入剖析每个组件的原理和实现方式。

---

## 整体架构

```
用户输入
  ↓
┌─────────────────────────────────────────┐
│              AI Agent                    │
│                                         │
│  ┌───────────┐    ┌──────────────────┐  │
│  │  感知层    │───→│     大脑 (LLM)   │  │
│  │ Perception │    │     Brain        │  │
│  └───────────┘    └──────┬───────────┘  │
│                          │              │
│         ┌────────────────┼────────┐     │
│         ↓                ↓        ↓     │
│  ┌──────────┐   ┌──────────┐ ┌───────┐ │
│  │  规划     │   │  记忆     │ │ 工具  │ │
│  │ Planning  │   │ Memory    │ │ Tools │ │
│  └──────────┘   └──────────┘ └───────┘ │
│                          │              │
└──────────────────────────┼──────────────┘
                           ↓
                       用户输出
```

---

## 感知层（Perception）

感知层是 Agent 与外部世界交互的入口，负责接收和处理各种输入信息。

### 输入类型

| 输入类型 | 说明 | 示例 |
| --- | --- | --- |
| **文本输入** | 用户的自然语言指令 | "帮我查一下明天的天气" |
| **结构化数据** | JSON、表格、数据库记录 | API 返回的天气数据 |
| **多模态输入** | 图片、音频、视频 | 用户上传的截图、语音指令 |
| **环境信号** | 系统事件、定时触发 | 定时任务触发、监控告警 |

### 感知层的职责

1. **输入解析**：将原始输入转换为 Agent 可理解的格式
2. **意图识别**：理解用户想要完成什么任务
3. **实体提取**：从输入中提取关键信息（如时间、地点、对象）
4. **上下文关联**：将当前输入与历史对话关联

```python
# 感知层示例
class PerceptionLayer:
    def parse_input(self, user_input: str) -> dict:
        """解析用户输入，提取意图和实体"""
        return {
            "intent": "query_weather",       # 意图
            "entities": {                     # 实体
                "city": "北京",
                "date": "明天"
            },
            "raw_input": user_input           # 原始输入
        }
```

---

## 大脑（Brain）—— LLM

大语言模型（LLM）是 Agent 的核心推理引擎，负责理解任务、生成推理过程和做出决策。

### LLM 在 Agent 中的作用

| 功能 | 说明 |
| --- | --- |
| **理解** | 解析用户意图，理解任务需求 |
| **推理** | 分析问题，生成解决方案 |
| **决策** | 在多个可能的行动中选择最优方案 |
| **生成** | 产生自然语言回复、代码、结构化数据 |

### LLM 的局限性

| 局限性 | 说明 | Agent 的应对方式 |
| --- | --- | --- |
| **知识截止** | 训练数据有时间限制 | 通过工具调用获取实时信息 |
| **无法执行操作** | 只能生成文本 | 通过工具调用执行实际操作 |
| **幻觉** | 可能生成不准确信息 | 通过工具验证、多源交叉检查 |
| **上下文窗口有限** | 能处理的文本长度有限 | 使用记忆系统管理上下文 |

### System Prompt 设计

System Prompt 是赋予 Agent "人格"和"能力说明"的关键。

```python
SYSTEM_PROMPT = """
你是一个专业的天气助手Agent。

## 你的能力
- 查询任意城市的天气信息
- 根据天气情况给出穿衣建议
- 根据天气情况给出出行建议

## 工作流程
1. 理解用户的需求
2. 使用天气工具查询天气数据
3. 分析天气数据
4. 给出专业建议

## 输出格式
- 使用清晰的结构化格式
- 包含具体数据（温度、湿度等）
- 给出实用的建议

## 限制
- 只能查询天气相关信息
- 无法进行预订操作
"""
```

---

## 工具（Tools）

工具是 Agent 与外部世界交互的桥梁，让 Agent 能够执行实际操作。

### 工具类型

| 工具类型 | 功能 | 示例 |
| --- | --- | --- |
| **信息检索** | 获取外部信息 | 搜索引擎、知识库查询 |
| **数据处理** | 分析和转换数据 | 计算器、数据分析工具 |
| **API 调用** | 调用第三方服务 | 天气 API、支付 API |
| **代码执行** | 运行代码 | Python 解释器、SQL 执行器 |
| **文件操作** | 读写文件 | 文件读取、文档生成 |
| **通信工具** | 发送消息 | 邮件发送、通知推送 |

### 工具定义格式

每个工具需要清晰的定义，让 LLM 知道何时以及如何使用它。

```python
tools = [
    {
        "name": "get_weather",
        "description": "查询指定城市的天气信息",
        "parameters": {
            "city": {
                "type": "string",
                "description": "城市名称，如'北京'、'上海'",
                "required": True
            },
            "date": {
                "type": "string",
                "description": "日期，格式为YYYY-MM-DD，默认为今天",
                "required": False
            }
        },
        "returns": {
            "type": "object",
            "description": "包含温度、湿度、天气状况等信息的对象"
        }
    }
]
```

### 工具调用流程

```
LLM 决定需要调用工具
       ↓
生成工具调用请求（工具名 + 参数）
       ↓
Agent 框架执行工具调用
       ↓
获取工具返回结果
       ↓
将结果返回给 LLM 继续推理
```

---

## 记忆（Memory）

记忆系统让 Agent 能够保留和利用历史信息，实现连续对话和学习。

### 记忆类型

#### 短期记忆（Short-term Memory）

- **定义**：当前对话会话中的上下文信息
- **生命周期**：会话结束即清除
- **实现方式**：对话历史列表
- **用途**：保持对话连贯性

```python
short_term_memory = [
    {"role": "user", "content": "北京今天天气怎么样？"},
    {"role": "assistant", "content": "北京今天晴，气温22℃"},
    {"role": "user", "content": "那明天呢？"}  # "那明天呢？"需要上下文理解
]
```

#### 长期记忆（Long-term Memory）

- **定义**：跨会话的持久化信息
- **生命周期**：长期保留
- **实现方式**：向量数据库、关系数据库
- **用途**：用户偏好学习、历史任务记录

```python
long_term_memory = {
    "user_preferences": {
        "favorite_city": "北京",
        "temperature_unit": "摄氏度",
        "language": "中文"
    },
    "task_history": [
        {"date": "2024-01-15", "task": "查询北京天气", "result": "晴"},
        {"date": "2024-01-16", "task": "查询上海天气", "result": "多云"}
    ]
}
```

#### 情节记忆（Episodic Memory）

- **定义**：对具体事件和经历的记忆
- **特点**：包含时间、地点、情境等细节
- **用途**：记住特定交互场景，用于类似情况的参考

#### 语义记忆（Semantic Memory）

- **定义**：对概念、知识和规则的记忆
- **特点**：抽象化的知识，不依赖特定场景
- **用途**：存储学到的规律和知识

### 记忆检索策略

| 策略 | 说明 | 适用场景 |
| --- | --- | --- |
| **时间排序** | 按时间顺序获取最近的记忆 | 对话上下文 |
| **相关性匹配** | 使用向量相似度匹配相关内容 | 知识检索 |
| **重要性加权** | 根据重要性评分选择记忆 | 长期记忆筛选 |
| **混合检索** | 结合多种策略 | 复杂场景 |

---

## 规划（Planning）

规划模块负责将复杂任务分解为可执行的步骤序列。

### 规划策略

#### 思维链（Chain of Thought, CoT）

将复杂推理分解为一步步的思考过程。

```
问题：一个商店有15个苹果，卖掉了8个，又进了12个，现在有多少？

思考过程：
1. 初始苹果数量：15个
2. 卖掉后：15 - 8 = 7个
3. 进货后：7 + 12 = 19个
答案：19个
```

#### ReAct 模式（Reason + Act）

交替进行推理和行动。

```
Thought: 用户想知道明天北京是否下雨，我需要查询天气
Action: get_weather(city="北京", date="明天")
Observation: 明天北京多云转小雨，气温15-22℃

Thought: 天气预报显示有小雨，需要提醒用户带伞
Action: generate_response("明天北京有小雨，建议带伞")
```

#### 思维树（Tree of Thoughts, ToT）

探索多个推理路径，选择最优方案。

```
                    问题
                   / | \
                 方案A 方案B 方案C
                / \   |   / \
              A1  A2  B1  C1  C2
              ↓       ↓
            评估     评估
              ↓       ↓
            最优     备选
```

#### 反思（Reflection）

执行后回顾结果，总结经验教训。

```
执行：调用天气API查询"北京市"→ 返回错误
反思：API可能不接受"市"字后缀
调整：改为查询"北京"→ 成功
经验：查询天气时城市名不要带"市"字
```

### 规划实现示例

```python
class Planner:
    def create_plan(self, task: str) -> list:
        """将任务分解为步骤"""
        plan = [
            {"step": 1, "action": "理解任务", "detail": "分析用户需求"},
            {"step": 2, "action": "收集信息", "detail": "调用工具获取数据"},
            {"step": 3, "action": "分析数据", "detail": "处理和分析收集的数据"},
            {"step": 4, "action": "生成结果", "detail": "输出最终结果给用户"}
        ]
        return plan

    def adjust_plan(self, plan: list, error: str) -> list:
        """根据错误调整计划"""
        # 分析错误原因，修改计划
        adjusted_plan = plan.copy()
        adjusted_plan.insert(2, {"step": "2b", "action": "重试", "detail": f"处理错误: {error}"})
        return adjusted_plan
```

---

## Agent 运行循环（Agent Loop）

Agent Loop 是将所有组件串联起来的核心机制，实现"感知→思考→行动→观察"的持续循环。

### 运行循环流程

```
┌─────────────────────────────────────────────┐
│                Agent Loop                    │
│                                             │
│  1. 感知（Perceive）                         │
│     └─ 接收用户输入 / 环境信号               │
│                    ↓                         │
│  2. 思考（Think）                            │
│     └─ LLM 分析任务，制定计划                │
│                    ↓                         │
│  3. 行动（Act）                              │
│     └─ 调用工具执行操作                      │
│                    ↓                         │
│  4. 观察（Observe）                          │
│     └─ 获取行动结果                          │
│                    ↓                         │
│  5. 记忆（Remember）                         │
│     └─ 将过程存入记忆系统                    │
│                    ↓                         │
│  6. 判断（Decide）                           │
│     ├─ 任务完成 → 输出结果                   │
│     └─ 未完成 → 回到步骤 2 继续              │
│                                             │
└─────────────────────────────────────────────┘
```

### 完整 Agent Loop 实现

```python
class AgentLoop:
    def __init__(self, llm, tools, memory, max_steps=10):
        self.llm = llm              # 大语言模型
        self.tools = tools          # 工具集
        self.memory = memory        # 记忆系统
        self.max_steps = max_steps  # 最大步数限制

    def run(self, user_input: str) -> str:
        """运行Agent主循环"""
        # 步骤1: 感知
        parsed_input = self.perceive(user_input)

        for step in range(self.max_steps):
            # 步骤2: 思考 - LLM决定下一步行动
            decision = self.think(parsed_input)

            if decision["type"] == "final_answer":
                # 任务完成，输出结果
                return decision["content"]

            # 步骤3: 行动 - 调用工具
            tool_name = decision["tool"]
            tool_params = decision["parameters"]
            result = self.act(tool_name, tool_params)

            # 步骤4: 观察 - 获取结果
            observation = self.observe(result)

            # 步骤5: 记忆 - 存储过程
            self.remember(step, decision, observation)

            # 步骤6: 更新上下文，继续循环
            parsed_input = self.update_context(observation)

        return "任务未能在限定步骤内完成"

    def perceive(self, user_input: str) -> dict:
        """感知：解析用户输入"""
        return {"raw": user_input, "intent": self.llm.extract_intent(user_input)}

    def think(self, context: dict) -> dict:
        """思考：LLM决策下一步"""
        return self.llm.decide_next_action(context, self.tools)

    def act(self, tool_name: str, params: dict) -> any:
        """行动：执行工具调用"""
        tool = self.tools[tool_name]
        return tool.execute(params)

    def observe(self, result: any) -> dict:
        """观察：处理工具返回结果"""
        return {"result": result, "status": "success"}

    def remember(self, step: int, decision: dict, observation: dict):
        """记忆：存储执行过程"""
        self.memory.add({
            "step": step,
            "action": decision,
            "result": observation
        })

    def update_context(self, observation: dict) -> dict:
        """更新上下文，准备下一轮循环"""
        return {"observation": observation, "history": self.memory.get_recent()}
```

### 循环终止条件

| 条件 | 说明 |
| --- | --- |
| **任务完成** | LLM 判断任务已完成，返回最终答案 |
| **达到步数限制** | 防止无限循环，强制终止 |
| **遇到不可恢复的错误** | 工具调用失败且无法重试 |
| **用户中断** | 用户主动取消任务 |

---

## 组件协同工作示例

以"查询明天北京天气并给出穿衣建议"为例，展示各组件如何协同：

```
用户："明天北京天气怎么样？我该穿什么？"

1. 【感知层】解析输入
   → 意图：查询天气 + 穿衣建议
   → 实体：城市=北京，日期=明天

2. 【大脑】LLM 决策
   → Thought: 需要先查询天气，再根据天气给穿衣建议
   → Action: 调用 get_weather 工具

3. 【工具】执行天气查询
   → 调用天气API
   → 返回：明天北京多云，15-22℃，无降水

4. 【记忆】存储查询结果
   → 短期记忆：当前会话的天气数据

5. 【大脑】LLM 继续决策
   → Thought: 已获取天气数据，温度15-22℃，需要给穿衣建议
   → Action: 生成穿衣建议

6. 【输出】返回结果
   → "明天北京多云，气温15-22℃。建议穿长袖T恤搭配薄外套，
      早晚温差较大，注意适当增减衣物。"
```
