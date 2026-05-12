# AI Agent 工作原理

本文将深入解析 AI Agent 的工作原理，从基础概念到实际实现，帮助你理解 Agent 是如何工作的。

---

## 为什么需要 Agent？

### 大语言模型（LLM）的局限性

尽管大语言模型能力强大，但它们存在固有的局限性：

| 局限性 | 说明 | 具体表现 |
| --- | --- | --- |
| **无法获取实时信息** | 训练数据有截止日期 | 不知道今天的天气、股票价格 |
| **无法执行操作** | 只能生成文本，无法实际操作 | 不能发邮件、不能调用API、不能操作文件 |
| **上下文窗口有限** | 能处理的文本长度有限 | 无法一次性处理超长文档 |
| **可能产生幻觉** | 生成看似正确但实际错误的信息 | 编造不存在的论文、虚构统计数据 |
| **无法学习新知识** | 推理时无法更新知识 | 不知道昨天发生的新闻 |

### Agent 如何弥补这些局限

```
LLM 的局限性          Agent 的解决方案
─────────────         ─────────────────
无法获取实时信息   →   工具调用（搜索引擎、API）
无法执行操作       →   工具调用（代码执行、文件操作）
上下文窗口有限     →   记忆系统（短期 + 长期记忆）
可能产生幻觉       →   工具验证、多源交叉检查
无法学习新知识     →   长期记忆、知识库更新
```

**核心思想**：让 LLM 专注于它擅长的事情（理解、推理、生成），将它不擅长的事情交给工具来完成。

---

## Agent 三大核心部分

### 1. 大脑（Brain）—— LLM

LLM 是 Agent 的核心推理引擎。

**职责：**
- 理解用户意图
- 分析任务需求
- 制定执行计划
- 生成自然语言回复

**关键能力：**
- **指令遵循**：按照 System Prompt 的指导行事
- **推理能力**：分析问题，做出决策
- **生成能力**：产生结构化的工具调用请求
- **上下文理解**：理解对话历史和当前状态

### 2. 工具（Tools）

工具让 Agent 能够与外部世界交互。

**工具的作用：**
- 弥补 LLM 的能力盲区
- 获取实时信息
- 执行实际操作
- 验证 LLM 的输出

**工具调用机制：**

```
LLM 输出：
{
  "tool": "search_web",
  "parameters": {
    "query": "北京明天天气"
  }
}

Agent 框架：
→ 解析工具调用请求
→ 执行对应工具
→ 将结果返回给 LLM

工具返回：
{
  "result": "北京明天多云，15-22℃"
}
```

### 3. 记忆（Memory）

记忆让 Agent 能够保持上下文连续性和学习能力。

**记忆的作用：**
- 维护对话连贯性
- 记住用户偏好
- 从历史经验中学习
- 避免重复错误

---

## Agent 类型

| 类型 | 说明 | 特点 | 适用场景 |
| --- | --- | --- | --- |
| **ReAct Agent** | 推理与行动交替进行 | 最基础、最通用 | 通用问答、信息查询 |
| **Plan-and-Execute Agent** | 先制定计划再执行 | 适合复杂多步任务 | 项目规划、研究分析 |
| **Tool-Use Agent** | 专注于工具调用 | 工具使用能力强 | 数据查询、API集成 |
| **Multi-Agent** | 多个 Agent 协同 | 分工合作 | 复杂项目、团队模拟 |
| **Autonomous Agent** | 高度自主运行 | 持续运行、自主决策 | 自动化运维、监控系统 |
| **Conversational Agent** | 专注于对话交互 | 自然语言能力强 | 客服、教育、陪伴 |

---

## ReAct 循环详细流程

ReAct 是最基础也是最重要的 Agent 运行模式。

### 完整流程图

