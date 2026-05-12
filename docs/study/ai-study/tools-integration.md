# AI Agent 工具与外部集成

本章介绍 Agent 如何与外部世界交互。工具调用能力是 Agent 与外部环境连接的关键。通过集成各种工具，Agent 能够执行代码、访问 API、操作文件系统等。

---

## Computer Use

Computer Use 让 Agent 能够像人类一样操作计算机界面，包括浏览器、桌面应用等图形界面。这是实现通用人工智能（AGI）的重要一步。

### 核心能力

- **屏幕截图解析**：理解屏幕上的内容，识别可交互元素
- **GUI 元素识别**：识别按钮、输入框、菜单等界面元素
- **鼠标/键盘控制**：模拟人类操作，执行点击、输入等动作
- **浏览器自动化**：网页导航、表单填写、搜索等

### 工作原理

Computer Use 的工作流程可以概括为：观察、理解、决策、执行。

1. **屏幕截图**：捕获当前屏幕或窗口的内容
2. **视觉分析**：使用视觉模型分析截图，识别界面元素和状态
3. **决策**：基于任务目标，决定下一步操作
4. **执行**：执行鼠标点击、键盘输入等动作

循环执行直到任务完成。

### 代码实现

```python
class ComputerUseAgent:
    """
    Computer Use Agent 实现
    能够像人类一样操作计算机界面
    """

    def __init__(self, vision_model, action_executor, planner):
        self.vision_model = vision_model
        self.action_executor = action_executor
        self.planner = planner
        self.max_steps = 100

    def observe(self, screenshot):
        """
        解析屏幕截图，识别可交互元素
        :param screenshot: 屏幕截图图像
        :return: 界面元素列表
        """
        analysis = self.vision_model.analyze(screenshot)
        return analysis.elements

    def act(self, action):
        """执行动作"""
        return self.action_executor.execute(action)

    def run(self, task):
        """
        运行任务循环
        :param task: 任务描述
        :return: 任务结果
        """
        self.planner.set_task(task)

        for step in range(self.max_steps):
            screenshot = self.get_screen()
            elements = self.observe(screenshot)
            action = self.planner.decide_action(elements)

            if action.is_final:
                return action.result

            self.act(action)
            self.wait_for_update()

        return "达到最大步骤限制"


class VisionModel:
    """视觉模型：分析屏幕截图"""

    def analyze(self, screenshot):
        """
        分析屏幕截图
        返回界面元素列表
        """
        prompt = """
分析这个屏幕截图，识别所有可交互的界面元素。
包括：按钮、输入框、链接、菜单等。

对于每个元素，请提供：
1. 类型（button、input、link 等）
2. 位置（边界框坐标）
3. 内容（按钮文字、输入框占位符等）
4. 可交互性（是否可见、是否启用）
"""
        result = self.vision_model.analyze_image(screenshot, prompt)
        return ScreenAnalysisResult(elements=result.elements)


class ActionExecutor:
    """动作执行器：执行鼠标键盘操作"""

    def execute(self, action):
        if action.type == "click":
            self.mouse.click(action.x, action.y)
        elif action.type == "type":
            self.keyboard.type_text(action.text)
        elif action.type == "scroll":
            self.mouse.scroll(action.direction, action.amount)
        elif action.type == "press":
            self.keyboard.press_key(action.key)
        return ActionResult(success=True)


class Planner:
    """规划器：决定下一步行动"""

    def __init__(self, llm):
        self.llm = llm
        self.task = None
        self.history = []

    def set_task(self, task):
        self.task = task
        self.history = []

    def decide_action(self, elements):
        prompt = f"""
当前任务：{self.task}

已执行的历史动作：
{self.history}

当前界面上的可交互元素：
{elements}

请决定下一步动作。
如果任务已完成，返回 is_final=True。
否则，返回要执行的动作（type、坐标、参数等）。
"""
        response = self.llm.generate(prompt)
        return Action.parse(response)
```

### 应用场景

Computer Use 特别适合以下场景：

- **网页自动化**：如自动填写表单、爬取数据、执行网页操作
- **桌面应用操作**：如打开文件、编辑文档、操作软件
- **测试自动化**：如自动执行 UI 测试、回归测试

> **注意**：Computer Use 目前仍在发展中，存在执行速度慢、偶尔出错等问题。对于有明确 API 的场景，直接调用 API 通常比 Computer Use 更高效。

---

## MCP 协议详解

MCP（Model Context Protocol）是一种开放标准协议，使得 AI 模型能够安全地与外部工具和数据源连接。MCP 的设计目标是成为 AI 领域的 "USB 接口"。

### 核心设计理念

- **标准化**：统一的协议格式，不同的 Agent 和工具可以互操作
- **安全性**：明确的权限控制，Agent 只能访问授权的资源
- **可扩展性**：易于添加新的工具和数据源

### 架构组件

- **MCP Host**：运行 AI 应用的宿主环境，如 Claude Desktop、AI 编码助手等
- **MCP Client**：与 MCP Server 保持 1:1 连接的客户端
- **MCP Server**：提供工具和资源的服务端程序

### 通信流程

1. **连接建立**：Client 与 Server 建立连接，交换能力信息
2. **工具发现**：Client 查询 Server 提供哪些工具和资源
3. **工具调用**：Client 发送工具调用请求，Server 执行并返回结果
4. **资源访问**：Client 可以读写 Server 提供的资源

### MCP Server 实现示例

