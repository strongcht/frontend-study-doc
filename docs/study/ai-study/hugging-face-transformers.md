# Hugging Face Transformers

Hugging Face Transformers 是目前最流行的开源 NLP / AI 库，提供数千个预训练模型，覆盖文本、图像、音频和多模态任务。核心价值在于将复杂的模型加载、推理和训练工作流封装为几行代码即可完成。

---

## Hugging Face 生态系统概览

生态系统包括：

- **Hub**：40 万+ 模型，10 万+ 数据集
- **Transformers**：预训练模型推理与微调框架
- **Datasets**：大规模数据集加载与处理
- **PEFT**：参数高效微调（LoRA / QLoRA）
- **Accelerate**：多 GPU/TPU 训练，分布式加速
- **Tokenizers**：高性能分词器（Rust 实现）
- **Evaluate**：模型评估指标（BLEU/F1 等）

### 支持的任务类型

**NLP（自然语言处理）：**
- 文本分类（情感分析）
- 命名实体识别（NER）
- 问答系统（QA）
- 文本摘要
- 机器翻译
- 文本生成（对话）
- 填空 / 语言建模

**CV（计算机视觉）：**
- 图像分类
- 目标检测
- 图像分割
- 深度估计
- 图像生成
- 视频分类
- 关键点检测

**音频与多模态：**
- 语音识别（ASR）
- 音频分类
- 文本转语音（TTS）
- 图文匹配（VQA）
- 图像描述
- 文档问答（DOC QA）
- 零样本分类

---

## Transformer 架构核心原理

### 整体架构：Encoder-Decoder

Transformer 采用编码器-解码器结构，通过自注意力机制处理序列数据。

### 三大模型家族

**仅编码器模型（Encoder-only）：**
- 双向注意力，理解全局上下文
- 适合：分类、NER、QA（理解任务）
- 代表：BERT、RoBERTa、ALBERT
- 中文：BERT-wwm、MacBERT

**仅解码器模型（Decoder-only）：**
- 因果注意力（仅左侧上下文），自回归生成
- 适合：文本生成、对话、代码生成
- 代表：GPT 系列、LLaMA、Qwen
- 中文：ChatGLM、Baichuan

**编码器-解码器模型（Encoder-Decoder）：**
- 序列到序列（Seq2Seq）任务
- 适合：翻译、摘要、QA 生成
- 代表：T5、BART、mT5
- 中文：mT5、PEGASUS-Chinese

---

## 安装与环境配置

### 安装

```python
# 基础安装
pip install transformers

# 完整安装（包含训练依赖）
pip install transformers[torch]       # PyTorch 后端（推荐）
pip install transformers[tf-cpu]      # TensorFlow 后端
pip install transformers[flax]        # JAX/Flax 后端

# 常用配套库
pip install datasets          # HuggingFace 数据集库
pip install evaluate          # 模型评估指标
pip install accelerate        # 多GPU/混合精度训练
pip install peft              # 参数高效微调（LoRA等）
pip install tokenizers        # 高性能分词器
pip install sentencepiece     # 部分模型（T5/LLaMA）需要

# 验证安装
python -c "import transformers; print(transformers.__version__)"
```

### 环境变量配置

```bash
# 设置模型缓存目录（默认 ~/.cache/huggingface）
export HF_HOME=/data/huggingface_cache

# 国内用户：使用镜像站加速下载（推荐 hf-mirror.com）
export HF_ENDPOINT=https://hf-mirror.com

# 离线模式（只使用已缓存的模型）
export TRANSFORMERS_OFFLINE=1

# 禁用进度条（CI/CD 环境）
export DISABLE_TQDM=1
```

也可以在代码中设置：

```python
import os
os.environ["HF_ENDPOINT"] = "https://hf-mirror.com"

from transformers.utils import TRANSFORMERS_CACHE
print(TRANSFORMERS_CACHE)
```

---

## Pipeline：五行代码实现 AI

Pipeline 是 Transformers 最高层的抽象，将模型加载、预处理、推理和后处理打包在一起。

