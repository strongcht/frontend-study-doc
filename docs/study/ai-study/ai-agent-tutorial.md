# AI Agent(智能体) 教程

AI Agent 称为智能体，本质是自动执行任务的程序，核心在于让模型不只回答问题，而是按步骤完成动作。

**AI Agent（人工智能代理）** 是一个能够感知环境、进行决策并执行行动，以达成特定目标的智能软件实体，它不仅仅是回答问题的聊天机器人，更是能够动手做事的智能执行者。

Agent = LLM (大脑) + Planning (规划) + Tool use (执行) + Memory (记忆)。

---

## 谁适合阅读本教程？

1. 想使用 AI 自动化日常任务的人
2. 对编程不熟但想用 AI 做实际工作的新人
3. 已会基本电脑操作、但对 Agent/工作流 等概念零基础的人
4. 想把 AI 从聊天提升到真正干活的人

---

## 什么是 Agent？

Agent 就是一个能干活的智能助手。

Agent = LLM (大脑) + Planning (规划) + Tool use (执行) + Memory (记忆)。

学习 Agent 需要思维转变：从对话框问答进化为目标驱动的任务执行。

传统的软件程序遵循固定的指令流程：输入 → 处理 → 输出，而 AI Agent 则更像一个有自主性的员工，它能够：

- **理解任务目标**：明白你想要什么结果
- **制定计划**：思考如何达成目标
- **使用工具**：调用各种资源和 API
- **自我调整**：根据反馈优化策略
- **持续执行**：直到完成任务或遇到无法解决的问题

**类比理解：**

- 传统程序 = 自动售货机：投币 → 按按钮→ 出商品
- AI Agent = 私人助理：告诉需求 → 助理规划 → 完成任务并汇报

---

## AI Agent 结构组成

**结构由三块组成:**

- **目标：** 明确任务意图
- **逻辑：** 按规则拆成可执行步骤
- **工具：** 通过代码或 API 让步骤落地

**运行方式:**

- 接收输入
- 判断当前任务
- 调用对应工具执行
- 返回结果
- 保留必要上下文
- 支持多轮连续操作
- 遇阻时调整执行步骤

**与普通大模型的差异点:**

- 普通大模型：生成文本
- Agent：生成行动并执行行动，能完成实际工作

**举例：**

- 给出目标：如 "规划三天北京行程，预算 5000"
- 自动检索机票、酒店与价格
- 自动收集景点信息并做对比
- 自动生成可执行行程表
- 具备条件时可继续执行预订操作

---

## AI Agent 的工作原理：一个简单的代码示例

让我们通过一个 Python 伪代码示例，直观感受一下 AI Agent 的工作流程。

```python
# 伪代码示例：简易天气穿衣助手Agent
import requests

class WeatherAgent:
    def __init__(self):
        self.memory = []  # 简单的记忆存储
        self.tools = {
            'get_weather': self.get_weather_api,
            'give_advice': self.generate_advice
        }

    # 工具1: 调用天气API
    def get_weather_api(self, city):
        """调用外部天气API获取数据"""
        print(f"[Agent 行动] 正在查询{city}的天气...")
        mock_data = {'city': city, 'temp': 22, 'condition': '晴朗', 'wind': '3级'}
        return mock_data

    # 工具2: 根据天气生成建议
    def generate_advice(self, weather_data):
        """根据天气数据生成穿衣建议"""
        temp = weather_data['temp']
        condition = weather_data['condition']
        advice = f"当前{weather_data['city']}气温{temp}℃，天气{condition}。"
        if temp > 25:
            advice += "建议穿短袖、短裤。"
        elif temp > 15:
            advice += "建议穿长袖T恤、薄外套。"
        else:
            advice += "建议穿毛衣、厚外套。"
        return advice

    # 规划与执行核心
    def run(self, user_input):
        """解析用户目标并执行任务"""
        print(f"[用户指令] {user_input}")

        # 步骤1: 规划 - 从指令中提取关键信息（城市）
        if "天气" in user_input and "北京" in user_input:
            city = "北京"
        else:
            return "请告诉我您想查询哪个城市的天气？"

        # 步骤2: 行动 - 调用工具获取天气
        weather_info = self.tools['get_weather'](city)
        self.memory.append({'step': 'fetched_weather', 'data': weather_info})

        # 步骤3: 行动 - 调用工具生成建议
        final_advice = self.tools['give_advice'](weather_info)
        self.memory.append({'step': 'generated_advice', 'data': final_advice})

        # 步骤4: 输出结果
        return final_advice

# 使用Agent
agent = WeatherAgent()
result = agent.run("我想知道北京的天气，该怎么穿衣服？")
print(f"[Agent 回复] {result}")
```

**代码解读**：

1. `WeatherAgent` 类定义了一个简单的 Agent 框架
2. `tools` 字典定义了 Agent 可以使用的两种"工具"（函数）
3. `run` 方法是核心流程：它**解析**用户指令，**规划**出需要调用工具，然后**按顺序执行**，并将中间结果存入 `memory`，最后**输出**整合后的答案

---

## 学习资源

- Google 5 天智能体课程：https://www.kaggle.com/learn-guide/5-day-agents
- 微软的课程：https://github.com/microsoft/ai-agents-for-beginners
- Hello-Agents：https://github.com/datawhalechina/hello-agents
- 500 个智能体案例：https://github.com/ashishpatel26/500-AI-Agents-Projects
- 智能体资源库：https://github.com/NirDiamant/GenAI_Agents
- HF 智能体课程：https://github.com/huggingface/agents-course
