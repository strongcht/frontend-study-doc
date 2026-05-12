# 记忆系统设计

## 概述

AI Agent 的记忆系统设计借鉴了人类记忆的工作方式，分为短期记忆和长期记忆两大组件。

---

## 短期记忆：Agent 的工作记忆

短期记忆是 Agent 的"工作台"，存储当前对话上下文和临时信息。

**特点：**

- **容量有限** — 通常最近 10-20 轮对话
- **访问速度快** — 快速读写
- **临时性** — 对话结束后清除或压缩
- **上下文依赖** — 直接影响当前回复生成

**主要用途**：维持对话连贯性、存储任务中间结果、记住当前对话中的用户偏好。

### ShortTermMemory 实现

```python
class ShortTermMemory:
    """短期记忆实现"""

    def __init__(self, max_turns=10):
        self.max_turns = max_turns
        self.conversation_history = []
        self.temporary_data = {}

    def add_message(self, role, content):
        message = {"role": role, "content": content, "timestamp": time.time()}
        self.conversation_history.append(message)
        if len(self.conversation_history) > self.max_turns:
            self.conversation_history.pop(0)

    def get_context(self):
        return self.conversation_history[-self.max_turns:]

    def store_temp(self, key, value):
        self.temporary_data[key] = value

    def get_temp(self, key, default=None):
        return self.temporary_data.get(key, default)

    def clear_temp(self):
        self.temporary_data.clear()
```

---

## 长期记忆：Agent 的知识库

长期记忆是 Agent 的"档案室"，存储需要持久化的重要信息。

**特点：**

- **容量大** — 可存储海量信息
- **持久性** — 信息长期保留，不会自动清除
- **检索式访问** — 通过查询访问信息，而非顺序读取
- **结构化存储** — 组织有序，便于高效检索

**主要用途**：存储用户个人信息/偏好、积累知识和经验、记住重要对话、保存任务执行结果。

### LongTermMemory 实现

```python
class LongTermMemory:
    """长期记忆基类"""

    def __init__(self):
        self.memories = []

    def add_memory(self, content, metadata=None):
        memory = {
            "id": str(uuid.uuid4()),
            "content": content,
            "metadata": metadata or {},
            "timestamp": time.time(),
            "importance": 0.5
        }
        self.memories.append(memory)
        return memory["id"]

    def search_memories(self, query, limit=5):
        raise NotImplementedError

    def get_memory(self, memory_id):
        for memory in self.memories:
            if memory["id"] == memory_id:
                return memory
        return None

    def delete_memory(self, memory_id):
        self.memories = [m for m in self.memories if m["id"] != memory_id]
```

---

## 短期记忆 vs 长期记忆 对比

| 特性 | 短期记忆 | 长期记忆 |
|------|---------|---------|
| **容量** | 小（KB 级别） | 大（GB+） |
| **持久性** | 临时（对话级别） | 持久（长期） |
| **访问方式** | 顺序访问 | 检索式访问 |
| **速度** | 快 | 相对较慢 |
| **主要用途** | 对话上下文 | 知识积累 |
| **实现复杂度** | 简单 | 复杂 |

完整的记忆系统通常包含短期记忆和长期记忆协同工作。

---

## 对话历史管理

### 挑战

- **上下文长度限制** — 大多数 LLM 有固定的 token 限制（4K、8K、16K、32K 等）
- **信息重要性不均** — 并非所有历史都同等重要
- **相关性随时间变化** — 更近期的对话通常更相关
- **累积成本** — 更长的上下文意味着更高的 API 成本

### ConversationManager 实现

