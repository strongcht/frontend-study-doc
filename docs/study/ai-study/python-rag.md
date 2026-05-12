# Python 实现 RAG 与知识检索

本章介绍 RAG（Retrieval-Augmented Generation，检索增强生成）技术，这是构建知识密集型 Agent 的核心技术。通过将向量检索与传统生成模型结合，RAG 使 Agent 能够访问和利用外部知识。

---

## RAG 基础原理

RAG 的核心思想是将信息检索与语言生成相结合。当用户提出问题时，系统首先从知识库中检索相关信息，然后将其作为上下文来帮助生成模型产生更准确的回答。

### 为什么需要 RAG

- 语言模型有知识截止日期，无法获取最新信息
- 模型参数有限，无法记忆所有知识
- 让模型直接从参数中回忆知识可能会产生幻觉
- RAG 通过外部检索提供真实的、可更新的知识来源

### 核心架构

一个 RAG 系统包含三个主要组件：

- **检索器（Retriever）**：负责从知识库中查找相关信息
- **向量数据库（Vector Store）**：存储文档的向量表示，支持高效相似度搜索
- **生成器（Generator）**：基于检索结果和原始问题生成最终答案

### 工作流程

1. **索引阶段**：文档被切分为块，向量化后存储到向量数据库
2. **检索阶段**：当用户查询到来时，将查询向量化并执行相似度搜索
3. **增强阶段**：将检索到的相关文档与原始查询一起发送给生成模型
4. **生成阶段**：生成模型基于增强后的上下文产生最终答案

---

## 基础 RAG 实现

```python
class SimpleRAG:
    """
    简化版 RAG 系统实现
    包含三个核心组件：嵌入器、向量存储、生成器
    """

    def __init__(self, embedder, vector_store, generator):
        # 嵌入器：将文本转为向量
        self.embedder = embedder
        # 向量数据库：存储和检索向量
        self.vector_store = vector_store
        # 生成器：基于上下文生成回答
        self.generator = generator

    def add_documents(self, documents):
        """
        添加文档到知识库
        :param documents: 文档列表
        """
        # 将文档切分为小块
        chunks = self.chunk_documents(documents)

        # 将文本块向量化
        embeddings = self.embedder.embed(chunks)

        # 存储到向量数据库
        self.vector_store.add(embeddings, chunks)

    def chunk_documents(self, documents, chunk_size=500, overlap=50):
        """
        文档切分
        :param documents: 原始文档列表
        :param chunk_size: 每个块的字符数
        :param overlap: 块之间的重叠字符数
        :return: 文本块列表
        """
        chunks = []
        for doc in documents:
            # 按指定大小切分，保留重叠
            for i in range(0, len(doc), chunk_size - overlap):
                chunk = doc[i:i + chunk_size]
                chunks.append(chunk)
        return chunks

    def query(self, question, top_k=5):
        """
        处理用户查询
        :param question: 用户问题
        :param top_k: 检索的 top-k 结果
        :return: 生成的回答
        """
        # 1. 将问题向量化
        question_embedding = self.embedder.embed([question])[0]

        # 2. 在向量数据库中检索相似文档
        results = self.vector_store.search(question_embedding, top_k)

        # 3. 构建上下文
        context = "\n".join([doc for doc, _ in results])

        # 4. 构建生成提示
        prompt = f"基于以下内容回答问题：\n{context}\n\n问题：{question}"

        # 5. 生成回答
        return self.generator.generate(prompt)
```

---

## Advanced RAG

基础 RAG 存在检索质量差、上下文不连贯等问题。Advanced RAG 使用多种技术手段来优化检索和生成效果。

### 重排序（Reranking）

初始检索后，使用交叉编码器对结果进行更精确的排序。重排序能更好地理解查询与文档之间的语义匹配。

#### 带重排序的 RAG

```python
class AdvancedRAG:
    """
    高级 RAG 系统
    增加重排序、混合检索等优化
    """

    def __init__(self, embedder, vector_store, reranker, generator):
        # 嵌入器
        self.embedder = embedder
        # 向量数据库
        self.vector_store = vector_store
        # 重排序模型（交叉编码器）
        self.reranker = reranker
        # 生成器
        self.generator = generator

    def query(self, question, initial_k=20, final_k=5):
        """
        处理查询，包含两阶段检索
        :param question: 用户问题
        :param initial_k: 第一阶段检索数量
        :param final_k: 最终返回数量
        """
        # ==================== 阶段1：初步检索 ====================
        # 将问题向量化
        question_embedding = self.embedder.embed([question])[0]

        # 向量相似度检索（快速但不够精确）
        initial_results = self.vector_store.search(
            question_embedding,
            initial_k
        )

        # ==================== 阶段2：重排序 ====================
        # 构建 (问题, 文档) 对
        doc_pairs = [(question, doc) for doc, _ in initial_results]

        # 使用交叉编码器进行精细排序
        reranked = self.reranker.rerank(doc_pairs)

        # 取最终 top_k 个结果
        final_context = "\n".join([doc for doc, _ in reranked[:final_k]])

        # ==================== 阶段3：生成 ====================
        prompt = f"上下文：{final_context}\n\n问题：{question}"
        return self.generator.generate(prompt)
```

