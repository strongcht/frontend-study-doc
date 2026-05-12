# Agent 架构

Agent（智能体）是指能够自主感知环境、推理并采取行动以完成目标的 AI 系统。

本文从最简单的循环到多 Agent 协作，一文读懂六种主流架构的原理、图解与适用场景，帮助你在实际项目中做出合适的技术选型。

---

## 什么是 Agent 架构

在 AI 应用开发中，Agent（智能体）是指能够感知环境、自主做出决策、并采取行动的 AI 系统。

与传统的"问一答一"式大模型调用不同，Agent 可以连续地执行多步操作，调用工具，甚至协调其他 Agent，来完成复杂任务。

Agent 架构是指 Agent 系统中各个组件的组织方式，决定了 Agent 的能力边界、可靠性、灵活性和适用场景。

### Agent 的本质：感知 → 推理 → 行动

Agent 的工作方式本质上是一个循环（Loop）——感知当前状态，推理下一步，执行行动，再次感知……直到任务完成。

```
感知环境 → 推理决策 → 执行行动 → 观察结果 → 继续循环
```

不同架构的差异，就在于如何组织和扩展这个基本循环。

> 本文假设你已了解大语言模型（LLM）的基本概念，以及"工具调用"（Function Calling）的基本思路。

---

## 架构一：单 Agent 循环（Single Agent Loop）

**入门首选** · **实现简单**

最基础也最直观的架构，一个 Agent 从头到尾独立完成所有任务。

单 Agent 循环直接体现了 ReAct 模式（Reasoning + Acting）：每一步都是"先想再做"。LLM 充当大脑，工具调用是它的双手。

### 工作流程

```
用户任务输入
    ↓
感知 · 收集上下文（读取文件、获取状态）
    ↓
推理 · 决定下一步（分析情况，选择工具）
    ↓
行动 · 调用工具（Bash / Read / Edit...）
    ↓
完成输出结果 / 继续循环
```

### 工作原理

- **感知**：读取当前状态——文件内容、环境变量、之前步骤的输出结果，整合成当前上下文。
- **推理**：LLM 根据上下文决定下一步动作——调用哪个工具、传入什么参数，或者判断任务是否已完成。
- **行动**：执行工具调用，例如读写文件、搜索网络。工具的执行结果会被追加到上下文中，进入下一轮循环。

> 每次工具调用的结果都会回写到上下文（Context Window）。因此随着任务推进，上下文会不断增长，直到触达 LLM 的上下文窗口限制——这是单 Agent 循环最主要的瓶颈。

### 代码示例

```python
class SimpleAgent:
    """单 Agent 循环的基本结构"""

    def __init__(self, model, tools, max_turns=10):
        self.model = model          # 大语言模型
        self.tools = tools          # 可用工具列表
        self.max_turns = max_turns  # 最大循环轮次，防止无限循环

    def run(self, task: str) -> str:
        """执行任务的主循环"""
        context = f"用户任务：{task}"

        for turn in range(self.max_turns):
            # 第一步：思考 —— 让模型决定下一步
            response = self.model.think(context)

            # 如果模型认为任务完成，返回最终答案
            if response.is_final():
                return response.content

            # 第二步：行动 —— 调用模型选择的工具
            tool_name = response.tool_name
            tool_args = response.tool_args
            tool_result = self.tools[tool_name](**tool_args)

            # 第三步：将工具结果反馈给模型，进入下一轮
            context += f"\n工具 {tool_name} 返回：{tool_result}"

        return "达到最大轮次，任务未完成"

# 使用示例
agent = SimpleAgent(model=llm, tools={
    "read_file": read_file,
    "search_code": search_code,
    "run_test": run_test
})
result = agent.run("修复项目中 user.py 的类型错误")
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 实现最简单，易于调试 | 上下文窗口容易撑满 |
| 适合任务边界清晰的场景 | 复杂任务中容易"偏航" |
| 几乎所有 Agent 框架都支持 | 无法并行处理多个子任务 |

**最佳适用场景**：修复一个 bug、编写一个函数、回答一个具体问题。任务明确，复杂度适中，不需要并行或多角色协作。

> 如果你的任务预计需要超过 15 轮工具调用，单 Agent 循环可能不是最佳选择。考虑使用多 Agent 协作或规划执行架构来分解复杂度。

---

## 架构二：规划 + 执行（Plan & Execute）

**直觉友好** · **可审查**

将"想清楚要做什么"和"实际去做"分离为两个独立阶段，提升任务的可预测性和可审计性。

在规划阶段，模型不执行任何操作，只生成一份详细的执行步骤列表。在执行阶段，系统依次完成每个步骤。这种分离让用户可以在执行前审查计划，就像 Claude Code 的 Plan Mode 一样。

### 工作流程

```
用户任务
    ↓