### Pipeline 内部工作流

1. **原始输入**：文本 / 图像 / 音频等
2. **预处理**：Tokenizer 分词，转换为 token ID，填充/截断
3. **模型推理**：前向传播，输出 logits 或隐藏层向量
4. **后处理**：Softmax/Argmax，解码 token 为文本，格式化输出
5. **结果**：标签/分数或生成的文本

### Pipeline 快速示例

```python
from transformers import pipeline

# 1. 情感分析（文本分类）
classifier = pipeline("sentiment-analysis")
result = classifier("I love using Hugging Face Transformers!")
# -> [{'label': 'POSITIVE', 'score': 0.9998}]

# 2. 文本生成
generator = pipeline("text-generation", model="gpt2")
result = generator("Once upon a time in a land far away,",
    max_new_tokens=50, num_return_sequences=1, temperature=0.8)

# 3. 填空（掩码语言模型）
unmasker = pipeline("fill-mask", model="bert-base-uncased")
result = unmasker("The capital of France is [MASK].")
# -> [{'token_str': 'paris', 'score': 0.9823}, ...]

# 4. 命名实体识别（NER）
ner = pipeline("ner", aggregation_strategy="simple")
result = ner("My name is John and I work at Google in New York.")
# -> [{'entity_group': 'PER', 'word': 'John', 'score': 0.998}, ...]

# 5. 抽取式问答
qa = pipeline("question-answering")
result = qa(question="Who invented Python?",
    context="Python was created by Guido van Rossum in 1991.")
# -> {'answer': 'Guido van Rossum', 'score': 0.9887}

# 6. 文本摘要
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
result = summarizer(article, max_length=60, min_length=20)

# 7. 机器翻译
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-zh")
result = translator("Hello, how are you today?")
# -> [{'translation_text': '你好，你今天怎么样？'}]

# 8. 零样本分类（不需要专门训练）
zero_shot = pipeline("zero-shot-classification")
result = zero_shot("I love playing football",
    candidate_labels=["sports", "politics", "technology"])
# -> {'labels': ['sports', ...], 'scores': [0.972, ...]}
```

### Pipeline 高级配置

```python
import torch
from transformers import pipeline

# 指定 GPU
pipe = pipeline("text-generation", model="gpt2", device=0)

# 指定精度（省显存）
pipe = pipeline("text-generation", model="meta-llama/Llama-2-7b-hf",
    torch_dtype=torch.float16, device_map="auto")

# 批量处理（提升吞吐量）
pipe = pipeline("sentiment-analysis", batch_size=32)
results = pipe(large_text_list)

# 大文本分块处理
asr = pipeline("automatic-speech-recognition",
    model="openai/whisper-large-v2",
    chunk_length_s=30, stride_length_s=5)
result = asr("long_audio.wav", return_timestamps=True)
```

---

## Tokenizer 深入理解

Tokenizer 是 NLP 的第一步：将原始文本转换为模型可以理解的数字序列。

### 分词完整流程

**第 1 步 -- 原始文本：** `"Hello, I'm learning Transformers! It's great."`

**第 2 步 -- 分词：** `["Hello", ",", "I", "'m", "learning", "Transform", "##ers", "!"]` -- WordPiece/BPE 子词分词将罕见词拆分

**第 3 步 -- 添加特殊 token：** `["[CLS]", "Hello", ",", "I", "'m", "learning", "Transform", "##ers", ... "[SEP]"]`

**第 4 步 -- 转换为 Token ID：** `[101, 7592, 1010, 1045, 1005, 1049, 4083, 19081, ... 102]`

### Tokenizer 核心用法

