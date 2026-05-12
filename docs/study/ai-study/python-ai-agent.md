# Python 实现 AI Agent

## 核心概念

AI Agent 就像一个有"大脑"和"四肢"的智能程序，它的核心组件包括：

| 组件 | 说明 |
|------|------|
| **大脑（Brain/LLM）** | 负责理解、推理和决策 |
| **感知（Perception/Input）** | 接收外部信息：用户指令、数据库查询、网页内容、传感器数据 |
| **行动（Action/Output）** | 影响外部世界：调用函数、发送邮件、打印文本 |
| **目标（Goal）** | 所有行为围绕明确的目标展开 |

Agent 的核心工作流程遵循 **感知-思考-行动（Perceive-Think-Act）** 循环。

---

## 极简测试用例

### 目录结构

```
agent-demo/
  agent.py        # 主实现
  tools.py        # 工具实现
  memory.py       # 简单记忆实现
  README.md
```

---

## 完整的最小 Agent 原型（agent.py）

```python
"""
agent.py - 极简 AI Agent 原型（可直接运行）
说明：
- LLM 部分用一个非常简单的"规则回答器"模拟，实际接入 LLM 时替换 LLMInterface.generate(...)
- 包含组件：LLM 抽象、大脑(解析/决策)、规划器、工具注册器、内存、执行器
"""

from typing import Any, Dict, List, Callable
import time

# -----------------------------
# Memory（非常轻量）
# -----------------------------
class Memory:
    def __init__(self):
        self.short = {}   # 当前会话上下文
        self.long = {}    # 长期偏好/联系人等

    def get_short(self, k, default=None):
        return self.short.get(k, default)

    def set_short(self, k, v):
        self.short[k] = v

    def get_long(self, k, default=None):
        return self.long.get(k, default)

    def set_long(self, k, v):
        self.long[k] = v

# -----------------------------
# LLM 抽象（替换点）
# -----------------------------
class LLMInterface:
    def generate(self, prompt: str) -> str:
        """
        这里给出一个非常简单的规则式模拟回答器。
        真实使用时：替换为 OpenAI/其它模型的调用代码，返回 model 文本。
        """
        if "是否下雨" in prompt or "下雨" in prompt:
            return "请先查询天气；如果有雨，请生成提醒并发送给目标联系人。"
        if "生成提醒" in prompt:
            return "请提醒小王：明天北京有雨，请带伞。"
        return "我理解了。"

# -----------------------------
# 工具注册与模拟工具
# -----------------------------
class ToolRegistry:
    def __init__(self):
        self.tools: Dict[str, Callable[..., Any]] = {}

    def register(self, name: str, fn: Callable[..., Any]):
        self.tools[name] = fn

    def call(self, name: str, *args, **kwargs):
        if name not in self.tools:
            raise ValueError(f"工具未注册: {name}")
        return self.tools[name](*args, **kwargs)

def mock_weather_api(city: str, date: str) -> Dict[str, Any]:
    if "北京" in city and "明天" in date:
        return {"city": city, "date": date, "cond": "雨", "precip_mm": 5}
    return {"city": city, "date": date, "cond": "晴", "precip_mm": 0}

def mock_send_message(contact: str, message: str) -> bool:
    print(f"[发送消息] to={contact} message={message}")
    return True

def mock_search(query: str) -> str:
    return f"模拟搜索结果：关于 `{query}` 的信息摘要。"

# -----------------------------
# Planner / Executor
# -----------------------------
class SimplePlanner:
    def plan(self, goal: str) -> List[Dict[str, Any]]:
        """
        将目标拆解为步骤列表（非常简化的实现）
        每一步包含：action(工具名或内部动作)、params
        """
        steps = []
        if "天气" in goal or "下雨" in goal:
            steps.append({"action": "query_weather", "params": {"city": "北京", "date": "明天"}})
            steps.append({"action": "decide_and_notify", "params": {"contact_name": "小王"}})
        else:
            steps.append({"action": "search", "params": {"query": goal}})
        return steps

class Executor:
    def __init__(self, tools: ToolRegistry, memory: Memory, llm: LLMInterface):
        self.tools = tools
        self.memory = memory
        self.llm = llm

    def run_step(self, step: Dict[str, Any]):
        action = step["action"]
        params = step.get("params", {})
        if action == "query_weather":
            res = self.tools.call("weather", params["city"], params["date"])
            self.memory.set_short("last_weather", res)
            return res
        if action == "decide_and_notify":
            weather = self.memory.get_short("last_weather", {})
            if weather.get("cond") == "雨":
                prompt = f"基于天气信息：{weather}，生成一条发给{params['contact_name']}的提醒。"
                reminder = self.llm.generate(prompt)
                contact = self.memory.get_long(params["contact_name"]) or "13800000000"
                ok = self.tools.call("send_message", contact, reminder)
                return {"notified": ok, "message": reminder}
            else:
                return {"notified": False, "reason": "天气晴朗"}
        if action == "search":
            return self.tools.call("search", params["query"])
        raise ValueError(f"未知动作: {action}")

# -----------------------------
# Agent 本体
# -----------------------------
class SimpleAgent:
    def __init__(self):
        self.memory = Memory()
        self.tools = ToolRegistry()
        self.llm = LLMInterface()
        self.planner = SimplePlanner()
        self.executor = Executor(self.tools, self.memory, self.llm)
        self.tools.register("weather", mock_weather_api)
        self.tools.register("send_message", mock_send_message)
        self.tools.register("search", mock_search)
        self.memory.set_long("小王", "13911112222")

    def handle(self, user_prompt: str):
        # 1) 大脑解析（用 LLM 抽象）
        intent = self.llm.generate(user_prompt)
        # 2) 规划
        steps = self.planner.plan(user_prompt)
        # 3) 逐步执行
        results = []
        for step in steps:
            r = self.executor.run_step(step)
            results.append({"step": step, "result": r})
        # 4) 输出合并
        return {"intent": intent, "steps": results}

if __name__ == "__main__":
    agent = SimpleAgent()
    task = "查一下明天北京的天气，如果下雨，帮我写个提醒并发给小王。"
    out = agent.handle(task)
    import json
    print(json.dumps(out, ensure_ascii=False, indent=2))
```