规划器（Planner）→ 生成分步执行计划
    ├── 步骤 1：收集信息
    ├── 步骤 2：分析处理
    └── 步骤 3：输出结果
    ↓
执行阶段：执行器（Executor）依序完成每个步骤
    ↓
完成任务

旁路：动态重新规划（可选）
```

### 两种变体

| 变体 | 行为 | 典型场景 |
|------|------|----------|
| **静态规划** | 计划一次性生成，按顺序线性执行，不中途调整 | 流程固定、步骤明确的任务，如数据迁移脚本 |
| **动态规划** | 每执行一步后重新评估，根据结果调整后续计划 | 结果不确定的任务，如调试、探索性数据分析 |

动态规划更健壮，但实现复杂度更高，且每步重新规划会消耗额外的 token。

> Claude Code 的 Plan Mode 就是这个架构的体现——点击"计划"后，AI 先输出一份详细计划供你审查，确认后才开始执行。这大幅提升了用户的掌控感。

### 代码示例

```python
class PlanExecuteAgent:
    """先规划、后执行的 Agent"""

    def plan(self, task: str) -> list:
        """阶段一：生成执行计划"""
        plan = self.model.generate(f"""
        请将以下任务拆解为可执行的步骤列表：
        任务：{task}
        返回 JSON 格式的步骤列表，每步包含：
        - step_id: 步骤编号
        - description: 步骤描述
        - tool: 需要调用的工具名
        """)
        return plan

    def execute(self, plan: list, dynamic: bool = False) -> str:
        """阶段二：逐步执行计划"""
        results = []
        remaining_plan = plan.copy()

        while remaining_plan:
            step = remaining_plan.pop(0)
            output = self.tools[step["tool"]](step["description"])
            results.append({"step": step["step_id"], "output": output})

            if dynamic and remaining_plan:
                # 动态规划：根据当前结果重新评估后续计划
                remaining_plan = self.replan(remaining_plan, results)

        return self.summarize(results)

# 使用示例
agent = PlanExecuteAgent()
plan = agent.plan("为项目添加用户认证功能")
# 人类可以先审查 plan，确认合理后再执行
result = agent.execute(plan, dynamic=True)
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 执行前可人工审查计划 | 初始计划可能不够准确 |
| 推理和执行职责分离，清晰 | 两阶段增加了延迟 |
| 对长任务友好 | 静态版本难以应对意外情况 |

> Plan & Execute 的代价是增加了推理轮次，对于简单任务反而是一种浪费。如果一个任务可以在 3 步内完成，直接用单 Agent 循环更高效。

---

## 架构三：多 Agent 协作（Multi-Agent）

**生产推荐** · **复杂任务**

一个 Orchestrator（协调者）负责任务拆解和调度，多个 Subagent 各司其职，并行或串行地完成子任务，结果汇聚回 Orchestrator 做综合。

当单个 Agent 面临上下文窗口不足或任务过于复杂时，多 Agent 架构提供了一个优雅的解决方案：让多个专门化的子 Agent 并行工作，由一个 Orchestrator（协调者）统筹全局。

### 工作流程

```
协调者（Orchestrator）
    ↓ 任务分解 · 调度 · 结果综合
    ↓ 分发任务并行执行
    ├── 子 Agent A（代码审查）
    ├── 子 Agent B（安全检测）
    └── 子 Agent C（性能分析）
    ↓ 返回结果
结果汇总 → 综合各子 Agent 输出
```

### 独立上下文是核心优势

每个子 Agent 拥有独立的上下文窗口。代码审查 Agent 深度阅读 auth.py 不会影响性能分析 Agent 的判断；安全检测 Agent 产生的大量中间输出不会挤占其他 Agent 的空间。

> 子 Agent（Subagent）是短暂的、隔离的——完成一个任务后即销毁。Agent 团队（Agent Teams）则是多个独立 Agent 实例长时间协作、互相发消息，更像一个真实的团队。

### 代码示例

