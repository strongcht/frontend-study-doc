# Python 智能体环境配置

## 概述

本文介绍如何搭建完整的 Python AI Agent 开发环境，包括版本选择、虚拟环境、包管理、API 密钥管理和推荐的开发工具。

---

## Python 版本选择

AI Agent 开发推荐 **Python 3.9 或更高版本**：

| 版本 | 特点 |
|------|------|
| **Python 3.9** | 最佳稳定性和兼容性 |
| **Python 3.10** | 性能改进和新特性 |
| **Python 3.11+** | 最新版本，最佳性能 |

---

## 安装 Python

### Windows

- 从 Python 官方网站下载
- 安装时**必须勾选"Add Python to PATH"**
- 验证：`python --version`

### macOS

通过 Homebrew 安装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install python@3.9
python3 --version
```

### Linux

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.9 python3-pip

# CentOS/RHEL
sudo yum install python39 python39-pip

# 验证
python3 --version
```

---

## 虚拟环境配置

### 使用 uv（推荐）

```bash
pip install uv
uv venv
source .venv/bin/activate        # macOS/Linux
.venv\Scripts\activate           # Windows
```

### 使用 venv 或 conda

```bash
python -m venv venv
# 或
conda create -n ai-agent python=3.9
conda activate ai-agent
```

退出虚拟环境：`deactivate`

---

## 包管理（pip）

```bash
pip install --upgrade pip
pip install package_name
pip install package_name==1.2.3
pip install -r requirements.txt
pip list
pip freeze > requirements.txt
```

---

## 推荐项目目录结构

```
ai-agent-project/
├── .env
├── .gitignore
├── requirements.txt
├── README.md
├── src/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py
│   │   └── weather_agent.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── calculator.py
│   │   └── web_search.py
│   ├── memory/
│   │   ├── __init__.py
│   │   ├── short_term.py
│   │   └── vector_memory.py
│   └── utils/
│       ├── __init__.py
│       ├── config.py
│       └── logger.py
├── tests/
│   ├── __init__.py
│   ├── test_agents.py
│   └── test_tools.py
├── examples/
│   ├── basic_agent.py
│   └── multi_tool_agent.py
└── notebooks/
    └── experiments.ipynb
```

---

## 核心库安装

### requirements.txt

```txt
# 基础
python-dotenv>=1.0.0
pydantic>=2.0.0
loguru>=0.7.0

# AI/ML
openai>=1.0.0
anthropic>=0.7.0
google-generativeai>=0.3.0
sentence-transformers>=2.2.0
chromadb>=0.4.0

# Agent 框架
langchain>=0.1.0
langchain-community>=0.0.10
langchain-openai>=0.0.5
llama-index>=0.10.0
semantic-kernel>=0.9.0

# 工具
requests>=2.31.0
beautifulsoup4>=4.12.0
pandas>=2.0.0
numpy>=1.24.0

# 开发工具
pytest>=7.4.0
black>=23.0.0
flake8>=6.0.0
jupyter>=1.0.0
```

安装所有依赖：

```bash
pip install -r requirements.txt
```

---

## 主要库介绍

### LangChain

最流行的 AI Agent 框架，提供构建链和代理应用的工具：

```python
from langchain.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool

llm = ChatOpenAI(temperature=0.7, model="gpt-3.5-turbo")

tools = [
    Tool(name="计算器", func=lambda x: str(eval(x)), description="用于数学计算")
]

agent = initialize_agent(
    tools=tools, llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, verbose=True
)

result = agent.run("计算 25 的平方根")
```

### LlamaIndex

专注于文档索引和检索，适合基于文档的问答系统：

```python
from llama_index import VectorStoreIndex, SimpleDirectoryReader

documents = SimpleDirectoryReader("./data").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("文档中提到了哪些AI技术？")
```

### Semantic Kernel

微软的框架，强调可扩展性和企业应用：

```python
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAITextCompletion

kernel = sk.Kernel()
kernel.add_text_completion_service("dv", OpenAITextCompletion("text-davinci-003", api_key))
```

---

## 安装验证脚本

```python
import sys

def check_package(package_name, import_name=None):
    import_name = import_name or package_name
    try:
        __import__(import_name)
        print(f"{package_name} 安装成功")
        return True
    except ImportError:
        print(f"{package_name} 未安装")
        return False

def main():
    print("检查 AI Agent 开发环境...")
    python_version = sys.version_info
    print(f"Python 版本: {python_version.major}.{python_version.minor}.{python_version.micro}")
    if python_version.major == 3 and python_version.minor >= 9:
        print("Python 版本符合要求 (>=3.9)")
    else:
        print("Python 版本不符合要求，需要 3.9 或更高版本")

    check_package("dotenv", "dotenv")
    check_package("pydantic")
    check_package("loguru")
    check_package("openai")
    check_package("anthropic")
    check_package("chromadb")
    check_package("sentence_transformers", "sentence_transformers")
    check_package("langchain")
    check_package("llama_index", "llama_index")
    check_package("requests")
    check_package("pandas")
    check_package("numpy")

if __name__ == "__main__":
    main()
```

---

## 常见安装问题

### 安装速度慢 — 使用国内镜像源