### 原型要点分析

1. **LLM 抽象**：`LLMInterface.generate()` 是替换点 — 可换入 OpenAI/Claude/本地 LLM 调用
2. **规划器**：将自然语言目标拆解为有序步骤；简单版本使用规则/模板
3. **工具**：每个工具是独立函数，注册到 `ToolRegistry`；生产中可变为 HTTP 请求、SDK 调用、数据库操作
4. **记忆**：短期记忆用于当前任务中间结果；长期记忆用于联系人、偏好
5. **执行器**：将步骤映射到工具调用，处理返回值、失败和重试逻辑

---

## 构建任务规划助手（接入真实 LLM）

### 目录结构

```
task-planning-agent/
  brain.py       # 大脑模块（接入 DeepSeek API）
  tools.py       # 工具集
  agent.py       # Agent 主循环
  README.md
```

### 第一步：搭建大脑

安装依赖：

```bash
pip3 install openai
```

API 测试代码：

```python
import os
from openai import OpenAI

DEEPSEEK_API_KEY = "sk-xxxxxxx"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1"

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_API_URL)

response = client.chat.completions.create(
    model="deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant"},
        {"role": "user", "content": "Hello"},
    ],
    stream=False
)

print(response.choices[0].message.content)
```

### brain.py

```python
from openai import OpenAI
import os

DEEPSEEK_API_KEY = "sk-xxxxxxx"
DEEPSEEK_API_URL = "https://api.deepseek.com/v1"

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_API_URL)

class AgentBrain:
    """Agent 的大脑，负责思考与决策"""

    def __init__(self, model="deepseek-v4-flash"):
        self.model = model

    def think(self, prompt):
        """核心思考函数：接收提示，返回模型的思考结果"""
        try:
            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=500
            )
            reasoning = response.choices[0].message.content
            return reasoning.strip()
        except Exception as e:
            return f"思考过程出错: {e}"

if __name__ == "__main__":
    brain = AgentBrain()
    test_prompt = "你好，请简单介绍一下你自己。"
    print("测试提问：", test_prompt)
    print("大脑回复：", brain.think(test_prompt))
```

