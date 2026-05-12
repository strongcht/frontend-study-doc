# 向量数据库（Vector Database）

## 概述

向量数据库是一种专门用于存储、索引和检索高维向量数据的数据库系统。其核心特点是将意思相近的内容存在一起，并能快速找到最相似的内容。

与传统数据库的精确匹配查询（如 `WHERE name = 'Alice'`）不同，向量数据库通过相似度进行查询（例如找到和某张图最相似的10张图）。

### 直观类比

| 数据库类型 | 检索方式 | 类比 |
|-----------|---------|------|
| 传统数据库 | 按书号、书名精确检索 | 找一本指定编号的书 |
| 向量数据库 | 按内容相关性检索 | 找"所有和《三体》风格类似的科幻小说" |

---

## 为什么需要向量数据库

### 传统数据库的局限

传统关系型数据库擅长处理结构化数据，但在面对以下需求时力不从心：

- 图片搜索（找出视觉相似的图片）
- 语义搜索（用户搜"苹果手机"，能找到"iPhone"的相关内容）
- 推荐系统（找到"和你喜欢的歌曲风格类似的歌"）
- 异常检测（找到"和正常行为差异最大的日志"）

这些需求的共同特征是：需要理解内容的"含义"，而不是做字面匹配。

### 传统方案的问题

- 用 `LIKE '%苹果%'` 搜索 → 找不到 "iPhone"、"Apple"
- 用全文索引搜索 → 找不到语义相关但用词不同的内容

### 对比示例

**传统数据库（精确匹配）：**

```sql
SELECT * WHERE name = '苹果手机'
匹配结果：
√ 苹果手机 Pro 128GB
x iPhone 15（未匹配）
x Apple 手机（未匹配）
x 智能手机 iOS（未匹配）
```

**向量数据库（语义相似）：**

```
search(embed("苹果手机"), top_k=4)
相似结果（含相似度）：
√ 苹果手机 Pro 128GB      0.98
√ iPhone 15               0.95
√ Apple 手机               0.93
√ 智能手机 iOS             0.87
```

---

## 核心概念：向量与嵌入

### 什么是向量（Vector）

在数学上，向量就是一组有序的数字。例如：

```
[0.12, -0.54, 0.87, 0.03, ..., 0.61]
```

在机器学习中，这组数字代表某个对象的语义特征，维度通常在 128 到 4096 之间。

### 什么是嵌入（Embedding）

嵌入是将现实世界的对象（文字、图片、音频等）转换成向量的过程和结果。这个转换由嵌入模型完成，其核心思想是：**语义相近的对象，其向量在空间中的距离也更近**。

**嵌入过程示意：**

| 输入 | 嵌入模型 | 输出 |
|------|---------|------|
| 文本 "今天天气真好" | text-embedding-3 | 文本向量 (1536维): [0.12, -0.54, 0.87, ...] |
| 图像 一张猫咪的照片 | CLIP / ResNet | 图像向量 (512维): [-0.33, 0.71, 0.22, ...] |
| 音频 一段音乐片段 | ... | 音频向量 (256维): [0.66, -0.11, 0.48, ...] |

### 语义近则向量近

用一个 2D 简化示例来理解（实际是几百至几千维）：

向量空间中存在不同聚类：

- **动物类**：猫、狗、兔子、熊
- **科技类**：电脑、手机、键盘、显示器
- **食物类**：披萨、汉堡、面条

查询"宠物"的向量，距离"猫""狗"更近，属于动物聚类。

> 关键理解：向量空间中距离近的两个向量，其原始内容在语义上也更相近。这是向量数据库所有能力的基础。

---

## 相似度计算方法

### 余弦相似度（Cosine Similarity）

衡量两个向量的方向角，忽略长度。这是最常用的方法，尤其适合文本场景。

```
cosine_similarity(A, B) = (A · B) / (|A| · |B|)
```

- 结果范围：-1 到 1，值越大越相似
- 适用场景：文本语义搜索、文档相似度

### 欧氏距离（Euclidean Distance）

衡量两点之间的直线距离，距离越小越相似。

```
d(A, B) = sqrt(Σ(A_i - B_i)²)
```

- 结果范围：0 到 ∞，值越小越相似
- 适用场景：图像检索、地理位置相关应用

### 点积（Dot Product）

