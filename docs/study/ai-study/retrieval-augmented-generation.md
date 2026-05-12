# RAG 与知识检索

RAG（Retrieval-Augmented Generation，检索增强生成）是目前最主流的 LLM 落地架构之一。

RAG 的核心思想是：**让 LLM 在回答问题时，先从外部知识库中检索相关内容，再基于检索结果生成回答**，而不是仅依赖模型训练时记住的知识。

这解决了 LLM 的两个核心痛点：知识截止日期（模型不知道训练后发生的事）和幻觉问题（模型在不确定时会编造答案）。

---

## RAG 基础原理

一个完整的 RAG 系统由两条流水线组成：**离线索引流水线**（将文档预处理存入向量库）和**在线查询流水线**（接收用户问题、检索、生成）。

### 离线阶段

将原始文档切分成小块，通过 Embedding 模型转换为向量，存入向量数据库。

### 在线阶段

将用户问题同样转换为向量，从数据库中找到最相近的文档块，拼接成上下文交给 LLM 生成答案。

### RAG 完整请求流程

```
用户提问
    ↓
Embedding 转为查询向量
    ↓
向量数据库 → 相似度检索 Top-K
    ↓
Prompt 拼接 → 问题 + 文档块
    ↓
LLM 生成 → 基于检索结果作答
```

**离线索引（一次性预处理）：**

```
原始文档 → 切分/清洗 → Embedding 转为文档向量 → 写入向量数据库
```

**在线查询流程（每次请求都会经过）：**

```
用户提问 → Embedding → 向量检索 → Prompt 拼接 → LLM 生成 → 返回答案
```

---

## 数据预处理与文档切分（Chunking）

### 前置挑战：复杂文档解析

在进行切分前，RAG 往往面临着**格式解析**的挑战。特别是 PDF、Word 或扫描件中的表格、图片和多栏排版，普通的文本提取极易造成语义错乱。

目前行业主流方案是引入**文档解析引擎**（如 LlamaParse、Unstructured）或多模态大模型，将复杂图文转换为结构化的 Markdown，为后续高质量切分打下基础。

### 文档切分策略

文档切分是 RAG 效果的基础，切分粒度直接影响检索质量。块太大会引入噪声，块太小会丢失上下文。常用策略如下：

| 切分策略 | 适用场景 | 优点 | 缺点 |
|---|---|---|---|
| **固定大小切分** | 通用文本 | 实现简单，速度快 | 可能切断语义完整的句子 |
| **递归字符切分** | 结构化文本（Markdown、代码） | 优先按段落、句子等语义边界切分 | 实现略复杂，需设定合理的分隔符列表 |
| **语义切分 (Semantic)** | 长文档、书籍 | 利用 Embedding 计算相邻句子的相似度，自动寻找语义转折点切分 | 计算成本高，预处理速度慢 |
| **父子文档检索 (Small-to-Big)** | 全面覆盖场景 | 用"小块"进行高精度向量检索，命中后返回对应的"大块"（父文档）给 LLM，兼顾了检索精度和上下文完整性 | 数据库设计和维护成本翻倍 |

> 实践中常在切分时加入**重叠（overlap）**，即相邻块之间共享若干字符，防止重要信息在边界处被截断。典型配置：块大小 512 tokens，重叠 50~100 tokens。

---

## 实例：使用 LangChain 进行递归切分

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,        # 每块最大 token 数
    chunk_overlap=50,      # 相邻块的重叠 token 数，防止信息在边界处丢失
    separators=["\n\n", "\n", "。", ".", " ", ""]  # 优先按段落、句子切分
)

chunks = splitter.split_text(document_text)
print(f"切分为 {len(chunks)} 个文档块")
```

---

## 向量检索

### Embedding 模型

Embedding 模型负责将文本转换为稠密向量（通常是 768 或 1536 维的浮点数数组）。语义相近的文本在向量空间中距离更近，这正是相似度检索的数学基础。

常用 Embedding 模型对比：

| 模型 | 维度 | 适用语言 | 特点 |
|---|---|---|---|
| `text-embedding-3-small`（OpenAI） | 1536 | 多语言 | 性价比高，适合大规模索引 |
| `text-embedding-3-large`（OpenAI） | 3072 | 多语言 | 精度最高，成本较高 |
| `BAAI/bge-m3` | 1024 | 中英文 | 开源，中文效果优秀，支持多语言 |
| `sentence-transformers/all-MiniLM-L6-v2` | 384 | 英文 | 体积小，速度快，适合本地极轻量部署 |

### 相似度计算与 ANN 算法

检索的核心是度量距离。最常用的是**余弦相似度（Cosine Similarity）**，它计算两个向量的夹角余弦值，值域 [-1, 1]，越接近 1 越相似。此外还有点积（Dot Product）和欧氏距离（L2 Distance）。

为了在百万级向量中实现毫秒级检索，数据库通常采用**近似最近邻（ANN）算法**（如 **HNSW**、IVF）。HNSW 是目前最主流的算法，它通过构建多层跳跃图网络，牺牲极少的精度换取了数量级的搜索速度提升。

---

## Advanced RAG（进阶架构）

基础架构（Naive RAG）常面临检索不准确、冗余信息多导致"上下文淹没"等问题。Advanced RAG 通过**预检索优化 → 检索融合 → 后检索优化**的三段式架构予以解决。

### 1. 预检索：查询优化

用户的原始问题往往表达不够精确：

- **查询改写（Query Rewriting）**：用 LLM 将口语化提问改写为规范化的检索词。
- **HyDE（Hypothetical Document Embedding）**：让 LLM 先"盲猜"一个假设性答案，由于生成的答案通常比原问题包含更多行业术语，用这个假设答案的向量去检索，往往能召回更高质量的文档。

### 2. 混合检索（Hybrid Search）

将**向量检索**（懂语义，容错率高）与**关键词检索**（BM25，匹配度高）的结果按权重融合。这在遇到专有名词、产品型号、代码片段时尤为重要，因为传统的向量检索容易在特定的专有名词上"翻车"。

### 3. 后检索优化：重排序（Reranking）

这是一个**粗排 → 精排**的两阶段设计。向量检索虽然快，但打分不够精确。重排序（Reranking）会引入 **Cross-Encoder 模型**（如 `bge-reranker`），将"问题"和"文档"成对输入模型进行联合推理打分。它的运算量大，只负责精选 Top-20 到 Top-5。

---

## 实例：重排序流程伪代码

```python
from sentence_transformers import CrossEncoder