### 混合检索

混合检索结合了稠密检索和稀疏检索的优势：

- **稠密检索（Dense Retrieval）**：使用向量相似度，擅长语义匹配
- **稀疏检索（如 BM25）**：基于词频统计，擅长关键词匹配

#### 混合检索 RAG

```python
class HybridRAG:
    """
    混合检索 RAG
    结合稠密检索和稀疏检索
    """

    def __init__(self, dense_retriever, sparse_retriever, fusion_fn):
        # 稠密检索器（向量检索）
        self.dense_retriever = dense_retriever
        # 稀疏检索器（BM25 等）
        self.sparse_retriever = sparse_retriever
        # 融合函数（如 RRFS）
        self.fusion_fn = fusion_fn

    def query(self, question, top_k):
        """
        执行混合检索
        """
        # ==================== 稠密检索 ====================
        # 使用向量相似度检索
        dense_results = self.dense_retriever.search(question, top_k * 2)

        # ==================== 稀疏检索 ====================
        # 使用关键词检索
        sparse_results = self.sparse_retriever.search(question, top_k * 2)

        # ==================== 结果融合 ====================
        # 使用 Reciprocal Rank Fusion 融合结果
        fused = self.fusion_fn(dense_results, sparse_results)

        # 取 top_k 个结果
        return fused[:top_k]


def reciprocal_rank_fusion(results_a, results_b, k=60):
    """
    Reciprocal Rank Fusion (RRF) 算法
    用于融合多个检索结果
    :param results_a: 检索结果 A [(doc, score), ...]
    :param results_b: 检索结果 B [(doc, score), ...]
    :param k: 融合参数，通常设为 60
    :return: 融合后的排序结果
    """
    # 为每个文档计算 RRF 分数
    scores = {}

    # 处理结果 A
    for rank, (doc, _) in enumerate(results_a):
        scores[doc] = scores.get(doc, 0) + 1 / (k + rank + 1)

    # 处理结果 B
    for rank, (doc, _) in enumerate(results_b):
        scores[doc] = scores.get(doc, 0) + 1 / (k + rank + 1)

    # 按分数排序
    sorted_docs = sorted(scores.items(), key=lambda x: -x[1])

    return sorted_docs
```

### 其他优化策略

- **查询扩展**：通过同义词或相关词扩展查询，提高召回率
- **查询改写**：理解用户真实意图，改写查询表达方式
- **上下文压缩**：减少检索结果中的冗余信息，保留关键内容

---

## 向量数据库

向量数据库是 RAG 系统的基础设施，负责存储和检索高维向量，支持大规模相似度搜索。

### 核心概念

- **嵌入（Embedding）**：将文本转换为稠密向量的过程
- **向量维度**：嵌入向量的长度，影响表示能力
- **相似度度量**：衡量向量之间相似程度的方法

### 常用相似度度量

| 度量方法 | 公式 | 特点 | 适用场景 |
|---------|------|------|---------|
| 余弦相似度 | cos(A,B) = A·B/(\|A\|\|B\|) | 衡量方向相似性，范围 [-1,1] | 文档相似度 |
| 欧氏距离 | d(A,B) = sqrt(sum((Ai-Bi)²)) | 衡量绝对距离，范围 [0,+∞) | 图像特征匹配 |
| 点积 | A·B = sum(Ai*Bi) | 结合幅度和方向 | 推荐系统 |

### 主流向量数据库对比

| 数据库 | 类型 | 特点 | 适用场景 |
|-------|------|------|---------|
| Pinecone | 云服务 | 托管服务，易用，自动扩展 | 生产环境快速部署 |
| Weaviate | 开源 | 支持混合检索（向量 + 关键词） | 需要灵活定制的场景 |
| Milvus | 开源 | 高可用，可扩展，支持万亿向量 | 超大规模向量检索 |
| Chroma | 开源 | 轻量级，易集成，开发者友好 | 原型开发和测试 |
| Qdrant | 开源 | 高性能，支持过滤，Rust 实现 | 需要高吞吐的场景 |

### 使用 Chroma 向量数据库

