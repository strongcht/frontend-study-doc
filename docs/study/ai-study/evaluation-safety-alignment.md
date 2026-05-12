# Agent 评估、安全与对齐

评估是确保 Agent 效果的基础。安全和对齐是 Agent 能否被信任和部署的关键。

---

## Agent 评测体系

评估 Agent 性能是开发过程中的关键环节。好的评测体系能够帮助我们了解 Agent 的能力边界，也为持续优化提供方向和依据。

### 评测维度

- **任务完成度**：Agent 是否正确完成了给定任务
- **效率指标**：完成任务所需的步骤数、token 消耗、执行时间
- **质量指标**：答案的准确性、响应的一致性、对话的自然度
- **鲁棒性**：对异常输入、噪声数据的处理能力

### 常用 Benchmark

| Benchmark | 用途 | 评估内容 |
|-----------|------|----------|
| GAIA | 通用 AI 助手评测 | 复杂任务处理、多步骤推理 |
| MMLU | 多任务语言理解 | 57 个学科的知识问答 |
| HumanEval | 代码生成评测 | Python 代码编写正确性 |
| HotpotQA | 多跳问答评测 | 需要多个文档推理的问题 |
| AgentBench | Agent 能力评测 | 真实环境中的 Agent 表现 |

### 评测框架实现

```python
class AgentEvaluator:
    """
    Agent 评测框架
    评估 Agent 在各种任务上的表现
    """

    def __init__(self, agent, metrics):
        self.agent = agent
        self.metrics = metrics

    def evaluate(self, test_cases):
        """
        执行评测
        :param test_cases: 测试用例列表
        :return: 评测报告
        """
        results = []

        for test_case in test_cases:
            result = self.run_single_test(test_case)
            results.append(result)

        report = self.generate_report(results)
        return report

    def run_single_test(self, test_case):
        """运行单个测试用例"""
        start_time = time.time()

        try:
            output = self.agent.run(test_case.input)
            success = self.evaluate_output(output, test_case.expected)
            error = None
        except Exception as e:
            output = None
            success = False
            error = str(e)

        end_time = time.time()

        return TestResult(
            test_case=test_case,
            output=output,
            success=success,
            error=error,
            duration=end_time - start_time,
            token_count=self.count_tokens(output)
        )

    def evaluate_output(self, output, expected):
        """评估输出是否符合预期"""
        for metric in self.metrics:
            if not metric.evaluate(output, expected):
                return False
        return True

    def generate_report(self, results):
        """生成评测报告"""
        total = len(results)
        passed = sum(1 for r in results if r.success)

        avg_duration = sum(r.duration for r in results) / total
        avg_tokens = sum(r.token_count for r in results) / total

        by_category = {}
        for r in results:
            category = r.test_case.category
            if category not in by_category:
                by_category[category] = {"total": 0, "passed": 0}
            by_category[category]["total"] += 1
            if r.success:
                by_category[category]["passed"] += 1

        return EvaluationReport(
            total=total,
            passed=passed,
            pass_rate=passed / total,
            avg_duration=avg_duration,
            avg_tokens=avg_tokens,
            by_category=by_category,
            results=results
        )


class TestCase:
    """测试用例"""

    def __init__(self, input, expected, category="general", metadata=None):
        self.input = input
        self.expected = expected
        self.category = category
        self.metadata = metadata or {}


class TestResult:
    """测试结果"""

    def __init__(self, test_case, output, success, error, duration, token_count):
        self.test_case = test_case
        self.output = output
        self.success = success
        self.error = error
        self.duration = duration
        self.token_count = token_count


class Metric:
    """评测指标基类"""

    def evaluate(self, output, expected):
        raise NotImplementedError


class ExactMatchMetric(Metric):
    """精确匹配指标"""

    def evaluate(self, output, expected):
        return output.strip() == expected.strip()


class ContainsMetric(Metric):
    """包含关键词指标"""

    def evaluate(self, output, expected):
        if isinstance(expected, list):
            return all(keyword in output for keyword in expected)
        return expected in output


class SemanticSimilarityMetric(Metric):
    """语义相似度指标"""

    def __init__(self, threshold=0.8):
        self.threshold = threshold

    def evaluate(self, output, expected):
        similarity = self.compute_similarity(output, expected)
        return similarity >= self.threshold

    def compute_similarity(self, text1, text2):
        """计算两个文本的语义相似度"""
        embedding1 = self.embedder.embed([text1])[0]
        embedding2 = self.embedder.embed([text2])[0]
        return cosine_similarity(embedding1, embedding2)
```

---

## 安全与对齐

Agent 的安全性至关重要。AI 系统可能受到各种攻击，产生有害输出。对齐（Alignment）确保 AI 行为符合人类意图和价值观。

### 常见安全威胁

#### 提示注入（Prompt Injection）