**代码说明**：`AgentBrain` 类封装了 LLM 交互。`think` 方法将提示字符串发送给 GPT API。`temperature` 参数（设为 0.5）平衡了规划任务的创造性和稳定性。

---

### 第二步：定义工具（手脚）

#### tools.py

```python
import datetime

class AgentTools:
    """Agent 可以使用的工具集合"""

    @staticmethod
    def search_web(query):
        """模拟网络搜索工具（此处为模拟）"""
        mock_results = {
            "旅行目的地推荐": "巴黎、东京、马尔代夫、云南丽江...",
            "北京天气": "明天晴，气温 15-25°C，微风。",
            "Python 教程": "推荐菜鸟教程等网站。"
        }
        for key, value in mock_results.items():
            if key in query:
                return f"[网络搜索] 关于 '{query}' 的结果：{value}"
        return f"[网络搜索] 未找到 '{query}' 的明确信息。"

    @staticmethod
    def make_schedule(steps):
        """制定日程计划工具"""
        schedule = "生成的日程计划：\n"
        for i, step in enumerate(steps, 1):
            schedule += f"{i}. {step}\n"
        return schedule

    @staticmethod
    def get_current_time():
        """获取当前时间工具"""
        now = datetime.datetime.now()
        return f"[系统时间] 现在是：{now.strftime('%Y-%m-%d %H:%M:%S')}"

    @staticmethod
    def calculate(expression):
        """简单计算器工具（安全版本）"""
        try:
            allowed_chars = set("0123456789+-*/(). ")
            if not all(c in allowed_chars for c in expression):
                return "[计算器] 表达式包含非法字符，拒绝计算。"

            clean_expr = expression.strip().replace(" ", "")
            if not clean_expr:
                return "[计算器] 表达式不能为空。"

            safe_globals = {
                '__builtins__': {},
                'pow': pow,
                'abs': abs
            }
            result = eval(clean_expr, safe_globals)
            return f"[计算器] {expression} = {result}"

        except ZeroDivisionError:
            return "[计算器] 错误：除数不能为零。"
        except SyntaxError:
            return "[计算器] 表达式语法错误（如括号不匹配、运算符错误）。"
        except Exception as e:
            return f"[计算器] 计算错误: {str(e)}"

if __name__ == "__main__":
    print(AgentTools.search_web("北京天气"))
    print(AgentTools.get_current_time())
    print(AgentTools.calculate("3 + 5 * 2"))
    print(AgentTools.calculate("10 / 0"))
    print(AgentTools.calculate("__import__('os').system('ls')"))
```

> **安全提示**：`calculate` 中的 `eval()` 在生产环境中是危险的，应替换为 `ast.literal_eval` 等更安全的替代方案。

---

### 第三步：组装 Agent — 核心循环

#### agent.py