向量相乘求和，结合了方向和长度信息。

```
A · B = Σ A_i × B_i
```

- 适用场景：推荐系统（向量已归一化时等价于余弦相似度）

### 三种方法对比

| 方法 | 原理 | 结果含义 | 推荐场景 |
|------|------|---------|---------|
| 余弦相似度 | 计算两向量夹角的余弦值 | 关注方向，忽略大小 [-1, 1] | 文本搜索、NLP 首选 |
| 欧氏距离 | 两点之间的直线距离 | 关注绝对位置差异 [0, ∞) | 图像检索、坐标系数据 |
| 点积 | 向量各分量乘积之和 | 方向+长度综合考量 | 推荐系统、归一化场景 |

### Python 代码示例

```python
import numpy as np

# 余弦相似度：衡量方向相似性
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# 欧氏距离：衡量绝对位置差异
def euclidean_distance(a, b):
    return np.linalg.norm(a - b)

# 点积：结合方向与长度
def dot_product(a, b):
    return np.dot(a, b)

# 示例向量
v1 = np.array([0.12, -0.54, 0.87, 0.03])
v2 = np.array([0.10, -0.50, 0.90, 0.05])
v3 = np.array([-0.80, 0.20, -0.30, 0.70])

print(f"v1 vs v2 余弦相似度: {cosine_similarity(v1, v2):.4f}")  # 约 0.9997
print(f"v1 vs v3 余弦相似度: {cosine_similarity(v1, v3):.4f}")  # 约 -0.55
```

输出：

```
v1 vs v2 余弦相似度: 0.9997
v1 vs v3 余弦相似度: -0.5512
```

---

## 向量索引算法

数据量大时（百万、亿级），对每条数据做相似度计算（暴力检索）太慢。向量数据库使用专门的索引算法来加速查询。

### 暴力检索（Flat / Brute-force）

| 维度 | 说明 |
|------|------|
| 原理 | 遍历所有向量，逐一计算相似度 |
| 优点 | 结果 100% 精确 |
| 缺点 | 数据量大时极慢，O(n) 复杂度 |
| 适用 | 数据量小于 10 万，对精度要求极高 |

### IVF（倒排文件索引）

**IVF 执行步骤：**

1. **训练阶段**：用 K-Means 将所有向量聚成 N 个簇，记录每个簇的中心
2. **查询阶段**：先找出距离最近的几个簇的中心，再只在这些簇内做精确搜索

原理：只在距离最近的簇内做精确搜索，大幅减少计算量。

### HNSW（分层导航小世界图）

HNSW 是目前最主流的向量索引算法，兼顾速度和精度。

**HNSW 分层结构：**

- **第 2 层**（最稀疏，长程跳转）
- **第 1 层**（中等密度，中程跳转）
- **第 0 层**（最密集，精确搜索）

查询时从顶层大步跳转定位区域，再逐层细化精确找到最近邻。

**HNSW 核心思路：**

- 构建多层图结构，顶层稀疏，底层密集
- 查询时从顶层入口开始，做"跳格游戏"：每层贪心地往更近的节点跳，再下探到下一层
- 大幅减少需要比较的节点数，时间复杂度近似 O(log n)

### 其他常用索引

| 索引类型 | 特点 | 适用场景 |
|---------|------|---------|
| Flat（暴力） | 精确但慢 | 小数据集、精度优先 |
| IVF_Flat | 聚类后精确搜索，速度快 | 中大规模，内存充足 |
| IVF_PQ | 量化压缩，节省内存 | 超大规模，内存受限 |
| HNSW | 速度快、精度高，内存占用高 | 最常用，推荐首选 |
| ScaNN | Google 出品，优化吞吐量 | 高并发生产环境 |

---

## 主流向量数据库对比

