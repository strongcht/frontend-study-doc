# 大语言模型基础（LLM）

大语言模型（Large Language Model，简称 LLM）是 AI Agent 的核心组成部分，是构建智能体的基础知识。

---

## 基本概念

LLM 本质上是根据用户提供的文本（提示），逐字预测最合理下文的深度学习模型。它通过分析海量互联网文本学习语言的统计规律，收到输入后根据所学规律生成续写。

可以将 LLM 比喻为一个记忆力超强的学生：

- **学习阶段（训练）**：阅读互联网上几乎所有的公开文本（数据量可达万亿单词级别），学习复杂的语言规律，而非死记硬背。
- **应用阶段（推理）**：运用所学规律，逐字生成符合逻辑和语境的回答。

"大"体现在两个方面：

- **参数规模大**：内部有数百亿甚至上万亿个可调节参数，存储语言知识。
- **训练数据大**：文本数据量巨大，涵盖互联网公开信息精华。

LLM 逐词生成文本——每次预测一个词，将新词纳入输入继续预测下一个，循环直到生成完整回答。

---

## LLM 的局限性

| 能力 | 说明 | 局限性 |
|------|------|--------|
| 知识截止 | 训练数据有截止日期 | 无法获知训练后的新信息 |
| 数学计算 | 能做简单计算 | 复杂计算容易出错 |
| 实时信息 | 需要外部工具辅助 | 本身无法获取实时数据 |
| 事实准确性 | 可能生成错误信息 | 需要事实核查 |
| 长文本处理 | 上下文长度有限制 | 超长文本会丢失信息 |
| 逻辑一致性 | 可能前后矛盾 | 需要仔细设计和验证 |

LLM 本质上是基于统计的模式匹配系统，理解其局限性才能更好地利用其能力。

---

## 核心工作原理：Transformer 架构简析

Transformer 是 LLM 的底层核心技术。其核心流程分三个阶段：

### 阶段 1：输入处理

文本被拆分成 Token，转换为计算机能理解的数字向量。

### 阶段 2：理解上下文（核心）

**自注意力机制（Self-Attention）** 让模型处理每个词时，都能权衡句子中所有其他词的重要性，且该过程是并行的。

### 阶段 3：生成与循环

模型基于对所有词的理解计算概率分布，预测下一个最可能的词，输出后作为新输入重复整个过程。

### 自注意力机制详解

以"苹果的手机它的电池很大"为例：

- 处理"它"这个词时，自注意力机制帮助模型判断：
  - "它"与"苹果"和"手机"高度相关，注意力权重高
  - "它"对"电池"和"很大"的权重较低

自注意力机制的关键创新在于能够并行处理并深度理解全局上下文，使得 Transformer 架构在语言任务上远超 RNN 等以往技术。

---

## 如何与 LLM 交互：Prompt 工程入门

Prompt（提示词）是用户给 LLM 的输入，告知模型需求。Prompt 质量直接决定回答质量。

一个好的 Prompt 通常由四部分组成：

1. **上下文**：角色与背景
2. **指令**：任务目标
3. **示例**：范例参考（可选）
4. **格式要求**：输出格式

### 基本原则

- **明确具体**：避免模糊表达，给出详细要求（如受众、长度、风格等）。
- **提供上下文**：告知模型身份、背景和目标。
- **指定格式**：需要特定格式输出时明确说明（如 bullet points、JSON 等）。
- **分步思考（Chain-of-Thought）**：对复杂问题引导模型逐步推理，可显著提升准确率。

---

## LLM 常见应用场景

| 场景类别 | 具体示例 | 说明 |
|----------|----------|------|
| 内容创作与编辑 | 撰写邮件、报告、博客；续写故事；润色文案；翻译 | 快速生成草稿，提供灵感 |
| 信息检索与总结 | 阅读长文档提炼核心观点；基于知识库的问答 | 比传统搜索更理解问题 |
| 编程辅助 | 解释代码、生成代码、调试、重构、编写测试 | 全天候编程伙伴 |
| 对话与客服 | 智能聊天机器人、个性化导师、角色扮演 | 拟人化交互体验 |
| 逻辑推理与分析 | 解数学题、逻辑推理、分析数据趋势、制定计划 | 限定领域内展示推理能力 |

---

## API 调用与参数设置

构建 AI Agent 需要通过 API 调用 LLM。以下以 OpenAI API 为例介绍基本调用方法。

### 基础 API 调用

**安装：**

```bash
pip install openai
```

需要在 OpenAI 官网注册账号并生成 API Key。

**代码示例：**

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key="你申请的 API key",
)