```python
class Orchestrator:
    """编排器：负责任务拆解、分发和结果汇总"""

    def __init__(self):
        self.subagents = {
            "code_review": Subagent(
                name="代码审查",
                tools=["read_file", "static_analysis"],
                system_prompt="你是代码审查专家..."
            ),
            "security": Subagent(
                name="安全检测",
                tools=["scan_vulnerability", "check_deps"],
                system_prompt="你是安全检测专家..."
            ),
            "performance": Subagent(
                name="性能分析",
                tools=["profile_code", "analyze_complexity"],
                system_prompt="你是性能分析专家..."
            )
        }

    def handle_task(self, task: str) -> dict:
        # 第一步：分析任务，决定需要哪些 Subagent
        needed = self.plan(task)

        # 第二步：并行分发（各 Subagent 同时工作，独立上下文）
        results = {}
        for agent_name in needed:
            sub_task = self.decompose(task, agent_name)
            results[agent_name] = self.subagents[agent_name].run(sub_task)

        # 第三步：汇总各 Subagent 的结果，综合输出
        return self.synthesize(task, results)

# 使用示例：一次运行，三个维度并行分析
orch = Orchestrator()
report = orch.handle_task("审查项目 PR #42")
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 天然支持并行，速度快 | 协调逻辑复杂，调试困难 |
| 子 Agent 各自独立，上下文互不干扰 | 多个 Agent 并行的 Token 成本更高 |
| 可以专门化每个子 Agent 的角色 | Orchestrator 本身可能成为瓶颈 |

> 多 Agent 协作的主要成本是编排开销。如果子任务非常简单（每个只需 1-2 步），编排开销可能超过实际工作的开销，此时单 Agent 更合适。

---

## 架构四：反思与自我修正（Reflection）

**高质量输出** · **易于集成**

在 Agent 的输出环节加入质量评估，不满意则重新生成或修正，形成内部迭代循环。

反思架构为 Agent 增加了一个"质检环节"：每次生成输出后，都由一个评判者（Critic）来评估质量，如果不达标则要求修正，直到输出满足标准。

### 工作流程

```
执行器（Executor）生成初始输出
    ↓
评判者（Critic）评估质量与正确性
    ├── 通过 → 输出最终结果
    └── 未通过 → 修正器（Reviser）根据反馈改进输出
                    ↓
                重新生成（通常设置最大迭代次数限制）
```

### 两种实现方式

| 方式 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| **自我反思** | 同一个模型先执行再评估自己的输出 | 实现简单，无额外模型成本 | 模型可能对自己的错误"视而不见" |
| **Critic 模型** | 用独立的评判模型评估执行模型的输出 | 更客观，能发现执行模型盲区 | 增加模型调用成本和延迟 |

> "写单元测试 → 运行测试 → 观察失败 → 修复代码 → 再次运行"——这就是反思架构的经典应用。测试结果本身就是 Critic 的反馈信号。

### 代码示例

```python
class ReflectiveAgent:
    """带有自我反思能力的 Agent"""

    def __init__(self, model, tools, max_reflections=3):
        self.model = model
        self.tools = tools
        self.max_reflections = max_reflections  # 最多修正次数，防止死循环

    def run(self, task: str) -> str:
        # 第一步：正常执行，产生初始输出
        output = self.model.generate(task)

        for i in range(self.max_reflections):
            # 第二步：反思 —— 评估输出质量
            critique = self.model.generate(f"""
            请严格评估以下输出：
            原始任务：{task}
            当前输出：{output}
            检查：事实错误？逻辑漏洞？遗漏信息？格式问题？
            如果输出完美无缺，请回复 "PASS"。
            """)

            if "PASS" in critique:
                break  # 输出通过审查

            # 第三步：修正 —— 根据批评意见改进
            output = self.model.generate(f"""
            原始任务：{task}
            上次输出：{output}
            问题反馈：{critique}
            请根据反馈修正输出。
            """)

        return output

# 使用示例
agent = ReflectiveAgent(model=llm, tools={})
code = agent.run("编写一个 Python 函数，实现字符串的 AES 加密")
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 显著提升输出质量 | 多次迭代增加延迟和成本 |
| 可以设置明确的质量标准 | 需要设置最大迭代次数防止死循环 |
| 适合有客观评判标准的任务 | 评判标准难以形式化时效果有限 |

> 反思循环每次迭代都是一次额外的 LLM 调用，会明显增加延迟。此外需要设置反思次数上限，否则模型可能陷入"永远不满意"的死循环。

---

## 架构五：RAG + Agent（检索增强型智能体）

**知识密集任务** · **大型知识库**