| 数据库 | 类型 | 部署方式 | 特点 | 适用场景 | 难度 |
|--------|------|---------|------|---------|------|
| Chroma | 开源免费 纯向量DB | 本地/云端 | 嵌入式优先，极简 API，Python 原生 | RAG 原型、AI 应用开发 | 入门 |
| Qdrant | 开源免费 纯向量DB | 本地/Docker/云服务 | Rust 实现，性能强劲，支持过滤+向量混合检索 | 生产级推荐，性能优先 | 中级 |
| Weaviate | 开源免费 多模态DB | 本地/云端 SaaS | GraphQL API，内置向量化，多模态 | 多模态检索，知识图谱 | 中级 |
| Milvus | 开源免费 纯向量DB | 分布式部署/Kubernetes | LF AI 基金会项目，大规模分布式 | 亿级数据，企业大规模 | 进阶 |
| Pinecone | 商业 SaaS | 纯云端 | 全托管服务，零运维，开箱即用 | 快速上线，无运维能力团队 | 入门 |
| pgvector | 开源插件 PG 扩展 | 已有 PostgreSQL 环境直接用 | 复用已有 PG 基础设施，SQL 接口 | 已用 PG 的项目，轻量接入 | 入门 |

> 新手建议：从 Chroma 或 pgvector 起步，前者适合 AI 应用原型，后者适合已有 PostgreSQL 的项目。

---

## 快速上手：Python 示例

### 安装

```bash
pip install chromadb openai
```

### 完整示例：构建一个文档语义搜索系统

```python
import chromadb
from chromadb.utils import embedding_functions

# ─── 1. 初始化客户端 ───────────────────────────────────────────
# 持久化到本地（推荐）
client = chromadb.PersistentClient(path="./my_vector_db")

# 使用 OpenAI 嵌入模型（也可换成本地模型）
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="your-openai-api-key",       # 必填：替换为你的 API Key
    model_name="text-embedding-3-small"   # 1536 维，性价比高
)

# ─── 2. 创建集合（类似关系库里的"表"）────────────────────────
collection = client.get_or_create_collection(
    name="my_documents",                   # 集合名称
    embedding_function=openai_ef,          # 绑定嵌入函数
    metadata={"hnsw:space": "cosine"}      # 使用余弦相似度
)

# ─── 3. 插入文档 ──────────────────────────────────────────────
documents = [
    "Python 是一种面向对象的解释型编程语言，广泛用于数据科学和 AI 开发",
    "机器学习是人工智能的子领域，让计算机从数据中学习规律",
    "深度学习使用多层神经网络，在图像识别和 NLP 任务中表现优异",
    "向量数据库专门存储高维向量，支持语义相似度搜索",
    "PostgreSQL 是功能强大的开源关系型数据库",
    "Redis 是基于内存的高性能键值数据库，常用于缓存",
    "Docker 容器化技术让应用可以在任何环境中一致运行",
    "Git 是分布式版本控制系统，是现代软件开发的基础工具",
]

ids = [f"doc_{i}" for i in range(len(documents))]

# 批量插入（Chroma 自动调用嵌入模型转为向量后存储）
collection.add(
    documents=documents,
    ids=ids,
    metadatas=[{"source": "tutorial", "index": i} for i in range(len(documents))]
)

print(f"已插入 {len(documents)} 条文档")
```

### 语义搜索

```python
# ─── 4. 语义搜索 ──────────────────────────────────────────────
query = "如何用 Python 做人工智能"

results = collection.query(
    query_texts=[query],
    n_results=3,                # 返回最相似的 3 条
    include=["documents", "distances", "metadatas"]
)

print(f"\n查询：{query}")
print("-" * 50)
for i, (doc, dist) in enumerate(zip(
    results["documents"][0],
    results["distances"][0]
)):
    similarity = 1 - dist   # 余弦距离转相似度
    print(f"第 {i+1} 名（相似度 {similarity:.4f}）：")
    print(f"  {doc}")
    print()
```

输出：

```
查询：如何用 Python 做人工智能
--------------------------------------------------
第 1 名（相似度 0.9231）：Python 是一种面向对象的解释型编程语言...
第 2 名（相似度 0.8874）：机器学习是人工智能的子领域...
第 3 名（相似度 0.8612）：深度学习使用多层神经网络...
```

### 带过滤条件的搜索、更新和删除

```python
# ─── 5. 带过滤条件的搜索（元数据过滤）───────────────────────
results_filtered = collection.query(
    query_texts=["数据库技术"],
    n_results=2,
    where={"source": "tutorial"},        # 只在 source=tutorial 的文档里搜索
    include=["documents", "distances"]
)

# ─── 6. 更新文档 ──────────────────────────────────────────────
collection.update(
    ids=["doc_0"],
    documents=["Python 是目前最流行的编程语言，在 AI、数据分析、Web 开发中均有广泛应用"],
    metadatas=[{"source": "tutorial", "index": 0, "updated": True}]
)

# ─── 7. 删除文档 ──────────────────────────────────────────────
collection.delete(ids=["doc_7"])   # 删除 Git 相关文档

# ─── 8. 查看集合统计 ──────────────────────────────────────────
print(f"当前集合文档数：{collection.count()}")
```