```python
class ConversationManager:
    """对话管理器"""

    def __init__(self, max_context_length=4000):
        self.max_context_length = max_context_length
        self.history = []
        self.active_context = []

    def add_exchange(self, user_input, assistant_response):
        self.history.append({
            "user": user_input,
            "assistant": assistant_response,
            "timestamp": time.time()
        })

    def build_context(self, current_query, include_history=True):
        if not include_history or not self.history:
            return [{"role": "user", "content": current_query}]

        context = []
        context_length = self.estimate_tokens(current_query)
        context.insert(0, {"role": "user", "content": current_query})

        for exchange in reversed(self.history):
            user_tokens = self.estimate_tokens(exchange["user"])
            assistant_tokens = self.estimate_tokens(exchange["assistant"])
            if context_length + user_tokens + assistant_tokens > self.max_context_length:
                break
            context.insert(0, {"role": "assistant", "content": exchange["assistant"]})
            context.insert(0, {"role": "user", "content": exchange["user"]})
            context_length += user_tokens + assistant_tokens

        return context

    def estimate_tokens(self, text):
        if self.is_chinese(text):
            return len(text) // 2
        else:
            words = len(text.split())
            return int(words * 1.3)

    def is_chinese(self, text):
        chinese_chars = sum(1 for c in text if '一' <= c <= '鿿')
        return chinese_chars / max(len(text), 1) > 0.3

    def clear_history(self):
        self.history.clear()
        self.active_context.clear()
```

### 智能历史选择策略

#### 策略 1：基于时间衰减

为更近期的对话分配更高权重。使用 1 小时窗口的线性衰减函数 — 1 小时内的对话获得完全保留，之后分数衰减。

```python
def time_based_selection(history, current_time, max_items=10):
    scored_items = []
    for item in history:
        time_diff = current_time - item["timestamp"]
        time_score = max(0, 1 - time_diff / 3600)
        scored_items.append((time_score, item))
    scored_items.sort(key=lambda x: x[0], reverse=True)
    return [item for score, item in scored_items[:max_items]]
```

#### 策略 2：基于相关性选择

使用嵌入向量和余弦相似度，找到与当前查询在语义上相关的历史对话。

```python
def relevance_based_selection(history, current_query, embedding_model, max_items=5):
    if not history:
        return []
    query_embedding = embedding_model.encode(current_query)
    scored_items = []
    for item in history:
        content = item["user"] + " " + item["assistant"]
        content_embedding = embedding_model.encode(content)
        similarity = cosine_similarity([query_embedding], [content_embedding])[0][0]
        scored_items.append((similarity, item))
    scored_items.sort(key=lambda x: x[0], reverse=True)
    return [item for similarity, item in scored_items[:max_items]]
```

#### 策略 3：混合选择（SmartHistorySelector）

组合多种策略：

1. 始终包含最近一轮对话
2. 使用嵌入向量按相关性选择
3. 按时间顺序填充剩余空间
4. 最终按时间顺序排列

```python
class SmartHistorySelector:
    """智能历史选择器"""

    def __init__(self, embedding_model=None):
        self.embedding_model = embedding_model

    def select_history(self, history, current_query, max_context_length=3000):
        selected = []
        current_length = 0

        # 始终包含最近一轮
        if history:
            recent = history[-1]
            recent_length = self.estimate_length(recent)
            if recent_length <= max_context_length:
                selected.append(recent)
                current_length += recent_length

        # 基于相关性选择
        if self.embedding_model and len(history) > 1:
            relevant = self.select_by_relevance(history[:-1], current_query, 3)
            for item in relevant:
                item_length = self.estimate_length(item)
                if current_length + item_length <= max_context_length:
                    selected.append(item)
                    current_length += item_length

        # 按时间顺序填充剩余空间
        remaining_space = max_context_length - current_length
        if remaining_space > 100:
            for item in history:
                if item not in selected:
                    item_length = self.estimate_length(item)
                    if item_length <= remaining_space:
                        selected.append(item)
                        remaining_space -= item_length

        selected.sort(key=lambda x: x["timestamp"])
        return selected

    def select_by_relevance(self, history, query, max_items):
        query_lower = query.lower()
        scored = []
        for item in history:
            content = (item["user"] + " " + item["assistant"]).lower()
            score = sum(1 for word in query_lower.split() if word in content)
            scored.append((score, item))
        scored.sort(key=lambda x: x[0], reverse=True)
        return [item for score, item in scored[:max_items]]

    def estimate_length(self, exchange):
        return len(exchange["user"]) + len(exchange["assistant"])
```