```python
import chroma_client
from chroma_client import ChromaClient

# 创建客户端（连接到本地或远程服务）
client = ChromaClient()

# 创建或获取集合
collection = client.get_or_create_collection("knowledge_base")

# 添加文档
collection.add(
    ids=["doc1", "doc2", "doc3"],  # 文档唯一 ID
    embeddings=[
        [0.1, 0.2, 0.3],  # 文档1的向量
        [0.4, 0.5, 0.6],  # 文档2的向量
        [0.7, 0.8, 0.9],  # 文档3的向量
    ],
    documents=[
        "人工智能是计算机科学的一个分支",
        "机器学习是人工智能的子领域",
        "深度学习是机器学习的子领域"
    ],
    metadatas=[
        {"source": "教科书"},  # 文档1的元数据
        {"source": "论文"},     # 文档2的元数据
        {"source": "论文"}      # 文档3的元数据
    ]
)

# 检索
results = collection.query(
    query_embeddings=[[0.15, 0.25, 0.35]],  # 查询向量
    n_results=2  # 返回 top-2 结果
)

# 输出结果
print(results["documents"])
print(results["distances"])  # 距离/相似度分数
```

> **注意**：选择向量数据库时需要考虑数据规模、查询延迟和部署方式。对于小规模原型开发，Chroma 是不错的选择；对于大规模生产环境，Pinecone 或 Milvus 可能更合适。

---

## GraphRAG

GraphRAG 将知识图谱与 RAG 结合，利用实体和关系图来增强检索和推理能力。

### 为什么需要 GraphRAG

- 传统 RAG 在需要多跳推理的问题上表现不佳
- 传统 RAG 不容易捕获实体间的语义关系
- GraphRAG 能够理解知识之间的结构化联系

### 核心优势

- 捕获实体之间的语义关系，形成知识网络
- 支持基于路径的推理，回答复杂的关系型问题
- 能够回答需要多跳推理的复杂问题

### GraphRAG 实现

```python
class GraphRAG:
    """
    GraphRAG 系统
    结合知识图谱和向量检索
    """

    def __init__(self, kg_builder, vector_store, generator):
        # 知识图谱构建器
        self.kg_builder = kg_builder
        # 向量数据库
        self.vector_store = vector_store
        # 生成器
        self.generator = generator

    def index_documents(self, documents):
        """
        索引文档到知识图谱和向量库
        :param documents: 文档列表
        """
        for doc in documents:
            # 从文档中提取实体
            entities = self.kg_builder.extract_entities(doc)

            # 从文档中提取关系
            relations = self.kg_builder.extract_relations(doc)

            # 存储实体到知识图谱
            self.kg_builder.add_entities(entities)

            # 存储关系到知识图谱
            self.kg_builder.add_relations(relations)

            # 同时存储到向量数据库（支持混合检索）
            embeddings = self.embedder.embed([doc])
            self.vector_store.add(embeddings, [doc])

    def query(self, question):
        """
        处理查询
        结合知识图谱和向量检索
        """
        # ==================== 知识图谱检索 ====================
        # 在知识图谱中检索相关实体
        relevant_entities = self.kg_builder.query_entities(question)

        # 基于相关实体获取子图
        subgraph = self.kg_builder.get_subgraph(relevant_entities)

        # ==================== 向量检索 ====================
        # 补充向量检索的结果
        vector_results = self.vector_store.search(question, top_k=5)

        # ==================== 结果融合 ====================
        # 将图谱结果和向量结果融合
        combined_context = self.fuse_results(subgraph, vector_results)

        # ==================== 生成 ====================
        return self.generator.generate(combined_context, question)

    def fuse_results(self, subgraph, vector_results):
        """
        融合知识图谱和向量检索的结果
        """
        # 从子图提取文本描述
        kg_text = subgraph.to_text()

        # 合并向量检索的文档
        vector_text = "\n".join([doc for doc, _ in vector_results])

        return f"{kg_text}\n{vector_text}"


class KnowledgeGraphBuilder:
    """知识图谱构建器"""

    def extract_entities(self, text):
        """
        从文本中提取命名实体
        使用 NER（命名实体识别）模型
        """
        entities = []
        # 实体类型：PERSON（人物）、ORG（组织）、TIME（时间）等
        return entities

    def extract_relations(self, text):
        """
        从文本中提取关系
        使用关系抽取模型
        """
        relations = []
        # 关系格式：(头实体, 关系类型, 尾实体)
        return relations

    def query_entities(self, question):
        """根据问题检索相关实体"""
        return []
```

### 应用场景

GraphRAG 特别适合以下场景：

- 需要理解实体关系的问答（如"谁是这家公司的 CEO？"）
- 多跳推理问题（如"张三的导师的导师是谁？"）
- 需要推理知识库中隐含关系的场景

---

## 章节小结

本章介绍了 RAG 和知识检索的核心技术：

- **RAG 基础原理**：将检索与生成结合，让 Agent 利用外部知识
- **Advanced RAG**：通过重排序和混合检索技术提升检索质量
- **向量数据库**：RAG 的基础设施，负责存储和检索向量表示
- **GraphRAG**：结合知识图谱增强关系推理和多跳问答能力

选择合适的 RAG 方案需要根据具体场景和需求：

- 对于简单的问答场景，基础 RAG 即可满足
- 对于需要精确检索的场景，增加重排序
- 对于需要关系推理的场景，GraphRAG 是更好的选择
