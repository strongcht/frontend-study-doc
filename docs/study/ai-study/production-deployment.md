# AI Agent 生产部署与工程化

生产部署涉及可靠性、可扩展性和成本控制。工程化实践确保系统稳定运行并易于维护。

---

## 生产部署架构

生产环境对系统提出了更高的要求，需要考虑可靠性、可扩展性、监控告警等方面。

### 部署模式

#### 单机部署

适合开发测试环境，部署简单，但无法承受生产级流量。

#### 分布式部署

适合生产环境，需要考虑多个方面：

- **负载均衡**：分发请求到多个实例
- **服务发现**：动态管理实例列表
- **状态管理**：处理分布式状态一致性问题
- **容错处理**：单点故障不影响整体服务

### 容器化部署

**Dockerfile 示例**

```dockerfile
# 基于 Python 3.11 镜像
FROM python:3.11-slim

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 创建非 root 用户（安全考虑）
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python", "agent.py"]
```

### Kubernetes 部署

**Kubernetes Deployment 配置**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-agent
  labels:
    app: ai-agent
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ai-agent
  template:
    metadata:
      labels:
        app: ai-agent
    spec:
      containers:
      - name: agent
        image: your-registry/ai-agent:latest
        ports:
        - containerPort: 8000
        resources:
          limits:
            memory: "2Gi"
            cpu: "1"
          requests:
            memory: "1Gi"
            cpu: "0.5"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: ai-agent-service
spec:
  selector:
    app: ai-agent
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## 成本控制

Agent 系统的成本主要来自 LLM API 调用。优化成本是生产部署中的重要课题。

### Token 优化策略

- **提示词压缩**：精简提示词，减少不必要的文字
- **上下文截断**：只保留关键的上下文内容
- **缓存响应**：对相同或相似查询缓存响应

### 成本优化 Agent 实现

```python
import hashlib
import json
from functools import lru_cache


class CostOptimizedAgent:
    """
    成本优化的 Agent
    通过缓存和压缩减少 API 调用成本
    """

    def __init__(self, base_agent, cache, embedder=None):
        self.base_agent = base_agent
        self.cache = cache
        self.embedder = embedder

    def process(self, request):
        """处理请求，包含成本优化逻辑"""
        request_fingerprint = self.generate_fingerprint(request)

        # 检查精确缓存
        cached_result = self.cache.get(request_fingerprint)
        if cached_result:
            return {**cached_result, "from_cache": True}

        # 如果有嵌入器，检查语义相似缓存
        if self.embedder:
            similar = self.find_similar_cached(request)
            if similar:
                return {
                    **similar,
                    "from_cache": True,
                    "similar_to": similar.get("request_id")
                }

        # 执行请求
        result = self.base_agent.process(request)

        # 缓存结果
        self.cache.set(request_fingerprint, result, ttl=3600)

        return {**result, "from_cache": False}

    def generate_fingerprint(self, request):
        """生成请求指纹"""
        content = json.dumps(request, sort_keys=True)
        return hashlib.sha256(content.encode()).hexdigest()

    def find_similar_cached(self, request, threshold=0.95):
        """查找语义相似的缓存结果"""
        if not self.embedder:
            return None

        request_vector = self.embedder.embed([str(request)])[0]

        best_match = None
        best_similarity = 0

        for cached in self.cache.get_all():
            cached_vector = cached["vector"]
            similarity = cosine_similarity(request_vector, cached_vector)

            if similarity > best_similarity and similarity >= threshold:
                best_similarity = similarity
                best_match = cached

        return best_match


class ResponseCache:
    """
    响应缓存
    简单的内存缓存实现，生产环境可使用 Redis
    """

    def __init__(self):
        self.cache = {}
        self.timestamps = {}

    def get(self, key):
        if key in self.cache:
            if self.is_expired(key):
                self.delete(key)
                return None
            return self.cache[key]
        return None

    def set(self, key, value, ttl=3600):
        self.cache[key] = value
        self.timestamps[key] = time.time() + ttl

    def delete(self, key):
        if key in self.cache:
            del self.cache[key]
        if key in self.timestamps:
            del self.timestamps[key]

    def is_expired(self, key):
        if key not in self.timestamps:
            return True
        return time.time() > self.timestamps[key]

    def get_all(self):
        return list(self.cache.values())


def cosine_similarity(vec1, vec2):
    """计算余弦相似度"""
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))
    return dot_product / (norm1 * norm2)
```

---