### 对话历史压缩

当历史过长时，可以在保留核心信息的同时进行压缩：

```python
class HistoryCompressor:
    """对话历史压缩器"""

    def __init__(self, llm_client):
        self.llm = llm_client

    def compress_conversation(self, conversation_history, max_summary_length=500):
        if len(conversation_history) <= 2:
            return conversation_history

        conversation_text = self.history_to_text(conversation_history)

        prompt = f"""
请将以下对话历史压缩为一个简短的摘要，保留核心信息和重要细节：

对话历史：
{conversation_text}

摘要要求：
1. 不超过{max_summary_length}字
2. 保留用户的主要需求和助理的关键回答
3. 忽略问候语、重复内容和无关细节

摘要：
"""
        summary = self.llm.generate(prompt, max_tokens=max_summary_length)

        compressed_history = [
            {"role": "system", "content": f"之前的对话摘要：{summary}"}
        ]
        for exchange in conversation_history[-2:]:
            compressed_history.append({
                "role": "user" if exchange["role"] == "user" else "assistant",
                "content": exchange["content"]
            })

        return compressed_history

    def history_to_text(self, history):
        lines = []
        for exchange in history:
            role = "用户" if exchange["role"] == "user" else "助理"
            lines.append(f"{role}: {exchange['content']}")
        return "\n".join(lines)
```

---

## 向量数据库应用

向量数据库是长期记忆的核心技术，实现基于语义相似度的检索。

### 工作原理

- **文本 → 向量**：嵌入模型将文本转换为高维向量
- **相似度 → 距离**：相似文本产生相近向量，可通过向量距离衡量
- **检索 → 最近邻搜索**：找到与查询向量最相似的向量

### 安装依赖

```bash
pip install sentence-transformers  # 用于生成嵌入向量
pip install chromadb               # 轻量级向量数据库
```

### VectorMemory 实现

```python
import chromadb
from sentence_transformers import SentenceTransformer
import uuid
import time

class VectorMemory:
    """基于向量数据库的记忆系统"""

    def __init__(self, persist_directory="./memory_db"):
        self.embedding_model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(
            name="agent_memories",
            metadata={"description": "AI Agent 的长期记忆"}
        )

    def add_memory(self, content, metadata=None, importance=0.5):
        embedding = self.embedding_model.encode(content).tolist()
        full_metadata = {
            "timestamp": time.time(),
            "importance": importance,
            "content_length": len(content)
        }
        if metadata:
            full_metadata.update(metadata)
        memory_id = str(uuid.uuid4())
        self.collection.add(
            documents=[content],
            embeddings=[embedding],
            metadatas=[full_metadata],
            ids=[memory_id]
        )
        return memory_id

    def search_memories(self, query, n_results=5, min_similarity=0.3):
        query_embedding = self.embedding_model.encode(query).tolist()
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        memories = []
        if results["documents"]:
            for i in range(len(results["documents"][0])):
                similarity = 1 - results["distances"][0][i]
                if similarity >= min_similarity:
                    memory = {
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "similarity": similarity,
                        "id": results["ids"][0][i]
                    }
                    memories.append(memory)
        memories.sort(key=lambda x: x["similarity"], reverse=True)
        return memories

    def get_relevant_context(self, query, max_memories=3):
        memories = self.search_memories(query, n_results=max_memories)
        if not memories:
            return ""
        context_parts = []
        for i, memory in enumerate(memories):
            content = memory["content"]
            similarity = memory["similarity"]
            timestamp = memory["metadata"]["timestamp"]
            time_str = time.strftime("%Y-%m-%d %H:%M", time.localtime(timestamp))
            context_parts.append(
                f"[相关记忆 {i+1}，相似度：{similarity:.2f}，时间：{time_str}]\n{content}"
            )
        return "\n\n".join(context_parts)

    def delete_memory(self, memory_id):
        self.collection.delete(ids=[memory_id])

    def get_all_memories(self, limit=100):
        results = self.collection.query(
            query_embeddings=[self.embedding_model.encode(" ").tolist()],
            n_results=limit
        )
        memories = []
        if results["documents"]:
            for i in range(len(results["documents"][0])):
                memory = {
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "id": results["ids"][0][i]
                }
                memories.append(memory)
        memories.sort(key=lambda x: x["metadata"]["timestamp"], reverse=True)
        return memories
```