在 Agent 的工具集里加入向量检索能力，让 Agent 在推理过程中动态查询外部知识库，克服上下文窗口的限制。

RAG（Retrieval-Augmented Generation，检索增强生成）本是一种让 LLM 查询外部知识库的技术。当它与 Agent 结合时，变得更加强大：Agent 可以主动决定何时检索、检索什么，而不是每次都被动地检索一次。

### 工作流程

```
用户查询
    ↓
主动检索（决定检索时机与内容）
    ↓
知识库（文档/向量数据库/代码库/记忆）
    ↓ 查询返回
增强上下文
    ↓
增强推理（结合知识库内容推理）
    ↓
按需再检索 → 执行行动（基于知识的精准操作）
```

### 与普通 RAG 的关键区别

普通 RAG 是"被动、一次性"的：用户提问时固定检索一次，将结果塞入 Prompt。

RAG + Agent 则不同：Agent 自主判断在推理的哪个环节需要补充知识、需要检索什么，并可以多次查询知识库，直到获得足够的信息来完成任务。

### 代码示例

```python
class RAGAgent:
    """带有动态检索能力的 Agent"""

    def __init__(self, model, vector_db, max_retrievals=5):
        self.model = model
        self.vector_db = vector_db  # 向量数据库
        self.max_retrievals = max_retrievals

    def should_retrieve(self, context: str, question: str) -> bool:
        """Agent 自己判断是否需要检索更多信息"""
        decision = self.model.generate(f"""
        当前已知信息：{context}
        当前问题：{question}
        现有信息是否足以回答问题？回答 YES 或 NO。
        """)
        return "NO" in decision

    def run(self, task: str) -> str:
        context = ""
        retrieval_count = 0

        while retrieval_count < self.max_retrievals:
            # Agent 自主判断是否需要检索
            if not self.should_retrieve(context, task):
                break

            # Agent 自主决定检索什么
            search_query = self.model.generate(f"""
            任务：{task}
            已有信息：{context}
            为了完成任务，下一步应该检索什么信息？
            """)

            # 执行检索，结果追加到上下文
            docs = self.vector_db.search(search_query)
            context += "\n".join(docs)
            retrieval_count += 1

        # 综合所有信息生成最终答案
        return self.model.generate(f"任务：{task}\n参考资料：{context}")

# 使用示例
agent = RAGAgent(model=llm, vector_db=docs_db)
answer = agent.run("框架中如何配置数据库连接池？")
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 突破上下文窗口限制 | 检索质量影响整体效果 |
| 输出有据可查，减少幻觉 | 向量数据库的维护成本 |
| 知识库可独立更新 | 检索延迟增加响应时间 |

---

## 架构六：工作流编排（Workflow / DAG）

**生产首选** · **高可靠性**

把 Agent 行为固化为一张有向无环图（DAG），每个节点是一个 LLM 调用或工具调用，边表示数据依赖关系，由框架驱动执行。

这是最接近传统软件工程的一种 Agent 架构。与前面几种架构的最大区别在于：Agent 的自主决策空间被限制在单个节点内部，节点之间的流转是预先定义好的，不可更改。

### 工作流程

```
数据输入
    ↓
┌───────────┬───────────┐
│  任务 A   │  任务 B   │  ← 独立并行执行
└─────┬─────┴─────┬─────┘
      └─────┬─────┘
            ↓ A、B 均完成后才触发
      聚合节点（等待依赖，整合结果）
            ↓
          输出
```

### 纯 Agent vs DAG 工作流

| 特性 | 纯 Agent | DAG 工作流 |
|------|----------|------------|
| 流程控制 | 模型自主决定下一步 | 预定义的 DAG 图决定 |
| 可预测性 | 低，每次运行路径可能不同 | 高，运行路径确定 |
| 可调试性 | 难，依赖日志追踪 | 易，每个节点输入输出明确 |
| 容错性 | 依赖模型自行恢复 | 框架提供重试、断点续跑 |
| 灵活性 | 高，可应对意外情况 | 低，只能走预定义路径 |

DAG 的"无环"（Acyclic）特性意味着工作流是确定性的——没有无限循环，执行路径可以完全预测，失败的节点可以单独重试。

> DAG 是"低自主性、高可预测性"的极端。你需要预先设计好整个流程。这不是缺点，而是刻意的设计取舍——生产环境中有时候确定性比灵活性更重要。

### 代码示例

```python
from langgraph import StateGraph

# 定义工作流状态 —— 节点间传递的数据对象
class PipelineState:
    raw_data: str = ""
    cleaned_data: str = ""
    analysis_result: dict = {}
    final_report: str = ""

