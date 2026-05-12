# AI Agent 问答实例

## 概述

本教程通过 Python 构建一个基础 AI Agent，从简单的问答 Agent 开始，逐步添加搜索能力。

---

## 项目结构

首先创建目录 `runoob-ai-agent`：

```bash
mkdir runoob-ai-agent
```

进入目录并使用 `uv` 创建虚拟环境：

```bash
cd runoob-ai-agent

# 创建名为 .venv 的虚拟环境（默认）
uv venv

# macOS/Linux 激活
source .venv/bin/activate

# Windows 激活
.venv\Scripts\activate
```

项目目录结构如下：

```
runoob-ai-agent/
├── .env
├── .gitignore
├── requirements.txt
├── test_basic_agent.py
├── README.md
├── src/
│   ├── __init__.py
│   └── simple_agent.py
└── tests/
    └── __init__.py
```

---

## 获取阿里云百炼 API Key

本教程使用阿里的 Qwen 模型，因为它内置了搜索功能。百炼的通义千问模型支持 OpenAI 兼容接口，只需调整 API Key、BASE_URL 和模型名即可。

- **base_url**: `https://dashscope.aliyuncs.com/compatible-mode/v1`
- **api_key**: 你的阿里云百炼 API Key
- **model**: `qwen3-max`

参考文档：https://help.aliyun.com/zh/model-studio/compatibility-of-openai-with-dashscope

需要开通阿里云百炼模型服务并获取 API-KEY。访问 https://bailian.console.aliyun.com/，登录后点击右上角齿轮图标，选择 API key 并复制（如果没有则新建一个）。

开通百炼账户不收费，费用仅在模型调用（超出免费额度）、模型部署和模型微调时产生。

---

## 创建基础 Agent 类

```python
# src/simple_agent.py
import os
from typing import List, Dict, Any
from openai import OpenAI
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class SimpleQAAgent:
    """简单的问答 Agent"""

    def __init__(self, model: str = "qwen3-max"):
        """
        初始化 Agent

        Args:
            model: 使用的模型名，默认 qwen3-max
        """
        # api_key = os.getenv("OPENAI_API_KEY")
        api_key = "sk-xxx"  # 你的 API 密钥
        base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
        if not api_key:
            raise ValueError("请设置 OPENAI_API_KEY 环境变量")

        self.client = OpenAI(
                        api_key=api_key,
                        base_url=base_url)
        self.model = model
        self.conversation_history: List[Dict[str, str]] = []
        self.system_prompt = "你是一个有帮助的AI助手，请礼貌、准确地回答用户的问题。"

    def add_to_history(self, role: str, content: str):
        """将消息添加到对话历史"""
        self.conversation_history.append({
            "role": role,
            "content": content
        })

        # 保持历史长度在 10 轮以内（防止 token 溢出）
        if len(self.conversation_history) > 10:
            self.conversation_history = self.conversation_history[-10:]

    def ask(self, question: str) -> str:
        """
        向 Agent 提问

        Args:
            question: 用户的问题

        Returns:
            Agent 的回答
        """
        # 将用户问题添加到历史
        self.add_to_history("user", question)

        # 准备消息列表
        messages = [
            {"role": "system", "content": self.system_prompt}
        ]
        messages.extend(self.conversation_history)

        try:
            # 调用 OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )

            # 提取回答
            answer = response.choices[0].message.content

            # 将助理回答添加到历史
            self.add_to_history("assistant", answer)

            return answer

        except Exception as e:
            error_msg = f"调用API时出错: {str(e)}"
            print(error_msg)
            return error_msg

    def clear_history(self):
        """清空对话历史"""
        self.conversation_history.clear()
```

---

## 测试基础 Agent

```python
# test_basic_agent.py
from src.simple_agent import SimpleQAAgent

def test_basic_agent():
    """测试基础问答 Agent"""
    print("=== 测试基础问答 Agent ===")

    # 创建 Agent
    agent = SimpleQAAgent()

    # 测试问答
    questions = [
        "你好，请介绍一下自己",
        "Python是什么？",
        "机器学习和人工智能有什么区别？"
    ]

    for question in questions:
        print(f"\n用户: {question}")
        answer = agent.ask(question)
        print(f"助理: {answer}")

    # 测试对话连贯性
    print("\n=== 测试对话连贯性 ===")
    agent.clear_history()

    # 第一轮
    q1 = "我最喜欢的颜色是蓝色"
    a1 = agent.ask(q1)
    print(f"用户: {q1}")
    print(f"助理: {a1}")

    # 第二轮（应记住之前的对话）
    q2 = "我刚才说我最喜欢什么颜色？"
    a2 = agent.ask(q2)
    print(f"\n用户: {q2}")
    print(f"助理: {a2}")

    print("\n测试完成！")

if __name__ == "__main__":
    test_basic_agent()
```