### AgentWithMemory — 完整示例

```python
class AgentWithMemory:
    """带有记忆系统的AI Agent"""

    def __init__(self, llm_client):
        self.llm = llm_client
        self.short_term_memory = ShortTermMemory(max_turns=10)
        self.long_term_memory = VectorMemory()

    def process_query(self, user_query):
        relevant_context = self.long_term_memory.get_relevant_context(user_query)
        short_term_context = self.short_term_memory.get_context()

        system_message = "你是一个有帮助的AI助手。"
        if relevant_context:
            system_message += f"\n\n相关背景信息：\n{relevant_context}"

        messages = [{"role": "system", "content": system_message}]
        messages.extend(short_term_context)
        messages.append({"role": "user", "content": user_query})

        response = self.llm.chat_completion(messages)

        self.short_term_memory.add_message("user", user_query)
        self.short_term_memory.add_message("assistant", response)

        if self.should_save_to_long_term(user_query, response):
            self.save_to_long_term(user_query, response)

        return response

    def should_save_to_long_term(self, user_query, response):
        important_keywords = ["偏好", "喜欢", "不喜欢", "重要", "记住", "下次", "经常"]
        query_lower = user_query.lower()
        response_lower = response.lower()
        for keyword in important_keywords:
            if keyword in query_lower or keyword in response_lower:
                return True
        personal_keywords = ["我叫", "我是", "我住在", "我的电话", "我的邮箱"]
        for keyword in personal_keywords:
            if keyword in query_lower:
                return True
        return False

    def save_to_long_term(self, user_query, response):
        memory_content = f"用户：{user_query}\n助理：{response}"
        metadata = {
            "type": "conversation",
            "user_query": user_query[:100],
            "response_length": len(response)
        }
        self.long_term_memory.add_memory(memory_content, metadata)
```

### 向量数据库优化技巧

**嵌入模型选择：**

| 模型 | 适用场景 |
|------|---------|
| `paraphrase-multilingual-MiniLM-L12-v2` | 多语言场景 |
| `all-MiniLM-L6-v2` | 英文优化 |
| `text-embedding-ada-002` (OpenAI) | 高质量需求 |

**元数据过滤** 提升检索精度：

```python
results = collection.query(
    query_embeddings=[query_embedding],
    n_results=5,
    where={"type": "personal_preference"},
    where_document={"$contains": "编程"}
)
```

**混合搜索** 结合向量和关键词搜索：

```python
def hybrid_search(query, vector_memory, keyword_weight=0.3):
    vector_results = vector_memory.search_memories(query, n_results=10)
    keyword_results = []
    query_words = set(query.lower().split())
    all_memories = vector_memory.get_all_memories(limit=100)
    for memory in all_memories:
        content_words = set(memory["content"].lower().split())
        common_words = query_words & content_words
        keyword_score = len(common_words) / max(len(query_words), 1)
        if keyword_score > 0:
            memory["keyword_score"] = keyword_score
            keyword_results.append(memory)

    all_results = {}
    for result in vector_results:
        result_id = result["id"]
        all_results[result_id] = {
            "vector_score": result["similarity"],
            "keyword_score": 0,
            "content": result["content"],
            "metadata": result["metadata"]
        }
    for result in keyword_results:
        result_id = result["id"]
        if result_id in all_results:
            all_results[result_id]["keyword_score"] = result["keyword_score"]
        else:
            all_results[result_id] = {
                "vector_score": 0,
                "keyword_score": result["keyword_score"],
                "content": result["content"],
                "metadata": result["metadata"]
            }

    final_results = []
    for result_id, result in all_results.items():
        combined_score = (
            (1 - keyword_weight) * result["vector_score"] +
            keyword_weight * result["keyword_score"]
        )
        result["combined_score"] = combined_score
        final_results.append(result)
    final_results.sort(key=lambda x: x["combined_score"], reverse=True)
    return final_results[:5]
```