```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

# 一步完成编码
encoding = tokenizer(
    "Hello, I'm learning Transformers!",
    return_tensors="pt",
    padding=True,
    truncation=True,
    max_length=128,
)

print(encoding.keys())
# -> dict_keys(['input_ids', 'token_type_ids', 'attention_mask'])

print(encoding["input_ids"][0][:8])
# -> tensor([101, 7592, 1010, 1045, 1005, 1049, 4083, 19081])

print(encoding["attention_mask"][0][:8])
# -> tensor([1, 1, 1, 1, 1, 1, 1, 1])    # 1=真实token, 0=填充

# 解码（ID -> 文本）
decoded = tokenizer.decode(encoding["input_ids"][0], skip_special_tokens=True)
print(decoded)   # -> "hello, i'm learning transformers!"

# 批量编码（自动 padding 对齐）
texts = ["Short.", "This is a much longer sentence for testing."]
batch = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
print(batch["input_ids"].shape)   # -> torch.Size([2, 10])

# 词表信息
print(f"词表大小: {tokenizer.vocab_size}")      # -> 30522
print(f"[CLS] ID: {tokenizer.cls_token_id}")     # -> 101
print(f"[SEP] ID: {tokenizer.sep_token_id}")     # -> 102
print(f"最大长度: {tokenizer.model_max_length}")  # -> 512
```

### 常见 Tokenizer 类型对比

| 算法 | 原理 | 示例分词 | 代表模型 |
|------|------|---------|---------|
| **BPE**（Byte Pair Encoding） | 统计高频字符对合并，学习最优子词词表 | "transformers" -> ["transform", "ers"] | GPT / RoBERTa |
| **WordPiece** | 最大化语言模型概率，`##` 前缀标记子词 | "transformers" -> ["transform", "##ers"] | BERT / DistilBERT |
| **SentencePiece** | Unigram/BPE 变体，语言无关，直接处理原始字节 | "transformers" -> ["_transform", "ers"] | T5 / LLaMA / Qwen |

---

## 模型加载与推理

### AutoClass：自动选择正确的模型类

**AutoClass 工作原理：** 给定模型名称如 "bert-base-uncased" 或本地路径，AutoClass 读取 `config.json`，匹配架构类型，自动返回正确的类。

**常用 AutoClass 速查：**
- `AutoTokenizer` -- 自动分词器
- `AutoModel` -- 基础模型（输出隐藏状态）
- `AutoModelForSequenceClassification` -- 文本分类任务
- `AutoModelForCausalLM` -- 文本生成任务

```python
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=2, torch_dtype=torch.float16, device_map="auto"
)

# 手动推理完整流程
text = "Transformers is an amazing library!"

# 1. 编码
inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
inputs = {k: v.to(model.device) for k, v in inputs.items()}

# 2. 前向传播
with torch.no_grad():
    outputs = model(**inputs)

# 3. 解析输出
logits = outputs.logits                       # shape: [1, 2]
probs  = torch.softmax(logits, dim=-1)
pred   = torch.argmax(probs, dim=-1).item()

id2label = model.config.id2label
print(f"预测类别: {id2label[pred]}, 置信度: {probs[0][pred]:.4f}")
```

### 提取句子嵌入

```python
from transformers import AutoModel, AutoTokenizer
import torch

model = AutoModel.from_pretrained("bert-base-uncased")
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")

def get_sentence_embedding(text: str) -> torch.Tensor:
    inputs = tokenizer(text, return_tensors="pt", max_length=512, truncation=True)
    with torch.no_grad():
        outputs = model(**inputs)
    # 对所有 token 做均值池化（Mean Pooling）
    token_embeddings = outputs.last_hidden_state
    attention_mask = inputs["attention_mask"].unsqueeze(-1)
    mean_embedding = (token_embeddings * attention_mask).sum(1) / attention_mask.sum(1)
    return mean_embedding  # [1, 768]

vec = get_sentence_embedding("Hello world")
print(vec.shape)  # -> torch.Size([1, 768])
```

---

## 十大常见任务示例

### 文本分类（情感分析）

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def predict_sentiment(texts):
    inputs = tokenizer(texts, return_tensors="pt", padding=True,
                       truncation=True, max_length=512)
    with torch.no_grad():
        logits = model(**inputs).logits
    probs = torch.softmax(logits, dim=-1)
    results = []
    for i, t in enumerate(texts):
        pid = probs[i].argmax().item()
        results.append({"text": t, "label": model.config.id2label[pid],
                         "score": round(probs[i][pid].item(), 4)})
    return results