```
用户输入
   ↓
┌──────────────────────────────────────┐
│           ReAct 循环                  │
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ Thought（思考）                  │ │
│  │ - 分析当前状态                   │ │
│  │ - 确定下一步行动                 │ │
│  │ - 判断是否需要调用工具           │ │
│  └──────────────┬──────────────────┘ │
│                 ↓                     │
│  ┌─────────────────────────────────┐ │
│  │ Action（行动）                   │ │
│  │ - 选择工具                       │ │
│  │ - 设置参数                       │ │
│  │ - 执行调用                       │ │
│  └──────────────┬──────────────────┘ │
│                 ↓                     │
│  ┌─────────────────────────────────┐ │
│  │ Observation（观察）              │ │
│  │ - 获取工具返回结果               │ │
│  │ - 分析结果是否满足需求           │ │
│  └──────────────┬──────────────────┘ │
│                 │                     │
│          ┌──────┴──────┐              │
│          ↓             ↓              │
│      任务完成      继续循环            │
│          │      (回到Thought)         │
└──────────┼────────────────────────────┘
           ↓
       输出结果
```

### ReAct 示例

```
用户：帮我查一下特斯拉今天的股价，如果涨了就提醒我关注

--- 第1轮 ---
Thought: 用户想知道特斯拉今天的股价，我需要先查询股价信息
Action: search_stock_price(symbol="TSLA")
Observation: 特斯拉(TSLA) 当前价格 $245.50，较昨日收盘价 $238.20 上涨 3.06%

--- 第2轮 ---
Thought: 股价已经上涨了3.06%，用户说涨了要提醒关注，我需要生成提醒
Action: generate_response("特斯拉今日上涨提醒")
Observation: 已生成提醒内容

--- 最终输出 ---
特斯拉(TSLA)今日股价 $245.50，较昨日上涨 3.06%（+$7.30）。
根据您的要求提醒您：特斯拉今日表现良好，建议关注后续走势。
```

---

## Python 实现示例

下面是一个完整的简易 AI Agent 实现，包含所有核心模块。

### 感知模块

```python
class PerceptionModule:
    """感知模块：解析用户输入"""

    def parse(self, user_input: str) -> dict:
        """解析用户输入，提取意图和关键信息"""
        # 简化实现：使用关键词匹配
        # 实际应用中会使用 NLU 模型
        intent = self._detect_intent(user_input)
        entities = self._extract_entities(user_input)

        return {
            "intent": intent,
            "entities": entities,
            "raw_input": user_input
        }

    def _detect_intent(self, text: str) -> str:
        """检测用户意图"""
        if "天气" in text:
            return "query_weather"
        elif "股价" in text or "股票" in text:
            return "query_stock"
        elif "翻译" in text:
            return "translate"
        else:
            return "general_query"

    def _extract_entities(self, text: str) -> dict:
        """提取关键实体"""
        entities = {}
        cities = ["北京", "上海", "广州", "深圳"]
        for city in cities:
            if city in text:
                entities["city"] = city
                break
        return entities
```

### 决策模块

```python
class DecisionModule:
    """决策模块：基于LLM进行推理和决策"""

    def __init__(self, llm_client):
        self.llm = llm_client
        self.system_prompt = """
你是一个智能助手Agent。你可以使用以下工具：
1. get_weather(city) - 查询天气
2. search_stock(symbol) - 查询股价
3. translate_text(text, target_lang) - 翻译文本

请根据用户需求，决定是否需要调用工具。
如果需要调用工具，返回JSON格式：
{"action": "use_tool", "tool": "工具名", "params": {...}}
如果不需要调用工具，返回：
{"action": "respond", "content": "你的回复"}
"""

    def decide(self, context: dict) -> dict:
        """根据上下文做出决策"""
        prompt = f"""
用户输入：{context['raw_input']}
解析结果：意图={context['intent']}，实体={context['entities']}
历史信息：{context.get('history', '无')}

请决定下一步行动。
"""
        # 调用 LLM 获取决策
        response = self.llm.chat(self.system_prompt, prompt)
        return self._parse_decision(response)

    def _parse_decision(self, response: str) -> dict:
        """解析LLM的决策结果"""
        import json
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            return {"action": "respond", "content": response}
```

### 行动模块

```python
class ActionModule:
    """行动模块：执行工具调用"""

    def __init__(self, tools: dict):
        self.tools = tools

    def execute(self, decision: dict) -> str:
        """执行决策"""
        if decision["action"] == "use_tool":
            tool_name = decision["tool"]
            params = decision["params"]

            if tool_name in self.tools:
                result = self.tools[tool_name](**params)
                return result
            else:
                return f"错误：工具 {tool_name} 不存在"
        else:
            return decision["content"]
```