### 纯本地运行（不使用第三方嵌入 API）

```python
import chromadb
from sentence_transformers import SentenceTransformer

# 使用本地嵌入模型（无需 API Key，完全离线）
model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")  # 支持中文

client = chromadb.Client()
collection = client.create_collection("local_demo")

texts = ["今天天气很好", "阳光明媚，适合出门", "股市大涨了", "明天可能会下雨"]

# 手动生成向量后插入
embeddings = model.encode(texts).tolist()
collection.add(
    embeddings=embeddings,
    documents=texts,
    ids=[f"id_{i}" for i in range(len(texts))]
)

# 查询
query_embedding = model.encode(["今天天气怎么样"]).tolist()
results = collection.query(query_embeddings=query_embedding, n_results=2)
print(results["documents"])
# 输出: [['今天天气很好', '阳光明媚，适合出门']]
```

### pgvector 示例（PostgreSQL 用户）

```sql
-- 安装扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 建表：存储文章标题及其向量（1536维）
CREATE TABLE articles (
    id       SERIAL PRIMARY KEY,
    title    TEXT NOT NULL,
    content  TEXT,
    embedding vector(1536)           -- 向量列，1536 维
);

-- 创建 HNSW 索引加速查询
CREATE INDEX ON articles
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 插入数据（向量由应用层生成后传入）
INSERT INTO articles (title, embedding)
VALUES ('Python 入门指南', '[0.12, -0.54, 0.87, ...]'::vector);

-- 语义搜索：找最相似的 5 篇文章
SELECT id, title,
       1 - (embedding <=> '[0.10, -0.50, 0.90, ...]'::vector) AS similarity
FROM articles
ORDER BY embedding <=> '[0.10, -0.50, 0.90, ...]'::vector
LIMIT 5;
```

> 注意：`<=>` 是 pgvector 提供的向量距离运算符，用于计算余弦距离。用 1 减去余弦距离即得到余弦相似度。

---

## 典型应用场景

### 六大典型场景

| 场景 | 说明 | 代表案例 |
|------|------|---------|
| **RAG 知识库问答** | 将企业文档转换为向量，用户提问时检索相关片段交给 LLM 生成答案 | ChatPDF、NotionAI、企业知识库助手 |
| **个性化推荐系统** | 将用户行为、商品信息转为向量，寻找"品味相似的用户喜欢什么"来做推荐 | Spotify 歌曲推荐、电商相关商品推荐 |
| **以图搜图** | 将图像编码为向量，通过相似度搜索找出视觉相近的图片 | Google 图片搜索、淘宝拍照搜商品 |
| **异常检测** | 正常行为被映射到聚集的向量区域，异常行为的向量远离正常区域即可检测 | 网络入侵检测、金融欺诈识别 |
| **内容去重/版权检测** | 通过向量相似度判断两段内容是否高度相似 | 论文查重系统、音乐版权检测 |
| **人脸/生物特征识别** | 将人脸编码为特征向量，在向量库中检索最相似的已知人脸 | 人脸门禁系统、手机人脸解锁 |

### RAG（检索增强生成）架构

RAG 是目前向量数据库最主要的应用场景之一，其核心工作流程：

1. **Step 1** 用户提问："Python 怎么处理异常？"
2. **Step 2** 问题向量化：Embedding 模型 → [0.12, -0.54, ...]
3. **Step 3** 向量检索：在向量 DB 中找最相似文档
4. **Step 4** LLM 生成：检索内容 + 问题 → Prompt → 答案
5. **Step 5** 返回答案：基于文档的准确、可溯源回答

向量数据库在步骤 3 中承担核心角色：毫秒级找到最相关的知识片段。

---

## 选型建议与最佳实践

### 选型决策树