print(predict_sentiment(["I love this!", "This is terrible."]))
```

### 文本生成（对话）

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

model_name = "Qwen/Qwen2-1.5B-Instruct"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(
    model_name, torch_dtype=torch.float16, device_map="auto"
)

messages = [
    {"role": "system", "content": "你是一个有用的 AI 助手。"},
    {"role": "user", "content": "请用三句话解释什么是 Transformer？"},
]
text = tokenizer.apply_chat_template(messages, tokenize=False,
                                     add_generation_prompt=True)
inputs = tokenizer(text, return_tensors="pt").to(model.device)

with torch.no_grad():
    output_ids = model.generate(
        **inputs, max_new_tokens=300, temperature=0.7, top_p=0.9,
        do_sample=True, repetition_penalty=1.1,
        pad_token_id=tokenizer.eos_token_id,
    )

new_tokens = output_ids[0][inputs["input_ids"].shape[1]:]
response = tokenizer.decode(new_tokens, skip_special_tokens=True)
print(response)
```

### 命名实体识别（NER）

```python
from transformers import pipeline

ner = pipeline("ner", model="dslim/bert-base-NER", aggregation_strategy="simple")
result = ner("Elon Musk founded SpaceX in 2002 and Tesla Motors in 2003.")
for entity in result:
    print(f"{entity['word']:<20} -> {entity['entity_group']} ({entity['score']:.3f})")
```

### 机器翻译

```python
from transformers import pipeline

# 英译中
translator = pipeline("translation", model="Helsinki-NLP/opus-mt-en-zh")
result = translator("Artificial intelligence is transforming the world.")
print(result[0]["translation_text"])   # -> 人工智能正在改变世界。
```

### 文本摘要

```python
from transformers import pipeline

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
result = summarizer(long_text, max_length=80, min_length=30,
                     do_sample=False, no_repeat_ngram_size=3)
print(result[0]["summary_text"])
```

---

## 微调（Fine-tuning）

微调将预训练模型适配到特定任务和数据上，是 Transformers 最重要的应用场景。

### 微调工作流概览

1. **准备数据**：通过 HF datasets 或自定义 CSV 加载数据集，分词/填充，创建 DataLoader
2. **加载模型**：使用 `AutoModelForTask` 指定 `num_labels`；可选冻结底层
3. **训练配置**：`TrainingArguments` 设置学习率（2e-5）、批次大小（32）、轮次（3~5）等
4. **训练与评估**：`Trainer.train()`，监控 loss 曲线，验证集评估，早停
5. **保存与部署**：`save_model()`，推送到 Hub，量化推理，导出 ONNX

### 完整微调示例：文本分类