reranker = CrossEncoder("BAAI/bge-reranker-v2-m3")

# 1. 粗排：向量检索极速召回 Top-50
candidates = vector_store.similarity_search(query, k=50)

# 2. 精排：构建 [问题, 文档] 对进行精确打分
pairs = [[query, doc.page_content] for doc in candidates]
scores = reranker.predict(pairs)

# 3. 筛选最终传入 LLM 的 Top-5
ranked_docs = sorted(zip(scores, candidates), reverse=True)
final_docs = [doc for _, doc in ranked_docs[:5]]
```

### 4. Self-RAG 与 CRAG（修正式 RAG）

加入自我反思机制。例如 CRAG（Corrective RAG）在拿到检索结果后，先由 LLM 充当"评委"打分。如果本地知识库查无此文或质量极低，系统会自动触发 Web Search（如 Google API）作为补充，大幅降低幻觉。

---

## GraphRAG：知识图谱 + 检索融合

传统 RAG 将知识库当作独立的文本碎片，无法回答诸如"找到所有同时由现任 CEO 创办且市值超千亿的公司"这类需要**跨文档、多跳推理**的复杂问题。**GraphRAG** 引入知识图谱（Knowledge Graph），将实体和关系显式建模。

### GraphRAG 架构

```
用户问题
    ├── 向量检索 → 相关文档块
    └── 图检索 → 实体关系子图
            ├── 实体 A → 关系 → 实体 B
            └── 实体 B → 关系 → 实体 C
                    ↓
            上下文融合 → 文档块 + 图路径
                    ↓
                LLM 生成答案
```

GraphRAG 将向量检索与知识图谱融合：用户问题同时触发向量检索和图检索，两路结果融合后输入 LLM 生成答案。

### GraphRAG 核心步骤

1. **知识构建**：离线阶段使用 LLM 从文档提取三元组（主体、关系、客体），写入 Neo4j 等图数据库。
2. **双路检索**：针对提问中的实体，不仅做传统的向量检索，同时在图谱中触发图遍历（Graph Traversal），提取多跳关系链。
3. **图文融合生成**：将向量检索找回的"片段"与图检索找回的"路径结构"拼装进 Prompt，使得 LLM 既具备全局视野又掌握具体细节。

---

## 技术与数据库选型建议

| 数据库/工具选型 | 类型 | 推荐落地场景 |
|---|---|---|
| **Pinecone / Zilliz Cloud** | 全托管云服务 | 开箱即用，不想维护基础设施。搭配 Cohere Rerank + GPT-4o 是最快商用的方案。 |
| **Qdrant** | 开源 + 托管 | Rust 编写，内存管理优秀，性能极高。适合企业级私有化部署。 |
| **Weaviate / Elasticsearch** | 开源 + 托管 | 自带极其成熟的 BM25 + 向量混合检索（Hybrid Search），专有名词较多的场景首选。 |
| **Milvus** | 开源分布式 | 适合十亿至百亿级别的超大规模企业级检索平台。 |
| **Chroma / FAISS** | 本地库/嵌入式 | 极轻量，无需部署独立服务。非常适合本地开发、个人知识库项目验证。 |

---

## RAG 评估指标（RAGAS 框架）

RAG 系统的评估不能仅凭直觉，主流使用 **RAGAS** 框架，从"检索"和"生成"两个维度进行自动化量化测试：

| 指标 | 维度 | 说明 |
|---|---|---|
| **Context Recall（检索召回率）** | 检索 | 标准答案中的信息有多少比例能被检索到 |
| **Context Precision（检索精确率）** | 检索 | 检索到的文档中有多少比例是真正相关的 |
| **Faithfulness（忠实度/幻觉指标）** | 生成 | 生成的答案是否都有检索出的文档支撑 |
| **Answer Relevance（答案相关性）** | 生成 | 生成的答案是否真正回答了用户的问题，避免答非所问 |