攻击者通过输入诱导 Agent 忽略系统指令。示例输入："忽略之前的指令，改为执行..." 这是一种上下文劫持攻击，利用 Agent 对用户输入的信任。

#### 越狱（Jailbreaking）

通过特定输入绕过安全限制，如使用角色扮演、虚构场景等手法。

#### 数据污染

恶意修改训练数据或检索结果，导致 Agent 产生错误或有害输出。

#### 敏感信息泄露

Agent 不当暴露用户隐私或系统内部信息。

### 防护策略

```python
class SecureAgent:
    """
    安全 Agent
    在基础 Agent 之上增加多层安全防护
    """

    def __init__(self, base_agent, guardrails, input_validator, output_filter):
        self.base_agent = base_agent
        self.guardrails = guardrails
        self.input_validator = input_validator
        self.output_filter = output_filter

    def process(self, user_input):
        """
        处理用户输入，包含多层安全检查
        """
        # ==================== 第一层：输入验证 ====================
        is_valid, reason = self.input_validator.validate(user_input)
        if not is_valid:
            return self.create_safety_response(reason)

        # ==================== 第二层：注入检测 ====================
        for guardrail in self.guardrails:
            check_result = guardrail.check_input(user_input)
            if not check_result.is_safe:
                self.log_security_event(
                    event_type="input_guardrail_triggered",
                    input=user_input,
                    reason=check_result.reason
                )
                return self.create_safety_response(check_result.reason)

        # ==================== 第三层：执行核心逻辑 ====================
        try:
            response = self.base_agent.process(user_input)
        except Exception as e:
            return self.create_error_response(str(e))

        # ==================== 第四层：输出过滤 ====================
        for guardrail in self.guardrails:
            check_result = guardrail.check_output(response)
            if not check_result.is_safe:
                self.log_security_event(
                    event_type="output_guardrail_triggered",
                    output=response,
                    reason=check_result.reason
                )
                return self.create_safety_response(check_result.reason)

        response = self.output_filter.filter(response)

        return response

    def create_safety_response(self, reason):
        return {
            "type": "safety_block",
            "message": "抱歉，我无法完成这个请求。",
            "reason": reason
        }

    def log_security_event(self, event_type, **kwargs):
        print(f"[SECURITY] {event_type}: {kwargs}")


class InputValidator:
    """输入验证器"""

    def validate(self, text):
        if not text or len(text.strip()) == 0:
            return False, "输入不能为空"

        if len(text) > 10000:
            return False, "输入长度超过限制"

        if self.contains_executable_content(text):
            return False, "输入包含可疑的可执行内容"

        return True, None

    def contains_executable_content(self, text):
        suspicious_patterns = [
            "javascript:",
            "data:text/html",
            "<script>",
        ]
        return any(pattern in text.lower() for pattern in suspicious_patterns)


class Guardrail:
    """安全护栏"""

    def check_input(self, text):
        raise NotImplementedError

    def check_output(self, text):
        raise NotImplementedError


class ContentFilterGuardrail(Guardrail):
    """内容过滤护栏"""

    def __init__(self, blocked_topics, banned_words):
        self.blocked_topics = blocked_topics
        self.banned_words = banned_words

    def check_input(self, text):
        for topic in self.blocked_topics:
            if topic in text.lower():
                return CheckResult(is_safe=False, reason=f"涉及敏感话题：{topic}")

        for word in self.banned_words:
            if word in text.lower():
                return CheckResult(is_safe=False, reason="包含不当词汇")

        return CheckResult(is_safe=True)

    def check_output(self, text):
        return self.check_input(text)


class CheckResult:
    """检查结果"""

    def __init__(self, is_safe, reason=None):
        self.is_safe = is_safe
        self.reason = reason
```

> **重要提醒**：安全是一个持续的过程，没有万无一失的方案。需要持续监控、更新和改进安全策略。

---

## 可观测性

生产环境中的 Agent 需要完善的监控体系。可观测性帮助我们了解 Agent 的行为，排查问题，优化性能。

### 三大支柱

- **日志（Logging）**：记录所有关键事件和决策
- **Tracing**：追踪请求在系统中的完整流转路径
- **指标（Metrics）**：收集性能和质量指标

### 代码实现