### 记忆模块

```python
class MemoryModule:
    """记忆模块：管理短期和长期记忆"""

    def __init__(self, max_short_term=10):
        self.short_term = []        # 短期记忆（当前对话）
        self.long_term = {}         # 长期记忆（持久化）
        self.max_short_term = max_short_term

    def add_short_term(self, entry: dict):
        """添加短期记忆"""
        self.short_term.append(entry)
        # 超出限制时移除最早的
        if len(self.short_term) > self.max_short_term:
            self.short_term.pop(0)

    def get_short_term(self) -> list:
        """获取短期记忆"""
        return self.short_term

    def add_long_term(self, key: str, value: any):
        """添加长期记忆"""
        self.long_term[key] = value

    def get_long_term(self, key: str) -> any:
        """获取长期记忆"""
        return self.long_term.get(key)

    def get_context_summary(self) -> str:
        """获取上下文摘要"""
        if not self.short_term:
            return "无历史记录"
        recent = self.short_term[-3:]  # 最近3条
        return "\n".join([str(entry) for entry in recent])
```

### 工具模块

```python
import requests

class ToolModule:
    """工具模块：提供各种工具函数"""

    @staticmethod
    def get_weather(city: str) -> dict:
        """查询天气（示例使用模拟数据）"""
        # 实际应用中调用真实天气API
        mock_data = {
            "北京": {"temp": 22, "condition": "晴朗", "humidity": 45},
            "上海": {"temp": 26, "condition": "多云", "humidity": 65},
            "广州": {"temp": 30, "condition": "阵雨", "humidity": 80},
        }
        data = mock_data.get(city, {"temp": 20, "condition": "未知", "humidity": 50})
        return {
            "city": city,
            "temperature": data["temp"],
            "condition": data["condition"],
            "humidity": data["humidity"],
            "advice": ToolModule._generate_weather_advice(data)
        }

    @staticmethod
    def _generate_weather_advice(data: dict) -> str:
        """根据天气数据生成建议"""
        temp = data["temp"]
        if temp > 30:
            return "天气炎热，注意防暑降温"
        elif temp > 20:
            return "气温适宜，适合外出活动"
        else:
            return "气温较低，注意添衣保暖"

    @staticmethod
    def search_stock(symbol: str) -> dict:
        """查询股价（示例使用模拟数据）"""
        mock_stocks = {
            "TSLA": {"price": 245.50, "change": "+3.06%"},
            "AAPL": {"price": 178.72, "change": "+1.25%"},
            "GOOGL": {"price": 141.80, "change": "-0.52%"},
        }
        stock = mock_stocks.get(symbol, {"price": 0, "change": "0%"})
        return {
            "symbol": symbol,
            "price": stock["price"],
            "change": stock["change"]
        }
```

### 组装完整 Agent

```python
class SimpleAgent:
    """简易AI Agent"""

    def __init__(self, llm_client):
        self.perception = PerceptionModule()
        self.decision = DecisionModule(llm_client)
        self.action = ActionModule({
            "get_weather": ToolModule.get_weather,
            "search_stock": ToolModule.search_stock,
        })
        self.memory = MemoryModule()

    def run(self, user_input: str, max_steps: int = 5) -> str:
        """运行Agent"""
        # 步骤1: 感知
        parsed = self.perception.parse(user_input)
        parsed["history"] = self.memory.get_context_summary()

        for step in range(max_steps):
            # 步骤2: 决策
            decision = self.decision.decide(parsed)

            # 步骤3: 行动
            result = self.action.execute(decision)

            # 步骤4: 记忆
            self.memory.add_short_term({
                "step": step,
                "input": user_input,
                "decision": decision,
                "result": result
            })

            # 步骤5: 判断是否完成
            if decision["action"] == "respond":
                return result

            # 更新上下文，继续循环
            parsed["last_result"] = result
            parsed["history"] = self.memory.get_context_summary()

        return "任务未能在限定步骤内完成"

# 使用示例
# agent = SimpleAgent(llm_client=your_llm)
# result = agent.run("北京今天天气怎么样？")
# print(result)
```