```python
from mcp.server import Server
from mcp.types import Tool, Resource
import asyncio

# 创建 MCP Server 实例
app = Server("filesystem")

# 定义文件系统工具
@app.list_tools()
async def list_tools():
    """列出所有可用工具"""
    return [
        Tool(
            name="read_file",
            description="读取文件内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件路径"
                    },
                    "encoding": {
                        "type": "string",
                        "description": "文件编码，默认为 utf-8",
                        "default": "utf-8"
                    }
                },
                "required": ["path"]
            }
        ),
        Tool(
            name="write_file",
            description="写入文件内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "文件路径"
                    },
                    "content": {
                        "type": "string",
                        "description": "文件内容"
                    }
                },
                "required": ["path", "content"]
            }
        ),
        Tool(
            name="list_directory",
            description="列出目录内容",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {
                        "type": "string",
                        "description": "目录路径"
                    }
                }
            }
        )
    ]

@app.call_tool()
async def call_tool(name, arguments):
    """执行工具调用"""
    if name == "read_file":
        return await read_file(arguments["path"], arguments.get("encoding", "utf-8"))
    elif name == "write_file":
        return await write_file(arguments["path"], arguments["content"])
    elif name == "list_directory":
        return await list_directory(arguments["path"])
    else:
        raise ValueError(f"Unknown tool: {name}")

async def read_file(path, encoding):
    with open(path, "r", encoding=encoding) as f:
        content = f.read()
    return [{"type": "text", "text": content}]

async def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return [{"type": "text", "text": "File written successfully"}]

async def list_directory(path):
    import os
    entries = os.listdir(path)
    return [{"type": "text", "text": "\n".join(entries)}]

# 运行服务器
if __name__ == "__main__":
    import mcp.server.stdio
    asyncio.run(mcp.server.stdio.serve(app))
```

---

## API 集成模式

Agent 集成外部 API 有三种常见方式：

- **REST API**：最常用的 Web API 风格
- **GraphQL**：提供更灵活的数据查询能力
- **gRPC**：适合高性能场景的远程过程调用

### REST API 集成

REST（Representational State Transfer）是一种 Web API 设计风格，使用 HTTP 方法（GET、POST、PUT、DELETE）进行操作。

```python
import requests
from typing import Dict, Any, Optional


class RESTAPIClient:
    """
    REST API 客户端
    封装 HTTP 请求，提供简洁的调用接口
    """

    def __init__(self, base_url: str, headers: Optional[Dict] = None):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()

        default_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if headers:
            default_headers.update(headers)
        self.session.headers.update(default_headers)

    def call(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict] = None,
        data: Optional[Dict] = None,
        **kwargs
    ) -> Dict[Any, Any]:
        """发送 API 请求"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        response = self.session.request(
            method=method.upper(),
            url=url,
            params=params,
            json=data,
            **kwargs
        )

        response.raise_for_status()

        if response.content:
            return response.json()
        return {}

    def get(self, endpoint: str, params: Optional[Dict] = None):
        return self.call("GET", endpoint, params=params)

    def post(self, endpoint: str, data: Dict):
        return self.call("POST", endpoint, data=data)

    def put(self, endpoint: str, data: Dict):
        return self.call("PUT", endpoint, data=data)

    def delete(self, endpoint: str, params: Optional[Dict] = None):
        return self.call("DELETE", endpoint, params=params)


class APIAgent:
    """
    API Agent
    通过自然语言调用外部 API
    """

    def __init__(self, api_client: RESTAPIClient):
        self.api_client = api_client
        self.tool_descriptions = self.define_tools()

    def define_tools(self):
        """定义 Agent 可用的工具"""
        return [
            {
                "name": "get_weather",
                "description": "获取指定城市的天气信息",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "城市名称，如 Beijing、Shanghai"
                        }
                    },
                    "required": ["city"]
                }
            },
            {
                "name": "get_forecast",
                "description": "获取指定城市的天气预报",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "city": {
                            "type": "string",
                            "description": "城市名称"
                        },
                        "days": {
                            "type": "integer",
                            "description": "预报天数，默认为 3",
                            "default": 3
                        }
                    },
                    "required": ["city"]
                }
            }
        ]

    def execute_tool(self, tool_name: str, arguments: Dict):
        """执行工具调用"""
        if tool_name == "get_weather":
            return self.api_client.get(f"/weather/{arguments['city']}")
        elif tool_name == "get_forecast":
            params = {"days": arguments.get("days", 3)}
            return self.api_client.get(f"/forecast/{arguments['city']}", params=params)
        else:
            raise ValueError(f"Unknown tool: {tool_name}")
```

### API 集成最佳实践

- **错误处理**：优雅处理网络错误、超时、服务不可用等情况
- **重试机制**：对于临时性错误，实现指数退避重试
- **限流控制**：遵守 API 的速率限制，避免被封禁
- **缓存策略**：对频繁请求的数据实施缓存，减少 API 调用
- **安全考虑**：敏感信息如 API Key 不要硬编码，使用环境变量管理

---

## 章节小结

本章介绍了 Agent 与外部世界交互的核心技术：

- **Computer Use** 让 Agent 能够操作 GUI 界面，适用于需要与图形应用交互的场景
- **MCP 协议** 提供了标准化的工具接入方式，是 Agent 时代的 "USB 接口"
- **API 集成** 是最常见的外部系统集成方式，包括 REST、GraphQL、gRPC 等

选择合适的集成方式需要根据具体场景：

- 对于图形界面操作，Computer Use 是通用解决方案
- 对于工具标准化接入，MCP 是未来的发展方向
- 对于 Web API 集成，REST API 仍是最主流的选择