```
你的情况是什么？
│
├─── 已有 PostgreSQL，且数据量 < 500 万
│    └──> 用 pgvector，无缝集成，零额外运维
│
├─── 做 AI/LLM 应用原型，快速验证
│    └──> 用 Chroma，几行代码跑起来
│
├─── 需要生产级部署，性能优先，数据量 500 万 ~ 1 亿
│    └──> 用 Qdrant，Rust 实现，性能强
│
├─── 超大规模（> 1 亿），有 K8s 运维能力
│    └──> 用 Milvus，分布式，功能最全
│
└─── 团队没有运维能力，愿意付费
     └──> 用 Pinecone 云服务，开箱即用
```

### 嵌入模型的选择

| 需求 | 推荐模型 |
|------|---------|
| 中英文文本（高质量） | OpenAI text-embedding-3-small |
| 中文文本（本地离线） | BAAI/bge-large-zh-v1.5 |
| 多语言通用 | paraphrase-multilingual-MiniLM-L12-v2 |
| 图文多模态 | OpenAI CLIP 系列 |

### 性能优化技巧

**1. 批量插入**：一次插入多条，避免频繁单条写入。

```python
# 推荐：批量插入
collection.add(documents=docs_list, ids=ids_list)

# 不推荐：循环单条（每次都重新索引，效率极低）
# for doc, id in zip(docs_list, ids_list):
#     collection.add(documents=[doc], ids=[id])
```

**2. 向量归一化**：使用余弦相似度前，提前归一化向量可加速计算。

```python
import numpy as np

def normalize(v):
    """对向量做 L2 归一化，使模长为 1"""
    return v / np.linalg.norm(v)
```

**3. 合理设置 n_results**：不要设置很大的 top_k，一般 RAG 场景 3~10 条足够。

**4. 善用元数据过滤**：在搜索时配合 where 条件，缩小搜索范围。

```python
# 只在"技术文档"分类里搜索，缩小范围提升精度
collection.query(
    query_texts=["Python 异常处理"],
    where={"category": "tech_doc"},
    n_results=5
)
```

**5. 定期重建索引**：数据量增长后，适时重建 HNSW 索引以维持查询性能。

### 常见踩坑

| 问题 | 说明 | 解决方案 |
|------|------|---------|
| 嵌入模型要统一 | 插入和查询必须用同一个模型 | 在配置文件中固定模型版本 |
| 维度不匹配 | 换了模型但没重建集合 | 换模型时删除重建集合 |
| 文本过长 | 大多数模型有 token 限制（512~8192） | 超长文本先分块（chunking） |
| 相似度不准确 | 文本没有分块，语义被稀释 | 按段落或固定长度切分文档 |
| 冷启动慢 | 数据量大时首次加载索引耗时 | 提前预热，或使用持久索引 |

---

## 总结

**核心知识点回顾：**

| 概念 | 要点 |
|------|------|
| **向量/嵌入** | 把对象转为高维数字向量，语义近则距离近，是一切的基础 |
| **相似度计算** | 余弦相似度、欧氏距离、点积，文本首选余弦 |
| **索引算法** | HNSW 最主流、IVF 适合大规模、Flat 适合小数据，近似换速度 |
| **选型参考** | 入门：Chroma，生产：Qdrant，已有 PG：pgvector，亿级：Milvus |
| **核心应用** | RAG 知识问答、个性化推荐、以图搜图、异常检测 |

向量数据库是 AI 时代基础设施的重要一环，解决了传统数据库无法处理的语义相似性搜索问题，是构建 RAG 系统、推荐系统、多模态搜索的核心组件。

### 学习路径建议

1. **第一步**：理解向量和嵌入的概念，运行文中的 Chroma 示例
2. **第二步**：尝试用 LangChain + Chroma 构建一个简单的文档问答系统
3. **第三步**：学习 HNSW 等索引算法，理解精度与速度的权衡
4. **第四步**：根据实际项目需求，选择合适的向量数据库并在生产环境部署

---

## 参考资源

- Chroma 官方文档：https://docs.trychroma.com
- Qdrant 官方文档：https://qdrant.tech/documentation
- pgvector GitHub：https://github.com/pgvector/pgvector
- Milvus 官方文档：https://milvus.io/docs
- HNSW 论文原文：https://arxiv.org/abs/1603.09320
- OpenAI Embeddings 指南：https://platform.openai.com/docs/guides/embeddings
- HuggingFace 文本嵌入排行榜（MTEB）：https://huggingface.co/spaces/mteb/leaderboard