## 流式与异步

### 流式响应

流式响应减少等待时间，提升用户体验。不需要等待完整响应，可以在生成过程中逐步展示内容。

### 流式响应 Agent

```python
import asyncio


class StreamingAgent:
    """
    支持流式响应的 Agent
    边生成边返回，减少等待时间
    """

    def __init__(self, llm):
        self.llm = llm

    async def stream_generate(self, prompt):
        """
        流式生成响应
        使用 async generator 模式
        """
        async for chunk in self.llm.stream_generate(prompt):
            yield chunk

    async def process_stream(self, request):
        """处理流式请求"""
        prompt = self.build_prompt(request)

        async def generate():
            async for chunk in self.stream_generate(prompt):
                yield chunk

        return generate()


# 使用示例
async def main():
    agent = StreamingAgent(llm)

    async for token in agent.stream_generate("解释量子计算"):
        print(token, end="", flush=True)
    print()


asyncio.run(main())
```

### 异步任务队列

对于长时间运行的任务，使用异步队列。用户提交任务后立即获得响应，任务在后台执行。

```python
import asyncio
from queue import Queue
from threading import Thread
import uuid


class AsyncAgent:
    """
    异步 Agent
    使用任务队列处理长时间运行的任务
    """

    def __init__(self, agent, task_queue):
        self.agent = agent
        self.task_queue = task_queue
        self.results = {}
        self.worker_thread = Thread(target=self.process_queue, daemon=True)
        self.worker_thread.start()

    async def submit(self, task):
        """提交任务，立即返回任务 ID"""
        task_id = str(uuid.uuid4())

        await self.task_queue.enqueue({
            "id": task_id,
            "task": task,
            "status": "pending",
            "created_at": time.time()
        })

        return task_id

    async def get_result(self, task_id):
        """获取任务结果，非阻塞式"""
        if task_id in self.results:
            return self.results[task_id]

        status = await self.task_queue.get_status(task_id)

        if status is None:
            return None

        if status == "pending" or status == "processing":
            return {"status": status, "result": None}

        return None

    def process_queue(self):
        """后台工作线程"""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        while True:
            task = loop.run_until_complete(self.task_queue.dequeue())

            if task:
                loop.run_until_complete(
                    self.task_queue.update_status(task["id"], "processing")
                )

                try:
                    result = self.agent.process(task["task"])

                    self.results[task["id"]] = {
                        "status": "completed",
                        "result": result,
                        "completed_at": time.time()
                    }

                    loop.run_until_complete(
                        self.task_queue.update_status(task["id"], "completed")
                    )
                except Exception as e:
                    self.results[task["id"]] = {
                        "status": "failed",
                        "error": str(e)
                    }

                    loop.run_until_complete(
                        self.task_queue.update_status(task["id"], "failed")
                    )


class TaskQueue:
    """简单的任务队列实现"""

    def __init__(self):
        self.queue = Queue()
        self.statuses = {}

    async def enqueue(self, task):
        self.queue.put(task)
        self.statuses[task["id"]] = "pending"

    async def dequeue(self):
        if not self.queue.empty():
            return self.queue.get()
        return None

    async def get_status(self, task_id):
        return self.statuses.get(task_id)

    async def update_status(self, task_id, status):
        self.statuses[task_id] = status
```

---

## 微服务化设计

将 Agent 系统拆分为多个独立的服务，可以提高可维护性和可扩展性。

### 服务划分

| 服务 | 职责 |
|------|------|
| API 网关 | 统一入口，认证限流，路由转发 |
| Agent 服务 | 核心逻辑，推理规划 |
| 工具服务 | 外部 API 集成，工具调用 |
| 存储服务 | 知识库，状态管理，缓存 |
| 监控服务 | 日志收集，指标监控，告警 |

### 服务间通信

- **同步通信**：HTTP/gRPC，用于实时请求响应
- **异步通信**：消息队列，用于耗时操作和事件通知

---

## 章节小结

本章介绍了生产部署和工程化的关键实践：

1. **生产部署架构** -- 从单机到分布式，逐步扩展
2. **容器化部署** -- 使用 Docker 和 Kubernetes
3. **成本控制** -- 通过缓存和 Token 优化降低成本
4. **流式与异步** -- 提升用户体验和系统吞吐量
5. **微服务化设计** -- 提高系统的可维护性和可扩展性

生产部署需要综合考虑可靠性、性能、成本等多方面因素，建议从小规模开始，逐步增加复杂度。