---

## 记忆压缩与总结策略

### 为什么要压缩记忆？

- 节省存储空间
- 提高检索效率
- 提取核心信息，去除冗余
- 降低计算成本

### 策略 1：基于重要性的压缩

```python
class ImportanceBasedCompressor:
    """基于重要性的记忆压缩器"""

    def __init__(self, llm_client):
        self.llm = llm_client

    def compress_memories(self, memories, target_ratio=0.5):
        if len(memories) <= 1:
            return memories
        scored_memories = []
        for memory in memories:
            importance = self.evaluate_importance(memory)
            scored_memories.append((importance, memory))
        scored_memories.sort(key=lambda x: x[0], reverse=True)
        keep_count = max(1, int(len(memories) * target_ratio))
        return [memory for _, memory in scored_memories[:keep_count]]

    def evaluate_importance(self, memory):
        content = memory["content"]
        metadata = memory.get("metadata", {})
        importance_score = 0.0

        # 按类型评分
        memory_type = metadata.get("type", "")
        if memory_type == "personal_info":
            importance_score += 0.8
        elif memory_type == "preference":
            importance_score += 0.7
        elif memory_type == "fact":
            importance_score += 0.5
        elif memory_type == "conversation":
            importance_score += 0.3

        # 按长度评分
        content_length = len(content)
        if 50 <= content_length <= 500:
            importance_score += 0.2
        elif content_length > 500:
            importance_score += 0.1

        # 时间衰减
        timestamp = metadata.get("timestamp", 0)
        if timestamp > 0:
            age_days = (time.time() - timestamp) / (24 * 3600)
            recency_score = max(0, 1 - age_days / 30)
            importance_score += recency_score * 0.5

        # 显式重要性
        explicit_importance = metadata.get("importance", 0.5)
        importance_score += explicit_importance * 0.5

        return min(importance_score, 1.0)
```

### 策略 2：基于聚类的压缩

通过 K-means 聚类将相似记忆分组，然后对每个聚类进行摘要。

```python
from sklearn.cluster import KMeans
import numpy as np

class ClusterBasedCompressor:
    """基于聚类的记忆压缩器"""

    def __init__(self, embedding_model):
        self.embedding_model = embedding_model

    def compress_by_clustering(self, memories, n_clusters=None):
        if len(memories) <= 3:
            return memories
        if n_clusters is None:
            n_clusters = min(3, len(memories) // 2)

        embeddings = []
        for memory in memories:
            embedding = self.embedding_model.encode(memory["content"])
            embeddings.append(embedding)
        embeddings = np.array(embeddings)

        kmeans = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)
        labels = kmeans.fit_predict(embeddings)

        compressed_memories = []
        for cluster_id in range(n_clusters):
            cluster_memories = [
                memories[i] for i in range(len(memories)) if labels[i] == cluster_id
            ]
            if cluster_memories:
                summary = self.summarize_cluster(cluster_memories)
                compressed_memories.append(summary)
        return compressed_memories

    def summarize_cluster(self, cluster_memories):
        if len(cluster_memories) == 1:
            return cluster_memories[0]
        all_content = "\n".join([m["content"] for m in cluster_memories])
        summary_content = f"相关主题的{len(cluster_memories)}条记忆摘要：{all_content[:500]}..."
        merged_metadata = {
            "type": "cluster_summary",
            "original_count": len(cluster_memories),
            "compressed": True,
            "timestamp": time.time()
        }
        return {"content": summary_content, "metadata": merged_metadata}
```

### 策略 3：增量总结

在对话过程中逐步总结，而非一次性处理所有历史。