```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
# 或
pip install -r requirements.txt -i https://mirrors.aliyun.com/pypi/simple/
```

### 版本冲突 — 创建新的虚拟环境重新安装

### Apple Silicon (M1/M2/M3) 兼容性

```bash
pip install grpcio==1.48.2
# 或
conda install -c conda-forge grpcio
```

---

## API 密钥管理

### 为什么需要安全管理 API 密钥？

- 防止密钥泄露导致的经济损失
- 不同环境的访问控制
- 团队协作的一致性
- 环境隔离（开发/测试/生产）

### 使用 .env 文件（推荐）

创建 `.env` 文件：

```
OPENAI_API_KEY=sk-你的OpenAI密钥
ANTHROPIC_API_KEY=你的Claude密钥
GOOGLE_API_KEY=你的Gemini密钥
SERPAPI_API_KEY=你的搜索API密钥
APP_ENV=development
LOG_LEVEL=INFO
DEBUG=true
VECTOR_DB_PATH=./data/vector_db
MAX_MEMORY_ITEMS=1000
```

### .gitignore 必须排除

```
.env
__pycache__/
env/
venv/
data/
logs/
.vscode/
.idea/
```

### 使用 python-dotenv 加载环境变量

```python
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path('.') / '.env'
load_dotenv(dotenv_path=env_path)

class Config:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    APP_ENV = os.getenv("APP_ENV", "development")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    DEBUG = os.getenv("DEBUG", "false").lower() == "true"
    VECTOR_DB_PATH = os.getenv("VECTOR_DB_PATH", "./data/vector_db")
    MAX_MEMORY_ITEMS = int(os.getenv("MAX_MEMORY_ITEMS", "1000"))

    @classmethod
    def validate(cls):
        missing = []
        if not cls.OPENAI_API_KEY:
            missing.append("OPENAI_API_KEY")
        if missing:
            raise ValueError(f"缺少必要的环境变量: {', '.join(missing)}")
```

### 在代码中使用环境变量

```python
import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY 环境变量未设置")

client = OpenAI(api_key=api_key)
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content": "你好"}]
)
```

### 多环境配置

支持 `.env.development`、`.env.production` 和本地覆盖文件（`.env.*.local`），按顺序加载，使用 `ConfigManager` 类管理。

### 密钥轮换与监控

`APIKeyManager` 类跟踪密钥年龄，支持定期轮换（如每 30 天），并维护轮换历史，适用于生产环境。

---

## 推荐开发工具

### 代码编辑器 / IDE

**VS Code（推荐）** 配合扩展：

| 扩展 | 用途 |
|------|------|
| Python | Python 语言支持 |
| Pylance | 类型检查和智能提示 |
| Jupyter | Notebook 支持 |
| GitLens | Git 增强 |
| Prettier | 代码格式化 |
| Code Spell Checker | 拼写检查 |
| Rainbow CSV | CSV 高亮 |
| Thunder Client | API 测试 |

VS Code 设置包括：flake8 代码检查、black 格式化（行长度 88）、pytest 启用、保存时自动格式化、排除 `__pycache__` 和 `.pytest_cache` 等目录。

**PyCharm Professional** 也很推荐，提供调试、数据库工具和科学计算支持。

### 版本控制 — Git

```bash
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"
git init
git add .
git commit -m "初始提交：AI Agent 项目"
git remote add origin https://github.com/你的用户名/ai-agent-project.git
git push -u origin main
```

### 调试工具

**pdb**：使用 `pdb.set_trace()` 设置断点。常用命令：

| 命令 | 功能 |
|------|------|
| `n` | 下一行 |
| `s` | 进入函数 |
| `c` | 继续执行 |
| `l` | 列出代码 |
| `p` | 打印变量 |
| `q` | 退出 |

**VS Code launch.json** 配置调试方案，支持当前文件和测试运行，可加载 `.env` 文件。

### 测试（pytest）

```python
import pytest
from src.agents.base_agent import BaseAgent

def test_agent_initialization():
    agent = BaseAgent(name="测试Agent")
    assert agent.name == "测试Agent"
    assert agent.messages == []
```

运行方式：

```bash
pytest
pytest -v
pytest --cov=src    # 查看覆盖率
```

### 代码质量

- **black**：代码格式化（`black .` 格式化所有文件）
- **flake8**：代码检查（`flake8 src/`）
- **pre-commit**：Git hooks，包括尾部空白检查、文件末尾修复、YAML 检查、大文件检查、black 格式化和 flake8 检查

### 文档工具

- **Jupyter Notebook**：用于实验和文档
- **MkDocs**：项目文档生成，`mkdocs serve` 本地预览

### Docker 容器化

Dockerfile 使用 `python:3.9-slim` 基础镜像，安装依赖，复制源代码，设置 PYTHONPATH。Docker Compose 暴露 8000 端口，通过环境变量传递 API 密钥。

### 监控与日志（loguru）

```python
from loguru import logger
import sys

logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("logs/app_{time}.log", rotation="500 MB", retention="30 days", compression="zip", level="DEBUG")

logger.info("应用启动")
logger.debug(f"配置加载: {config}")
logger.error("API调用失败", exc_info=True)
```