```python
from datasets import load_dataset
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, DataCollatorWithPadding,
    EarlyStoppingCallback,
)
import evaluate, numpy as np

# 1. 加载数据集
dataset = load_dataset("imdb")

# 2. Tokenizer + 预处理
MODEL_NAME = "bert-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize_fn(examples):
    return tokenizer(examples["text"], truncation=True, max_length=512)

tokenized_ds = dataset.map(tokenize_fn, batched=True, remove_columns=["text"])
tokenized_ds = tokenized_ds.rename_column("label", "labels")
tokenized_ds.set_format("torch")
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# 3. 加载模型
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME, num_labels=2,
    id2label={0: "NEGATIVE", 1: "POSITIVE"},
    label2id={"NEGATIVE": 0, "POSITIVE": 1},
)

# 4. 评估指标
accuracy = evaluate.load("accuracy")
f1 = evaluate.load("f1")
def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=-1)
    return {
        "accuracy": accuracy.compute(predictions=preds, references=labels)["accuracy"],
        "f1": f1.compute(predictions=preds, references=labels, average="binary")["f1"]
    }

# 5. 训练参数
training_args = TrainingArguments(
    output_dir="./results", num_train_epochs=3,
    per_device_train_batch_size=16, per_device_eval_batch_size=32,
    gradient_accumulation_steps=2, learning_rate=2e-5,
    weight_decay=0.01, warmup_ratio=0.1,
    evaluation_strategy="steps", eval_steps=500,
    save_strategy="steps", save_steps=500,
    load_best_model_at_end=True, metric_for_best_model="f1",
    fp16=True, logging_steps=100, seed=42,
)

# 6. 创建 Trainer 并训练
trainer = Trainer(
    model=model, args=training_args,
    train_dataset=tokenized_ds["train"],
    eval_dataset=tokenized_ds["test"],
    tokenizer=tokenizer, data_collator=data_collator,
    compute_metrics=compute_metrics,
    callbacks=[EarlyStoppingCallback(early_stopping_patience=3)],
)
trainer.train()

# 7. 评估并保存
eval_result = trainer.evaluate()
print(f"准确率: {eval_result['eval_accuracy']:.4f}")
print(f"F1: {eval_result['eval_f1']:.4f}")

trainer.save_model("./my-sentiment-model")
tokenizer.save_pretrained("./my-sentiment-model")
```

### LoRA 参数高效微调（推荐）

**LoRA 原理：** 不更新所有权重矩阵（全量微调需要约 4 倍模型大小的显存），LoRA 将 ΔW 分解为两个低秩矩阵，其中 r 远小于 d（通常 r=8~64），大幅降低训练成本。

**对比：**
- **全量微调**：更新所有参数（如 7B 模型全部参数），极高显存需求
- **LoRA 微调**：冻结原始权重 W，仅训练 B×A 低秩矩阵；仅训练约 0.1%~1% 的参数，低显存，单张 24GB GPU 即可微调 7B 模型

```python
from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer, TrainingArguments
import torch

model_name = "meta-llama/Llama-2-7b-hf"
model = AutoModelForCausalLM.from_pretrained(
    model_name, torch_dtype=torch.float16, device_map="auto",
    load_in_4bit=True,        # 4-bit 量化加载（QLoRA），进一步省显存
)

# 配置 LoRA
lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM, r=16, lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# -> trainable: 4,194,304 || all: 6,742,609,920 || 0.0622%
```

> LoRA 优势：训练不到 1% 的参数，减少 60-70% 显存，加速 2-3 倍，权重文件仅几 MB，同一基础模型可保存多个 LoRA 适配器用于不同任务。

---

## 模型保存、加载与发布

```python
# 本地保存
model.save_pretrained("./my-model")
tokenizer.save_pretrained("./my-model")

# 本地加载
model = AutoModelForSequenceClassification.from_pretrained("./my-model")
tokenizer = AutoTokenizer.from_pretrained("./my-model")

# 发布到 HuggingFace Hub
from huggingface_hub import login
login(token="your_hf_token")
model.push_to_hub("your-username/my-sentiment-model")
tokenizer.push_to_hub("your-username/my-sentiment-model")
```

---

## 性能优化技巧

### 推理加速栈（由浅入深优化）

**Level 1 -- 零成本优化：** `torch.no_grad()` 推理、fp16/bf16 半精度、批量推理、`device_map="auto"` 自动设备分配 -> 1.5-2x 加速

**Level 2 -- 量化（模型压缩）：** bitsandbytes 4-bit/8-bit 量化、GPTQ、AWQ -> 2-4x 加速，显存减半

**Level 3 -- 编译与运行时优化：** `torch.compile()`（PyTorch 2.0）、FlashAttention-2、xFormers、Optimum（TensorRT/ONNX） -> 3-10x 加速

**Level 4 -- 专用推理引擎：** vLLM（高吞吐 LLM 推理）、TGI、TensorRT-LLM、llama.cpp（CPU） -> 生产级最高性能