response = client.responses.create(
    model="gpt-4o",
    instructions="You are a coding assistant that talks like a pirate.",
    input="How do I check if a Python object is an instance of a class?",
)

print(response.output_text)
```

---

### DeepSeek 配置

DeepSeek API 完全兼容 OpenAI API 格式，只需修改少量配置。

**核心配置参数：**

| 参数 | 取值/说明 |
|------|-----------|
| `base_url` | 必填，固定值：`https://api.deepseek.com` |
| `api_key` | 必填，在 DeepSeek 官网申请 |
| `model` | `deepseek-v4-flash`（非思考模式，速度快）或 `deepseek-v4-pro`（思考模式，推理更强） |

**代码示例：**

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get('DEEPSEEK_API_KEY'),
    base_url="https://api.deepseek.com"
)

try:
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=[
            {"role": "system", "content": "You are a helpful assistant"},
            {"role": "user", "content": "Hello"},
        ],
        stream=False
    )
    print("回复结果：", response.choices[0].message.content)
except Exception as e:
    print("调用失败：", str(e))
```

---

### 阿里百炼（通义千问）配置

阿里云百炼支持 OpenAI 兼容接口，只需调整 API Key、BASE_URL 和模型名称即可迁移。

需要开通阿里云百炼服务并获取 API-KEY。开通不产生费用，仅模型调用（超出免费额度后）等操作产生计费。

#### 非流式调用示例

```python
from openai import OpenAI

def get_response():
    client = OpenAI(
        api_key="sk-xxx",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    )
    completion = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': '你是谁？'}
        ]
    )
    print(completion.choices[0].message.content)

if __name__ == '__main__':
    get_response()
```

#### 流式调用示例

```python
from openai import OpenAI

def get_response():
    client = OpenAI(
        api_key="sk-xxx",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    )

    completion = client.chat.completions.create(
        model="qwen-plus",
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant.'},
            {'role': 'user', 'content': '你是谁？'}
        ],
        stream=True,
        stream_options={"include_usage": True}
    )

    for chunk in completion:
        if hasattr(chunk, "choices") and len(chunk.choices) > 0:
            choice = chunk.choices[0]
            if hasattr(choice, "delta") and hasattr(choice.delta, "content"):
                print(choice.delta.content, end='', flush=True)

if __name__ == '__main__':
    get_response()
```

---

## 主流大语言模型一览

| 模型名称 | 所属公司 | 官网 | API文档 |
|----------|----------|------|---------|
| GPT系列 (GPT-5.2/GPT-4o) | OpenAI | openai.com | platform.openai.com |
| Claude系列 (Opus 4.6/Sonnet 4.5) | Anthropic | anthropic.com | docs.anthropic.com |
| Gemini系列 (Gemini 3 Pro/Flash) | Google | deepmind.google | docs.gemini.com |
| 通义千问 (Qwen 3.0系列) | 阿里巴巴 | qianwen.com | 阿里云DashScope |
| 文心一言 (ERNIE 5.0系列) | 百度 | yiyan.baidu.com | qianfan.cloud.baidu.com |
| 智谱清言 (GLM-4.7系列) | 智谱AI | chatglm.cn | open.bigmodel.cn |
| Kimi (Moonshot K2.5系列) | 月之暗面 | kimi.moonshot.cn | platform.moonshot.cn |
| 讯飞星火大模型 | 科大讯飞 | xinghuo.xfyun.cn | xfyun.cn |
| DeepSeek系列 | DeepSeek | deepseek.com | api-docs.deepseek.com |
| Llama系列 (Llama 3.1/Llama 4) | Meta | llama.com | llama.com/docs |
| Grok系列 (Grok 4.1) | xAI | x.ai | docs.x.ai |
| MiniMax (M2.1系列) | MiniMax | minimaxi.com | api.minimax.chat |
| 百川智能 (Baichuan 3系列) | 百川智能 | baichuan-ai.com | platform.baichuan-ai.com |
| Ollama（本地部署模型） | Ollama | ollama.com | GitHub文档 |
| 豆包大模型 | 字节跳动 | doubao.com | volcengine.com |

---

## 总结

| 概念 | 要点 |
|------|------|
| LLM 本质 | 基于统计的逐词预测模型，通过海量数据训练学习语言规律 |
| Transformer | LLM 的核心架构，自注意力机制实现并行的全局上下文理解 |
| Prompt | 用户与 LLM 交互的输入，质量直接决定输出质量 |
| API 调用 | 主流厂商均兼容 OpenAI 接口格式，切换只需修改 base_url 和 model |
| 局限性 | 知识截止、幻觉、上下文长度限制、无法获取实时信息 |