运行测试：

```bash
python test_basic_agent.py
```

输出示例：

```
=== 测试基础问答 Agent ===

用户: 你好，请介绍一下自己
助理: 你好！我是通义千问（Qwen），是阿里巴巴集团自主研发的超大规模语言模型。...

用户: Python是什么？
助理: 你好！Python 是一种高级、解释型、通用的编程语言，由荷兰程序员 吉多·范罗苏姆...
...
```

### 基础 Agent 的局限性

基础 Agent 存在几个明显的局限：

- 只能回答训练数据中的问题
- 无法获取实时信息
- 无法执行计算
- 无法操作系统外部资源

这些正是 Agent 需要工具的原因。

---

## 添加搜索工具

Qwen 内置了搜索功能，传入 `enable_search: true` 即可开启联网搜索。

```python
# 导入依赖并创建 client...
completion = client.chat.completions.create(
    # 必须使用支持联网搜索的模型
    model="qwen3-max",
    messages=[{"role": "user", "content": "杭州明天天气如何"}],
    # enable_search 是非标准 OpenAI 参数，使用 extra_body
    extra_body={"enable_search": True}
)
```

文档：https://help.aliyun.com/zh/model-studio/web-search

---

## 集成搜索的 Agent

创建 `src/agent_with_search.py`：

```python
# src/agent_with_search.py
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()


class AgentWithSearch:
    """基于 Qwen 内置联网搜索能力的 Agent"""

    def __init__(self, model: str = "qwen3-max"):
        api_key = "sk-xxx"
        base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

        if not api_key:
            raise ValueError("请设置 OPENAI_API_KEY 环境变量（DashScope Key）")

        self.client = OpenAI(
            api_key=api_key,
            base_url=base_url
        )
        self.model = model

        self.system_prompt = """
你是一个有帮助的 AI 助手。

当问题涉及实时信息、最新事件或需要事实核查的内容时，
你可以通过联网搜索获取最新信息，并在回答中说明信息来源于网络。
"""

    def ask(self, question: str) -> str:
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": question}
        ]

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                max_tokens=800,
                extra_body={
                    "enable_search": True
                }
            )

            return response.choices[0].message.content

        except Exception as e:
            return f"错误: {repr(e)}"

    def interactive_chat(self):
        print("=== Qwen 联网搜索 Agent ===")
        print("输入 quit / exit 结束对话")

        while True:
            question = input("\n你: ").strip()
            if question.lower() in {"quit", "exit"}:
                break

            print("助理:", self.ask(question))
```

---

## 测试搜索 Agent

创建 `test_search_agent.py`：

```python
# test_search_agent.py
from src.agent_with_search import AgentWithSearch

def test_search_agent():
    agent = AgentWithSearch()

    questions = [
        "今天北京的天气怎么样？",
        "最新的科技新闻有哪些？",
        "2024年奥运会举办地是哪里？",
        "Python 是什么？"
    ]

    for q in questions:
        print(f"\n用户: {q}")
        print("助理:", agent.ask(q)[:300], "...")

if __name__ == "__main__":
    test_search_agent()
```

运行测试：

```bash
python test_search_agent.py
```

输出示例：

```
用户: 今天北京的天气怎么样？
助理: 今天是2026年2月7日，星期六。根据最新天气预报信息，北京今天的天气情况如下：

- 天气状况：多云转晴
- 气温范围：最低气温约 -9℃，最高气温约 2℃
- 风向风力：白天到夜间有 东北风1级
- 空气质量：37（优）
- 穿衣建议：建议穿棉衣、冬大衣、皮夹克、厚呢外套、羽绒服等...
```

---

## 总结

本教程展示了从基础问答 Agent（仅限训练数据）到通过 Qwen 内置 `enable_search` 参数增强实时搜索能力的演进过程，说明了工具如何扩展 Agent 超越其基础知识的能力。

### 关键要点

| 阶段 | 能力 | 局限 |
|------|------|------|
| **基础 Agent** | 回答训练数据内的问题 | 无法获取实时信息 |
| **搜索增强 Agent** | 联网搜索最新信息 | 依赖外部 API |

### 下一步

- 添加更多工具（计算、文件操作等）
- 实现记忆系统（短期/长期记忆）
- 构建多工具协作的 Agent
- 探索 LangChain、AutoGen 等框架