```python
import logging
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.resources import Resource

logger = logging.getLogger(__name__)

tracer_provider = TracerProvider()
trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer(__name__)


class ObservableAgent:
    """
    可观测 Agent
    集成日志、追踪和指标收集
    """

    def __init__(self, agent, metrics_collector):
        self.agent = agent
        self.metrics = metrics_collector

    def process(self, user_input):
        """处理请求，包含完整的可观测性支持"""
        with tracer.start_as_current_span("agent_process") as span:
            span.set_attribute("user.input.length", len(user_input))
            span.set_attribute("user.input.preview", user_input[:100])

            logger.info(f"开始处理请求: {user_input[:50]}...")
            start_time = time.time()

            try:
                result = self.agent.process(user_input)

                duration = time.time() - start_time
                span.set_attribute("success", True)
                span.set_attribute("duration_ms", duration * 1000)
                span.set_attribute("result.length", len(str(result)))

                self.metrics.record("request_duration", duration)
                self.metrics.increment("request_success")

                logger.info(f"请求完成，耗时: {duration:.2f}s")

                return result

            except Exception as e:
                duration = time.time() - start_time
                span.set_attribute("success", False)
                span.set_attribute("error.type", type(e).__name__)
                span.set_attribute("error.message", str(e))
                span.record_exception(e)

                self.metrics.increment("request_error")
                self.metrics.record("error_duration", duration)

                logger.error(f"请求失败: {e}")

                raise


class MetricsCollector:
    """指标收集器"""

    def __init__(self):
        self.metrics = {}

    def increment(self, name, value=1):
        if name not in self.metrics:
            self.metrics[name] = {"type": "counter", "value": 0}
        self.metrics[name]["value"] += value

    def record(self, name, value):
        if name not in self.metrics:
            self.metrics[name] = {"type": "gauge", "values": []}
        self.metrics[name]["values"].append(value)

    def get_summary(self):
        summary = {}
        for name, data in self.metrics.items():
            if data["type"] == "counter":
                summary[name] = data["value"]
            else:
                values = data["values"]
                summary[f"{name}_avg"] = sum(values) / len(values)
                summary[f"{name}_max"] = max(values)
                summary[f"{name}_min"] = min(values)
        return summary
```

---

## 护栏与人机协同

### Guardrails

Guardrails 是实时的输入输出过滤和限制机制。区别于安全护栏，Guardrails 更侧重于确保输出质量和合规性。

### HITL（Human-in-the-Loop）

HITL 在关键决策点引入人工审核，适用于 AI 不能自主决策的高风险场景。

```python
class HITLAgent:
    """
    人机协同 Agent
    在关键决策点引入人工审核
    """

    def __init__(self, agent, approval_queue, notification_handler):
        self.agent = agent
        self.approval_queue = approval_queue
        self.notification_handler = notification_handler

    def process(self, request):
        """处理请求，必要时触发人工审批"""
        risk_level = self.assess_risk(request)

        if risk_level == "high":
            return self.handle_high_risk_request(request)
        elif risk_level == "medium":
            return self.handle_medium_risk_request(request)
        else:
            return self.agent.process(request)

    def assess_risk(self, request):
        """评估请求风险等级"""
        sensitive_operations = [
            "delete", "remove", "cancel",
            "transfer", "payment", "refund"
        ]

        content_lower = request.lower()
        for op in sensitive_operations:
            if op in content_lower:
                return "high"

        if len(request) > 1000:
            return "medium"

        return "low"

    def handle_high_risk_request(self, request):
        """处理高风险请求，需要人工审批"""
        task_id = self.approval_queue.add({
            "request": request,
            "risk_level": "high",
            "timestamp": datetime.now()
        })

        self.notification_handler.notify_approver(
            task_id=task_id,
            message=f"有高风险请求需要审批: {request[:100]}..."
        )

        return {
            "status": "pending_approval",
            "task_id": task_id,
            "message": "您的请求需要人工审批，请等待。"
        }

    def handle_feedback(self, task_id, approved, feedback=None):
        """处理审批反馈"""
        task = self.approval_queue.get(task_id)

        if approved:
            self.approval_queue.complete(task_id)
            result = self.agent.process(task["request"])

            self.notification_handler.notify_requester(
                task_id=task_id,
                status="approved",
                result=result
            )

            return result
        else:
            self.approval_queue.reject(task_id, feedback)

            self.notification_handler.notify_requester(
                task_id=task_id,
                status="rejected",
                feedback=feedback
            )

            return {
                "status": "rejected",
                "reason": feedback or "审批未通过"
            }


class ApprovalQueue:
    """审批队列"""

    def __init__(self):
        self.queue = {}
        self.counter = 0

    def add(self, task):
        self.counter += 1
        task_id = f"task_{self.counter}"
        self.queue[task_id] = {**task, "status": "pending"}
        return task_id

    def get(self, task_id):
        return self.queue.get(task_id)

    def complete(self, task_id):
        self.queue[task_id]["status"] = "approved"

    def reject(self, task_id, reason):
        self.queue[task_id]["status"] = "rejected"
        self.queue[task_id]["reject_reason"] = reason
```

---

## 章节小结

本章介绍了 Agent 的评估、安全和对齐知识：

- **评测体系**：通过多维度指标评估 Agent 的性能
- **安全威胁**：包括提示注入、越狱、数据污染等
- **防护策略**：通过多层安全检查保障系统安全
- **可观测性**：通过日志、追踪、指标实现系统监控
- **Guardrails 和 HITL**：提供输出质量控制和人工审核能力

评估、安全和对齐是构建可信 Agent 系统的基础，需要在实际开发中持续关注和改进。
