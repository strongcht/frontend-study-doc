# AI Agent 垂直应用场景

不同领域对 Agent 有不同的需求和特点。通过领域定制，Agent 能够提供更专业的服务。

---

## 代码 Agent（Code Agent）

代码 Agent 是目前最成功的 Agent 应用领域之一，能够理解代码库、编写新代码和调试问题。

### 核心能力

- **代码补全（Code Completion）**：根据上下文预测下一段代码
- **代码生成（Code Generation）**：从自然语言描述生成代码
- **代码审查（Code Review）**：识别代码中的问题和改进点
- **Bug 定位（Bug Location）**：分析错误信息，定位根因
- **代码重构（Code Refactoring）**：提出并执行代码优化建议

### 代表系统

| 系统 | 开发公司 | 特点 |
|------|----------|------|
| GitHub Copilot | GitHub/OpenAI | 主要代码补全，实时建议 |
| Claude Code | Anthropic | 命令行助手，深度代码理解 |
| Devin | Cognition | 自主编程，端到端任务执行 |
| Cursor | Cursor | AI 代码编辑器，深度 IDE 集成 |

---

## 数据分析 Agent（Data Analysis Agent）

数据分析 Agent 能够理解数据需求、执行查询并生成分析报告，让非技术用户也能进行复杂的数据分析。

### 核心能力

- **数据理解**：理解数据库结构和数据含义
- **查询生成**：Text2SQL，将自然语言转换为查询
- **可视化**：生成图表建议和配置
- **报告生成**：分析结果并产生自然语言报告

### 代码实现

```python
class DataAnalysisAgent:
    """
    数据分析 Agent
    理解数据需求，执行分析，生成报告
    """

    def __init__(self, llm, db_connection, chart_generator):
        self.llm = llm
        self.db = db_connection
        self.chart_generator = chart_generator

    def analyze(self, request):
        """处理数据分析请求"""
        # 第一步：理解分析需求
        intent = self.parse_intent(request)

        # 第二步：生成查询
        query = self.generate_query(intent)

        # 第三步：执行查询
        data = self.execute_query(query)

        # 第四步：分析数据
        analysis = self.perform_analysis(data, intent)

        # 第五步：生成可视化建议
        charts = self.suggest_charts(analysis)

        # 第六步：生成报告
        report = self.generate_report(analysis, charts)

        return {
            "intent": intent,
            "query": query,
            "data": data,
            "analysis": analysis,
            "charts": charts,
            "report": report
        }

    def parse_intent(self, request):
        """解析用户意图"""
        prompt = f"""
分析以下数据请求，提取关键信息：

请求：{request}

请提取：
1. 分析目标（比较、趋势、分布等）
2. 涉及的表和字段
3. 时间范围（如果有）
4. 筛选条件（如果有）
"""
        return self.llm.generate(prompt)

    def generate_query(self, intent):
        """生成 SQL 查询"""
        prompt = f"""
基于以下意图生成 SQL 查询：

{intent}

数据库 Schema：
{self.get_schema()}
"""
        return self.llm.generate(prompt)

    def execute_query(self, query):
        """执行查询"""
        cursor = self.db.cursor()
        cursor.execute(query)
        columns = [desc[0] for desc in cursor.description]
        rows = cursor.fetchall()
        return {"columns": columns, "rows": rows}

    def perform_analysis(self, data, intent):
        """执行数据分析"""
        import statistics

        rows = data["rows"]
        columns = data["columns"]

        analysis = {"row_count": len(rows), "summary": {}}

        for i, col in enumerate(columns):
            if self.is_numeric(rows, i):
                values = [row[i] for row in rows if row[i] is not None]
                if values:
                    analysis["summary"][col] = {
                        "min": min(values),
                        "max": max(values),
                        "avg": statistics.mean(values),
                        "median": statistics.median(values)
                    }

        return analysis

    def suggest_charts(self, analysis):
        """推荐可视化图表"""
        suggestions = []

        if "trend" in str(analysis).lower():
            suggestions.append({
                "type": "line",
                "description": "折线图，适合展示趋势变化"
            })

        if "comparison" in str(analysis).lower():
            suggestions.append({
                "type": "bar",
                "description": "柱状图，适合对比不同类别"
            })

        suggestions.append({
            "type": "table",
            "description": "数据表格，展示详细数据"
        })

        return suggestions

    def generate_report(self, analysis, charts):
        """生成分析报告"""
        prompt = f"""
基于以下分析结果，生成自然语言报告：

分析结果：
{analysis}

推荐图表：
{charts}

请生成一份清晰的分析报告。
"""
        return self.llm.generate(prompt)
```