---

## 实践练习：构建简单命令行 AI Agent

### 练习目标

构建一个可以在命令行中运行的简单 AI Agent，能够：
1. 接收用户的自然语言输入
2. 理解用户意图
3. 调用相应工具
4. 返回结果

### 实现步骤

**步骤 1：创建基础框架**

```python
# agent.py
class CommandLineAgent:
    def __init__(self):
        self.tools = {}
        self.memory = []

    def register_tool(self, name: str, func):
        """注册工具"""
        self.tools[name] = func

    def run(self):
        """运行命令行交互循环"""
        print("AI Agent 已启动！输入 'quit' 退出。")
        while True:
            user_input = input("\n你: ")
            if user_input.lower() == 'quit':
                break
            response = self.process(user_input)
            print(f"Agent: {response}")

    def process(self, user_input: str) -> str:
        """处理用户输入"""
        raise NotImplementedError
```

**步骤 2：添加工具**

```python
import datetime
import random

def get_time():
    """获取当前时间"""
    now = datetime.datetime.now()
    return f"当前时间：{now.strftime('%Y-%m-%d %H:%M:%S')}"

def get_weather(city):
    """模拟天气查询"""
    weather_data = {
        "北京": "晴朗，22℃",
        "上海": "多云，25℃",
        "广州": "阵雨，30℃",
    }
    return weather_data.get(city, f"{city}：晴朗，20℃")

def calculate(expression):
    """安全计算数学表达式"""
    try:
        allowed_chars = set("0123456789+-*/.() ")
        if all(c in allowed_chars for c in expression):
            result = eval(expression)
            return f"计算结果：{expression} = {result}"
        else:
            return "错误：不支持的表达式"
    except Exception as e:
        return f"计算错误：{str(e)}"
```

**步骤 3：实现意图识别和工具调用**

```python
class SimpleCommandLineAgent(CommandLineAgent):
    def __init__(self):
        super().__init__()
        self.register_tool("time", lambda: get_time())
        self.register_tool("weather", lambda city: get_weather(city))
        self.register_tool("calculate", lambda expr: calculate(expr))

    def process(self, user_input: str) -> str:
        """处理用户输入"""
        self.memory.append({"role": "user", "content": user_input})

        # 简单意图识别
        if "时间" in user_input or "几点" in user_input:
            response = self.tools["time"]()
        elif "天气" in user_input:
            # 提取城市
            city = self._extract_city(user_input)
            response = self.tools["weather"](city)
        elif any(op in user_input for op in ["+", "-", "*", "/", "计算"]):
            expr = self._extract_expression(user_input)
            response = self.tools["calculate"](expr)
        else:
            response = "抱歉，我暂时无法理解您的需求。我可以帮您查时间、天气或做计算。"

        self.memory.append({"role": "assistant", "content": response})
        return response

    def _extract_city(self, text: str) -> str:
        """提取城市名"""
        cities = ["北京", "上海", "广州", "深圳", "杭州"]
        for city in cities:
            if city in text:
                return city
        return "北京"  # 默认

    def _extract_expression(self, text: str) -> str:
        """提取数学表达式"""
        import re
        match = re.search(r'[\d+\-*/().\s]+', text)
        return match.group().strip() if match else "0"
```

**步骤 4：运行 Agent**

```python
if __name__ == "__main__":
    agent = SimpleCommandLineAgent()
    agent.run()
```

### 运行效果

```
AI Agent 已启动！输入 'quit' 退出。

你: 现在几点了？
Agent: 当前时间：2024-01-15 14:30:25

你: 北京今天天气怎么样？
Agent: 北京：晴朗，22℃

你: 计算 15 * 23 + 47
Agent: 计算结果：15 * 23 + 47 = 392

你: quit
```

---

## 总结

AI Agent 的工作原理可以概括为：

1. **感知**：接收和解析用户输入
2. **思考**：LLM 分析任务，做出决策
3. **行动**：调用工具执行操作
4. **观察**：获取行动结果
5. **记忆**：存储过程和结果
6. **循环**：根据结果决定是否继续

这个"感知→思考→行动→观察→记忆"的循环，就是 Agent 的核心工作原理。