```python
class IncrementalSummarizer:
    """增量总结器"""

    def __init__(self, llm_client, summary_interval=5):
        self.llm = llm_client
        self.summary_interval = summary_interval
        self.conversation_buffer = []
        self.summaries = []

    def add_conversation(self, user_input, assistant_response):
        self.conversation_buffer.append({
            "user": user_input,
            "assistant": assistant_response,
            "timestamp": time.time()
        })
        if len(self.conversation_buffer) >= self.summary_interval:
            self.create_summary()

    def create_summary(self):
        if not self.conversation_buffer:
            return
        conversation_text = ""
        for exchange in self.conversation_buffer:
            conversation_text += f"用户: {exchange['user']}\n"
            conversation_text += f"助理: {exchange['assistant']}\n\n"

        prompt = f"""
请将以下对话内容总结为一个简短的段落，保留核心信息和重要细节：

对话内容：
{conversation_text}

总结要求：
1. 不超过200字
2. 保留用户的主要需求和助理的关键回答
3. 忽略问候语、重复内容和无关细节

总结：
"""
        summary = self.llm.generate(prompt, max_tokens=200)
        self.summaries.append({
            "content": summary,
            "timestamp": time.time(),
            "original_count": len(self.conversation_buffer)
        })
        self.conversation_buffer.clear()

    def get_context(self, include_recent=True, include_summaries=True):
        context_parts = []
        if include_summaries and self.summaries:
            for i, summary in enumerate(self.summaries[-3:]):
                context_parts.append(f"[对话总结 {i+1}]\n{summary['content']}")
        if include_recent and self.conversation_buffer:
            for exchange in self.conversation_buffer[-3:]:
                context_parts.append(f"用户: {exchange['user']}")
                context_parts.append(f"助理: {exchange['assistant']}")
        return "\n\n".join(context_parts)
```

---

## 记忆生命周期管理

完整的记忆系统通过三个阶段管理记忆的整个生命周期，由 `MemoryLifecycleManager` 处理：

```python
class MemoryLifecycleManager:
    """记忆生命周期管理器"""

    def __init__(self):
        self.short_term = ShortTermMemory()
        self.long_term = VectorMemory()
        self.compressor = ImportanceBasedCompressor()

    def process_memory(self, content, initial_importance=0.5):
        self.short_term.store_temp("recent_memory", content)
        evaluated_importance = self.evaluate_importance(content, initial_importance)

        if evaluated_importance >= 0.8:
            self.long_term.add_memory(content, {"importance": evaluated_importance})
        elif evaluated_importance >= 0.5:
            self.queue_for_review(content, evaluated_importance)
        # 低重要性：仅保存在短期记忆中

    def evaluate_importance(self, content, initial_importance):
        return initial_importance

    def queue_for_review(self, content, importance):
        pass  # 实现队列逻辑

    def periodic_maintenance(self):
        all_memories = self.long_term.get_all_memories(limit=1000)
        if len(all_memories) > 100:
            compressed = self.compressor.compress_memories(all_memories, target_ratio=0.7)
        self.cleanup_old_memories()

    def cleanup_old_memories(self, max_age_days=30, min_importance=0.3):
        all_memories = self.long_term.get_all_memories(limit=1000)
        current_time = time.time()
        for memory in all_memories:
            metadata = memory.get("metadata", {})
            timestamp = metadata.get("timestamp", 0)
            importance = metadata.get("importance", 0.5)
            age_days = (current_time - timestamp) / (24 * 3600)
            if age_days > max_age_days and importance < min_importance:
                self.long_term.delete_memory(memory["id"])
```

### 新记忆的决策逻辑

| 重要性等级 | 处理方式 |
|-----------|---------|
| **高（>=0.8）** | 立即存入长期记忆 |
| **中（>=0.5）** | 排队等待审核 |
| **低（<0.5）** | 仅保存在短期记忆中，后续清理 |

定期维护在长期记忆超过 100 条时进行压缩，并清理超过 30 天且重要性低于 0.3 的旧记忆。