---

## Text2SQL Agent

Text2SQL Agent 将自然语言转换为 SQL 查询，是数据分析 Agent 的核心组件。

```python
class Text2SQLAgent:
    """
    Text2SQL Agent
    将自然语言转换为 SQL 查询
    """

    def __init__(self, llm, schema):
        self.llm = llm
        self.schema = schema

    def convert(self, question):
        """
        将自然语言问题转换为 SQL
        :param question: 自然语言问题
        :return: SQL 查询语句
        """
        prompt = f"""
你是一个 SQL 专家。

数据库 Schema：
{self.schema}

规则：
1. 只生成 SELECT 查询（不支持 INSERT/UPDATE/DELETE）
2. 使用合理的表别名
3. 添加必要的 JOIN 条件
4. 使用清晰的列别名

问题：{question}

请生成对应的 SQL 查询。
"""
        sql = self.llm.generate(prompt)
        return self.sanitize(sql)

    def sanitize(self, sql):
        """SQL 安全检查"""
        sql_lower = sql.lower().strip()

        forbidden_keywords = [
            "insert", "update", "delete", "drop",
            "create", "alter", "truncate", "exec",
            "execute", "grant", "revoke"
        ]

        for keyword in forbidden_keywords:
            if keyword in sql_lower:
                raise ValueError(f"禁止的关键字: {keyword}")

        return sql

    def execute(self, question, db_connection):
        """执行 Text2SQL 查询"""
        sql = self.convert(question)
        cursor = db_connection.cursor()
        cursor.execute(sql)
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        return {"columns": columns, "rows": results}
```

---

## 客服 Agent（Customer Service Agent）

客服 Agent 需要处理多轮对话、理解用户意图并提供准确回复，是 AI 应用最广泛的场景之一。

### 核心能力

- **意图识别**：理解用户想要做什么
- **槽位填充**：提取关键信息，如时间、地点等
- **对话状态跟踪**：管理多轮对话上下文
- **回复生成**：生成自然、专业的回复

### 代码实现

```python
class CustomerServiceAgent:
    """
    客服 Agent
    处理用户咨询，提供服务支持
    """

    def __init__(self, llm, knowledge_base, dialogue_manager):
        self.llm = llm
        self.knowledge_base = knowledge_base
        self.dialogue_manager = dialogue_manager

    def handle(self, user_input, session_id):
        """处理用户消息"""
        history = self.dialogue_manager.get_history(session_id)
        intent = self.recognize_intent(user_input, history)

        if intent.type == "greeting":
            response = self.handle_greeting()
        elif intent.type == "inquiry":
            response = self.handle_inquiry(intent)
        elif intent.type == "complaint":
            response = self.handle_complaint(intent)
        elif intent.type == "order_status":
            response = self.handle_order_status(intent)
        elif intent.type == "refund":
            response = self.handle_refund(intent)
        else:
            response = self.handle_general(user_input)

        self.dialogue_manager.add_message(
            session_id, {"role": "user", "content": user_input}
        )
        self.dialogue_manager.add_message(
            session_id, {"role": "assistant", "content": response}
        )

        return response

    def recognize_intent(self, text, history):
        """识别用户意图"""
        prompt = f"""
分析用户消息，识别意图类型。

当前消息：{text}

对话历史：
{history}

意图类型：
- greeting: 打招呼
- inquiry: 咨询问题
- complaint: 投诉
- order_status: 查订单
- refund: 退款
- goodbye: 道别

请输出意图类型和置信度。
"""
        result = self.llm.generate(prompt)
        return Intent.parse(result)

    def handle_inquiry(self, intent):
        """处理咨询"""
        relevant_docs = self.knowledge_base.search(intent.query)

        if relevant_docs:
            prompt = f"""
基于以下文档回答用户问题。

文档：
{relevant_docs}

问题：{intent.query}
"""
            return self.llm.generate(prompt)
        else:
            return "这个问题我需要进一步了解，请稍等我来为您查询。"
```