```python
from brain import AgentBrain
from tools import AgentTools

class SimpleAgent:
    """一个简单的任务规划 AI Agent"""

    def __init__(self):
        self.brain = AgentBrain()
        self.tools = AgentTools
        self.tool_descriptions = """
        你可以使用以下工具：
        1. 搜索工具：当你需要获取最新、未知的信息时使用，例如'搜索 北京天气'。
        2. 计划工具：当你需要将多个步骤整理成计划时使用，例如'制定计划 [步骤1，步骤2]'。
        3. 时间工具：当你需要知道当前时间时使用，指令就是'获取时间'。
        4. 计算工具：当你需要进行数学计算时使用，例如'计算 3+5*2'。
        """

    def run(self, user_task):
        """运行 Agent 的主循环"""
        print(f"用户任务: {user_task}")
        print("=" * 40)

        # Step 1: 感知 & 初始思考
        initial_prompt = f"""
        你的角色是一个任务规划助手。
        {self.tool_descriptions}

        用户的任务是：{user_task}

        请严格按照以下固定格式回答，不要添加额外内容：
        思考：[简要分析任务需要什么]
        工具：[选择要使用的工具名称，如果没有合适的就写'无']
        指令：[发送给该工具的具体指令内容]
        """

        initial_response = self.brain.think(initial_prompt)
        print("初始思考结果：")
        print(initial_response)
        print("-" * 20)

        # Step 2: 解析思考结果，提取工具和指令
        lines = [line.strip() for line in initial_response.split('\n') if line.strip()]
        tool_to_use = "无"
        tool_instruction = ""

        for line in lines:
            if line.startswith("思考："):
                continue
            elif line.startswith("工具："):
                tool_to_use = line.replace("工具：", "").strip()
            elif line.startswith("指令："):
                tool_instruction = line.replace("指令：", "").strip()

        # Step 3: 执行动作
        result = self._use_tool(tool_to_use, tool_instruction)
        print("执行结果：")
        print(result)
        print("=" * 40)

        # Step 4: 整合结果并给出反馈
        final_prompt = f"""
        用户原始任务：{user_task}
        你已经进行了思考并使用了工具。
        思考过程：{initial_response}
        工具执行结果：{result}

        现在，请生成一段完整的、对用户的最终回复，直接给出有帮助的答案或计划，语言要自然友好。
        """

        final_response = self.brain.think(final_prompt)
        print("最终回复给用户：")
        print(final_response)

        return final_response

    def _use_tool(self, tool_name, instruction):
        """根据工具名称调用具体的工具函数"""
        tool_name = tool_name.strip()

        if tool_name == "搜索工具":
            return self.tools.search_web(instruction)
        elif tool_name == "计划工具":
            if not instruction:
                return "[计划工具] 未提供计划步骤，无法生成日程。"
            clean_instr = instruction.strip('[](){}').strip()
            steps = [s.strip() for s in clean_instr.replace('，', ',').split(',') if s.strip()]
            return self.tools.make_schedule(steps)
        elif tool_name == "时间工具":
            return self.tools.get_current_time()
        elif tool_name == "计算工具":
            return self.tools.calculate(instruction)
        elif tool_name == "无":
            return "[系统] 无需使用工具，直接回答用户即可。"
        else:
            return f"[系统] 未知工具：{tool_name}，无法执行。"

if __name__ == "__main__":
    print("启动 SimpleAgent...")
    my_agent = SimpleAgent()

    test_tasks = [
        "我想去旅行，帮我规划一下需要准备什么",
        "现在几点了？",
        "计算一下 15 的平方加上 20 的三分之一是多少",
    ]

    for task in test_tasks:
        my_agent.run(task)
        print("\n" + "#" * 50 + "\n")
```

### 执行流程

当收到任务"我想去旅行，帮我规划一下需要准备什么"时：

1. **初始思考** — 选择"计划工具"（plan tool）
2. **解析** — 从 LLM 的结构化响应中提取工具名称和指令
3. **执行** — 调用计划工具生成 8 个旅行准备步骤
4. **生成最终回复** — 将工具结果整合为用户友好的回答

---

## 练习题

### 练习 1：添加记忆功能

在 `SimpleAgent` 中添加 `self.conversation_history = []`。每次调用 `brain.think` 时附带历史对话，并将新一轮（用户输入、AI 思考、工具结果）追加到历史记录中。

### 练习 2：使用 JSON 自动选择工具

修改提示词，要求大脑返回 JSON 格式：`{"thought": "…", "tool": "…", "instruction": "…"}`。使用 `json.loads()` 解析以提高稳定性。

### 练习 3：添加新工具

在 `AgentTools` 中添加 `todo_list = []` 和两个方法（`add_todo(item)`、`show_todos()`）。更新工具描述和 `_use_tool` 以处理新工具。

---

## 总结

- **核心概念**：AI Agent = 大脑（LLM）+ 感知 + 行动 + 目标
- **实现要点**：
  1. **大脑**：通过 API 调用 LLM 进行推理
  2. **工具**：将具体能力封装为函数
  3. **循环**：用代码逻辑串联 思考 → 决策 → 执行
- 进阶可探索 **LangChain**、**AutoGen** 等工业级框架，获得更完善的工具集成、记忆管理和多 Agent 协作能力