# 定义 DAG 节点
def extract_data(state: PipelineState) -> PipelineState:
    """节点1：提取原始数据"""
    state.raw_data = query_database("SELECT * FROM logs")
    return state

def clean_data(state: PipelineState) -> PipelineState:
    """节点2：清洗数据"""
    state.cleaned_data = preprocess(state.raw_data)
    return state

def analyze_data(state: PipelineState) -> PipelineState:
    """节点3：统计分析"""
    state.analysis_result = statistical_analysis(state.cleaned_data)
    return state

def generate_report(state: PipelineState) -> PipelineState:
    """节点4：使用 LLM 生成报告"""
    state.final_report = llm.generate(
        f"基于以下分析结果生成报告：{state.analysis_result}"
    )
    return state

# 构建 DAG：定义节点和边
workflow = StateGraph(PipelineState)
workflow.add_node("extract", extract_data)
workflow.add_node("clean", clean_data)
workflow.add_node("analyze", analyze_data)
workflow.add_node("report", generate_report)

workflow.add_edge("extract", "clean")
workflow.add_edge("clean", "analyze")
workflow.add_edge("analyze", "report")
workflow.set_entry_point("extract")
workflow.set_finish_point("report")

# 编译并运行
app = workflow.compile()
result = app.invoke(PipelineState())
print(result.final_report)
```

### 优缺点

| 优点 | 缺点 |
|------|------|
| 可预测、可审计、可重试 | 流程需要预先设计，灵活性低 |
| 支持并行加速 | 难以应对未预期的情况 |
| 工程化程度高，运维友好 | 需要学习编排框架 |

---

## 横向对比与如何选择

| 架构 | 自主性 | 可预测性 | 并行能力 | 适合任务复杂度 | 典型实现 |
|------|--------|----------|----------|---------------|---------|
| 单 Agent 循环 | 高 | 低 | 无 | 中低 | Claude Code 默认模式 |
| 规划 + 执行 | 中 | 中 | 部分 | 中高 | Claude Code Plan Mode |
| 多 Agent 协作 | 高 | 低 | 强 | 高 | AutoGen, CrewAI |
| 反思 / 自我修正 | 中 | 中 | 无 | 中 | Reflexion, Self-Refine |
| RAG + Agent | 高 | 中 | 无 | 中高 | LangChain RAG Agent |
| 工作流编排 | 低 | 高 | 强 | 高（固定流程） | LangGraph, Prefect |

### 常见组合模式

实际生产系统通常会组合使用多种架构：

- **工作流编排 + 多 Agent**：用 DAG 定义主流程，每个节点内部是一个独立的 Agent。例如 CI/CD 流水线中，代码检查节点是 Code Review Agent，安全扫描节点是 Security Agent。
- **多 Agent + RAG**：多个 Subagent 共享同一个向量知识库，各自根据子任务按需检索。例如客服系统中，订单查询 Agent 和退款处理 Agent 都查询同一个知识库但检索不同的内容。
- **规划执行 + 反思**：先规划再执行，但每个步骤执行后加入反思环节确保质量。适合对质量要求极高的任务。

> 如果你不确定从哪里开始，从单 Agent 循环开始。它最容易实现和调试。当你发现上下文窗口不够用时，考虑多 Agent；当你需要质量保证时，加入反思层；当流程趋于稳定时，重构为 DAG 以提升可靠性。

### 常见误区

| 误区 | 纠正 |
|------|------|
| 架构越复杂越好 | 用能满足需求的最简架构。如果单 Agent 5 步能完成，引入编排开销反而降低效率 |
| 反思一定能提升质量 | 有效性取决于模型的自我评估能力。严格要求时考虑 Critic 模型或外部验证 |
| DAG 工作流不需要 Agent | DAG 定义流程骨架，每个节点内部仍可是 Agent 调用。DAG 提供可靠性，Agent 提供灵活性 |
| 上下文窗口大了就不需要 RAG | RAG 的价值不仅在于"装得下"，更在于精准检索——减少噪音、降低推理成本、提高答案准确性 |

---

## 总结

六种 Agent 架构覆盖了从高度自主到高度可控的完整光谱。

选择架构时，核心考量只有两个：你需要多大的灵活性来应对意外情况，以及你需要多大的确定性来保证结果可靠。

**从简单开始，在确实需要时才增加复杂度，这是 Agent 架构选型的第一原则。**