---

## 调研 Agent（Research Agent）

调研 Agent 能够自主进行深度调研，收集和综合信息，模拟人类研究员的工作方式。

### 核心能力

- **搜索规划**：制定信息收集计划
- **多源搜集**：从多个来源收集信息
- **信息验证**：交叉验证信息准确性
- **报告生成**：将信息综合为结构化报告

### 代码实现

```python
class ResearchAgent:
    """
    调研 Agent
    自主进行深度调研，生成报告
    """

    def __init__(self, search_tools, llm):
        self.search_tools = search_tools
        self.llm = llm

    def research(self, topic, depth=3):
        """
        执行调研任务
        :param topic: 调研主题
        :param depth: 调研深度（搜索轮数）
        """
        # 第一步：制定调研计划
        plan = self.create_research_plan(topic, depth)

        # 第二步：执行多轮搜索
        findings = []
        for phase in plan.phases:
            phase_results = self.search_phase(phase)
            findings.extend(phase_results)

            synthesis = self.synthesize(findings)
            findings.append({
                "type": "synthesis",
                "content": synthesis,
                "phase": phase.number
            })

        # 第三步：生成最终报告
        report = self.generate_report(findings)

        return {
            "topic": topic,
            "plan": plan,
            "findings": findings,
            "report": report
        }

    def create_research_plan(self, topic, depth):
        """创建调研计划"""
        prompt = f"""
为以下调研主题制定详细计划：

主题：{topic}
深度：{depth}

请规划：
1. 需要调研的关键方向（3-5 个）
2. 每个方向需要回答的核心问题
3. 信息来源建议
"""
        return ResearchPlan.parse(self.llm.generate(prompt))

    def search_phase(self, phase):
        """执行单个搜索阶段"""
        results = []
        for query in phase.queries:
            for tool in self.search_tools:
                search_results = tool.search(query)
                results.extend(search_results)
        return results

    def synthesize(self, findings):
        """综合发现"""
        prompt = f"""
综合以下研究发现，提取关键信息：

发现列表：
{findings}

请提取：
1. 主要结论
2. 支持结论的证据
3. 存在的争议或不确定性
4. 需要进一步调研的问题
"""
        return self.llm.generate(prompt)

    def generate_report(self, findings):
        """生成最终报告"""
        prompt = f"""
基于以下研究发现，生成结构化报告：

研究发现：
{findings}

报告要求：
1. 执行摘要
2. 背景介绍
3. 主要发现（分主题）
4. 结论和建议
5. 参考来源

请生成完整报告。
"""
        return self.llm.generate(prompt)
```

---

## 其他垂直应用

### RPA + Agent

RPA（机器人流程自动化）与 Agent 技术结合，可以实现更复杂的业务流程自动化。Agent 为 RPA 提供智能决策能力。

### 游戏 NPC Agent

游戏 NPC（非玩家角色）Agent 可以进行动态对话、剧情生成和角色扮演，创造更真实的游戏世界体验。

### 科研 Agent

AI for Science 正在改变科研方式，能力包括：

- **文献综述**：自动阅读和总结大量论文
- **实验设计**：提出实验方案和假设
- **数据分析**：处理实验数据，发现规律
- **论文写作**：辅助撰写科研论文

---

## 章节小结

本章介绍了 Agent 在各垂直领域的应用：

- **代码 Agent** 辅助编程，提高开发效率
- **数据分析 Agent** 让非技术人员也能分析数据
- **客服 Agent** 提供智能化客户服务
- **调研 Agent** 自主进行深度调研
- 其他场景包括 RPA+Agent、游戏 NPC、科研 Agent 等

垂直领域 Agent 需要结合领域知识进行定制，选择合适的场景和切入点是成功部署的关键。