```python
# 4-bit 量化加载（13B 模型只需约 7GB 显存）
from transformers import BitsAndBytesConfig, AutoModelForCausalLM
import torch

quant_config = BitsAndBytesConfig(
    load_in_4bit=True, bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True, bnb_4bit_quant_type="nf4",
)
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-2-13b-hf",
    quantization_config=quant_config, device_map="auto",
)

# FlashAttention-2 加速
model = AutoModelForCausalLM.from_pretrained(
    "mistralai/Mistral-7B-v0.1",
    attn_implementation="flash_attention_2",
    torch_dtype=torch.bfloat16, device_map="auto",
)

# torch.compile (PyTorch 2.0+)
model = torch.compile(model, mode="reduce-overhead")
```

---

## 常见问题排查

| 错误 | 原因与解决方案 |
|------|---------------|
| CUDA out of memory | 减小 `batch_size`；增大 `gradient_accumulation_steps`；使用 fp16/4-bit；使用更小模型 |
| OSError: model not found | 模型名称错误或网络问题；检查拼写；设置 `HF_ENDPOINT` 镜像；使用本地路径 |
| ValueError: num_labels mismatch | 加载模型时显式指定 `num_labels=<类别数>` |
| tensors on different devices | 使用 `inputs = {k: v.to(model.device) for k, v in inputs.items()}` |
| loss = NaN / loss 不下降 | 检查学习率（过高导致 NaN）；检查标签范围（0~N-1）；添加梯度裁剪 |
| tokenizer 慢 | `pip install tokenizers` 安装 Rust 快速版本；使用 `use_fast=True`（默认） |

---

## 学习路径与总结

### Transformers 学习路径

**阶段 1 -- 入门（1 周）：**
- 安装配置环境
- 运行 Pipeline 完成 5 个任务
- 理解 Tokenizer 流程
- AutoModel 手动推理
- 理解 Encoder/Decoder
- 阅读模型输出结构

**阶段 2 -- 进阶（2 周）：**
- 从 Hub 加载模型
- 文本分类微调实践
- 掌握 Trainer API
- 自定义数据集处理
- 使用 `compute_metrics` 评估
- 保存并发布到 Hub

**阶段 3 -- 高级（3 周）：**
- LoRA / PEFT 微调
- 量化（4-bit/8-bit）
- 多模态模型使用
- 自定义训练循环
- Accelerate 多 GPU 训练
- FlashAttention 加速

**阶段 4 -- 专家（持续）：**
- 自定义模型架构
- 从头预训练
- vLLM 生产部署
- RLHF/DPO 对齐
- 贡献开源模型
- 研究前沿论文

### 关键 API 速查

```python
# 1. 加载分词器
tokenizer = AutoTokenizer.from_pretrained("model_name")

# 2. 编码文本
inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

# 3. 加载模型
model = AutoModelForSequenceClassification.from_pretrained("model_name", num_labels=N)

# 4. 推理
with torch.no_grad():
    outputs = model(**inputs)

# 5. Pipeline
pipe = pipeline("task_name", model="model_name")

# 6. 训练配置
args = TrainingArguments(output_dir="./out", num_train_epochs=3, learning_rate=2e-5)

# 7. 训练
trainer = Trainer(model=model, args=args, train_dataset=ds, compute_metrics=fn)

# 8. 保存
model.save_pretrained("./my-model")
tokenizer.save_pretrained("./my-model")

# 9. 数据集
dataset = load_dataset("dataset_name")
dataset = dataset.map(tokenize_fn, batched=True)

# 10. LoRA
config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj"])
model = get_peft_model(model, config)
```

---

## 参考资源

- [Transformers 官方文档](https://huggingface.co/docs/transformers)
- [Hugging Face NLP Course（免费课程）](https://huggingface.co/learn/nlp-course)
- [Hugging Face Hub 模型库（40 万+）](https://huggingface.co/models)
- [Hugging Face 数据集](https://huggingface.co/datasets)
- [HF 国内镜像站](https://hf-mirror.com)
- [Papers With Code（论文+代码）](https://paperswithcode.com)
