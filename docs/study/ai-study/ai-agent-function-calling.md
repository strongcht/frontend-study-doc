# 工具调用 Function Calling

## 概述

Function Calling 是让 LLM 使用外部工具的核心机制。它允许模型决定何时调用工具、调用哪个工具、传递什么参数。

## 为什么需要 Function Calling

LLM 是知识渊博的"顾问"，但缺乏行动能力。它们不能：

- 获取实时信息（天气、股价）
- 执行复杂计算
- 操作外部系统（发邮件、读写文件）

Function Calling 赋予 LLM 一双"手"，克服其固有限制，执行真实任务。

---

## 工作原理

Function Calling 的基本流程涉及四个关键阶段：

1. **工具定义（Tool Definition）** — 描述工具的功能、参数和返回值
2. **工具选择（Tool Selection）** — LLM 根据用户问题选择合适的工具
3. **参数提取（Parameter Extraction）** — LLM 从问题中提取所需参数
4. **结果处理（Result Handling）** — 工具执行结果被整合到最终回答中

**示例流程**：用户问"北京今天天气如何？" → LLM 识别需要天气工具 → 提取 `city="北京"`, `date="今天"` → 调用天气 API → 综合生成友好回复。

---

## 工具定义与描述编写

好的工具定义就像一份清晰的使用说明书，应告诉 LLM：工具做什么、何时使用、需要什么参数、参数格式。

### 工具定义结构

```python
weather_tool = {
    "name": "get_weather",
    "description": "获取指定城市的天气信息",
    "parameters": {
        "type": "object",
        "properties": {
            "city": {
                "type": "string",
                "description": "城市名称，如'北京'、'上海'"
            },
            "date": {
                "type": "string",
                "description": "日期，格式'YYYY-MM-DD'，或'今天'、'明天'",
                "enum": ["今天", "明天", "后天"]
            }
        },
        "required": ["city"]
    }
}
```

### 描述编写最佳实践

- **清晰具体** — 避免"查询天气"等模糊描述，应说明返回哪些信息（温度、湿度、风速、天气状况）
- **详细参数说明** — 包含示例和格式要求
- **使用 enum 约束选项** — 对于有限选择，enum 帮助 LLM 正确选择
- **提供示例值** — 展示预期格式如 `'YYYY-MM-DD'`

### 更多工具定义示例

**计算器工具：**

```python
calculator_tool = {
    "name": "calculate",
    "description": "执行数学计算，支持加减乘除、幂运算等基本运算",
    "parameters": {
        "type": "object",
        "properties": {
            "expression": {
                "type": "string",
                "description": "数学表达式，如'2 + 3 * 4'、'sqrt(16)'、'sin(30)'"
            }
        },
        "required": ["expression"]
    }
}
```

**搜索工具：**

```python
search_tool = {
    "name": "search_web",
    "description": "在互联网上搜索最新信息",
    "parameters": {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "搜索关键词，尽量具体明确"
            },
            "num_results": {
                "type": "integer",
                "description": "返回结果数量，默认为5",
                "default": 5,
                "minimum": 1,
                "maximum": 10
            }
        },
        "required": ["query"]
    }
}
```

**文件操作工具：**

```python
file_tool = {
    "name": "read_file",
    "description": "读取指定文件的内容",
    "parameters": {
        "type": "object",
        "properties": {
            "file_path": {
                "type": "string",
                "description": "文件的完整路径，如'/home/user/document.txt'"
            },
            "encoding": {
                "type": "string",
                "description": "文件编码，默认为'utf-8'",
                "default": "utf-8"
            }
        },
        "required": ["file_path"]
    }
}
```

### 工具定义最佳实践总结

| 要素 | 建议 |
|------|------|
| **名称** | 使用动词前缀，如 `get_`、`calculate_`、`search_` |
| **描述** | 说明用途、适用场景和限制 |
| **参数验证** | 定义类型、范围和格式要求 |
| **默认值** | 为可选参数提供合理默认值 |
| **错误考虑** | 记录可能的错误和约束 |

### 工具定义验证

```python
def validate_tool_definition(tool_def):
    """验证工具定义是否完整"""
    required_fields = ["name", "description", "parameters"]

    for field in required_fields:
        if field not in tool_def:
            return False, f"缺少必要字段: {field}"

    if "properties" not in tool_def["parameters"]:
        return False, "参数定义缺少properties字段"

    return True, "工具定义完整"

is_valid, message = validate_tool_definition(weather_tool)
print(f"验证结果: {is_valid}, 消息: {message}")
```

---

## 参数提取与验证

### 参数提取的挑战

- **信息缺失** — 用户未提供所有必填信息
- **格式不匹配** — 用户的格式与工具要求不同
- **歧义性** — 同一信息可能有多种解读
- **上下文依赖** — 参数可能需要对话历史

### 验证方法

#### 1. 类型验证

```python
def validate_parameters(params, tool_def):
    """验证参数类型"""
    errors = []
    for param_name, param_def in tool_def["parameters"]["properties"].items():
        if param_name in params:
            param_value = params[param_name]
            expected_type = param_def.get("type")
            if expected_type == "string" and not isinstance(param_value, str):
                errors.append(f"参数'{param_name}'应为字符串类型")
            elif expected_type == "integer" and not isinstance(param_value, int):
                errors.append(f"参数'{param_name}'应为整数类型")
            elif expected_type == "number" and not isinstance(param_value, (int, float)):
                errors.append(f"参数'{param_name}'应为数字类型")
            elif expected_type == "boolean" and not isinstance(param_value, bool):
                errors.append(f"参数'{param_name}'应为布尔类型")
    return errors
```

#### 2. 范围验证

```python
def validate_range(params, tool_def):
    """验证参数范围"""
    errors = []
    for param_name, param_def in tool_def["parameters"]["properties"].items():
        if param_name in params:
            param_value = params[param_name]
            if "minimum" in param_def and param_value < param_def["minimum"]:
                errors.append(f"参数'{param_name}'不能小于{param_def['minimum']}")
            if "maximum" in param_def and param_value > param_def["maximum"]:
                errors.append(f"参数'{param_name}'不能大于{param_def['maximum']}")
            if "enum" in param_def and param_value not in param_def["enum"]:
                errors.append(f"参数'{param_name}'必须是{param_def['enum']}中的一个")
    return errors
```

#### 3. 必填参数验证

```python
def validate_required(params, tool_def):
    """验证必填参数"""
    errors = []
    required_params = tool_def["parameters"].get("required", [])
    for param_name in required_params:
        if param_name not in params:
            errors.append(f"缺少必填参数: {param_name}")
    return errors
```

### 完整的 ParameterValidator 类

综合所有验证检查的完整验证器：

```python
class ParameterValidator:
    """参数验证器"""
    def __init__(self, tool_def):
        self.tool_def = tool_def

    def validate(self, params):
        """执行完整的参数验证"""
        all_errors = []
        all_errors.extend(self.validate_required(params))
        all_errors.extend(self.validate_type(params))
        all_errors.extend(self.validate_range(params))
        all_errors.extend(self.validate_extra(params))
        return len(all_errors) == 0, all_errors

    def validate_required(self, params):
        """验证必填参数"""
        errors = []
        required_params = self.tool_def["parameters"].get("required", [])
        for param_name in required_params:
            if param_name not in params or params[param_name] is None:
                errors.append(f"缺少必填参数: {param_name}")
        return errors

    def validate_type(self, params):
        """验证参数类型"""
        errors = []
        for param_name, param_value in params.items():
            if param_name in self.tool_def["parameters"]["properties"]:
                param_def = self.tool_def["parameters"]["properties"][param_name]
                expected_type = param_def.get("type")
                if expected_type == "string" and not isinstance(param_value, str):
                    errors.append(f"参数'{param_name}'应为字符串类型，实际为{type(param_value).__name__}")
                elif expected_type == "integer" and not isinstance(param_value, int):
                    errors.append(f"参数'{param_name}'应为整数类型，实际为{type(param_value).__name__}")
                elif expected_type == "number" and not isinstance(param_value, (int, float)):
                    errors.append(f"参数'{param_name}'应为数字类型，实际为{type(param_value).__name__}")
                elif expected_type == "boolean" and not isinstance(param_value, bool):
                    errors.append(f"参数'{param_name}'应为布尔类型，实际为{type(param_value).__name__}")
        return errors

    def validate_range(self, params):
        """验证参数范围"""
        errors = []
        for param_name, param_value in params.items():
            if param_name in self.tool_def["parameters"]["properties"]:
                param_def = self.tool_def["parameters"]["properties"][param_name]
                if "minimum" in param_def and param_value < param_def["minimum"]:
                    errors.append(f"参数'{param_name}'不能小于{param_def['minimum']}")
                if "maximum" in param_def and param_value > param_def["maximum"]:
                    errors.append(f"参数'{param_name}'不能大于{param_def['maximum']}")
                if "enum" in param_def and param_value not in param_def["enum"]:
                    errors.append(f"参数'{param_name}'必须是{param_def['enum']}中的一个")
        return errors

    def validate_extra(self, params):
        """检查未定义的额外参数"""
        errors = []
        defined_params = set(self.tool_def["parameters"]["properties"].keys())
        provided_params = set(params.keys())
        extra_params = provided_params - defined_params
        if extra_params:
            errors.append(f"提供了未定义的参数: {', '.join(extra_params)}")
        return errors

# 使用示例
validator = ParameterValidator(weather_tool)
params = {"city": "北京", "date": "明天", "extra": "不应该有的参数"}
is_valid, errors = validator.validate(params)
if is_valid:
    print("参数验证通过")
else:
    print("参数验证失败:")
    for error in errors:
        print(f"  - {error}")
```

### 参数修复策略

验证失败时有四种策略：

1. **询问用户** — 获取缺失/错误的参数
2. **使用默认值** — 为可选参数填充默认值
3. **智能推断** — 从上下文中推断合理值
4. **格式转换** — 将用户输入转换为所需格式

```python
def fix_parameters(params, errors, tool_def):
    """尝试修正参数错误"""
    fixed_params = params.copy()
    for error in errors:
        if "缺少必填参数" in error:
            param_name = error.split(": ")[1]
            if param_name == "date":
                fixed_params[param_name] = "今天"
        elif "应为字符串类型" in error:
            param_name = error.split("'")[1]
            fixed_params[param_name] = str(params[param_name])
    return fixed_params
```

---

## 错误处理与重试机制

### 常见工具调用错误

| 错误类型 | 示例 |
|---------|------|
| **网络错误** | API 超时、连接失败 |
| **参数错误** | 验证失败、格式不正确 |
| **认证错误** | API 密钥无效、权限不足 |
| **资源错误** | 服务不可用、触发速率限制 |
| **逻辑错误** | 工具内部逻辑缺陷 |

### 1. 分级错误处理（ErrorHandler）

```python
class ErrorHandler:
    """错误处理器"""
    def handle(self, error, context):
        """处理错误"""
        error_type = self.classify_error(error)
        if error_type == "network":
            return self.handle_network_error(error, context)
        elif error_type == "parameter":
            return self.handle_parameter_error(error, context)
        elif error_type == "authentication":
            return self.handle_auth_error(error, context)
        elif error_type == "resource":
            return self.handle_resource_error(error, context)
        else:
            return self.handle_unknown_error(error, context)

    def classify_error(self, error):
        """分类错误类型"""
        error_str = str(error).lower()
        if any(word in error_str for word in ["timeout", "connection", "network"]):
            return "network"
        elif any(word in error_str for word in ["parameter", "invalid", "missing"]):
            return "parameter"
        elif any(word in error_str for word in ["auth", "key", "permission"]):
            return "authentication"
        elif any(word in error_str for word in ["limit", "quota", "unavailable"]):
            return "resource"
        else:
            return "unknown"

    def handle_network_error(self, error, context):
        return {"success": False, "error": "网络连接失败，请检查网络后重试",
                "retryable": True, "retry_after": 5}

    def handle_parameter_error(self, error, context):
        return {"success": False, "error": f"参数错误: {str(error)}",
                "retryable": False, "suggestion": "请检查输入参数是否正确"}
```

### 2. 用户友好的错误消息

```python
def user_friendly_error(error):
    """生成用户友好的错误消息"""
    error_map = {
        "timeout": "请求超时，请稍后重试",
        "connection_error": "网络连接失败，请检查网络",
        "invalid_api_key": "API 密钥无效，请检查配置",
        "rate_limit_exceeded": "调用频率过高，请稍后再试",
        "invalid_parameters": "输入参数不正确，请检查后重试"
    }
    error_str = str(error).lower()
    for key, message in error_map.items():
        if key in error_str:
            return message
    return "系统繁忙，请稍后重试"
```

### 3. 指数退避重试

```python
import time
import random

class ExponentialBackoffRetry:
    """指数退避重试"""
    def __init__(self, max_retries=3, base_delay=1, max_delay=30):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay

    def retry(self, func, *args, **kwargs):
        """执行带重试的函数调用"""
        last_error = None
        for attempt in range(self.max_retries):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                last_error = e
                if not self.is_retryable(e):
                    raise
                if attempt == self.max_retries - 1:
                    break
                delay = min(
                    self.base_delay * (2 ** attempt) + random.uniform(0, 1),
                    self.max_delay
                )
                print(f"第{attempt + 1}次尝试失败，{delay:.1f}秒后重试...")
                time.sleep(delay)
        raise last_error

    def is_retryable(self, error):
        """判断错误是否可重试"""
        error_str = str(error).lower()
        retryable_errors = ["timeout", "connection", "busy", "temporarily"]
        for retryable_error in retryable_errors:
            if retryable_error in error_str:
                return True
        return False
```

### 4. 熔断器模式（Circuit Breaker）

防止级联故障压垮系统：

```python
class CircuitBreaker:
    """熔断器"""
    def __init__(self, failure_threshold=5, reset_timeout=60):
        self.failure_threshold = failure_threshold
        self.reset_timeout = reset_timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half-open

    def execute(self, func, *args, **kwargs):
        """通过熔断器执行函数"""
        if self.state == "open":
            if self.should_try_reset():
                self.state = "half-open"
            else:
                raise Exception("熔断器开启，服务暂时不可用")
        try:
            result = func(*args, **kwargs)
            if self.state == "half-open":
                self.state = "closed"
                self.failure_count = 0
            return result
        except Exception as e:
            self.record_failure()
            raise e

    def record_failure(self):
        """记录失败"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = "open"

    def should_try_reset(self):
        """检查是否应该尝试重置"""
        if self.last_failure_time is None:
            return True
        elapsed = time.time() - self.last_failure_time
        return elapsed > self.reset_timeout
```

---

## 完整的工具执行框架

将所有组件整合为统一框架：

```python
class ToolExecutor:
    """工具执行器"""
    def __init__(self):
        self.tools = {}
        self.validator = ParameterValidator
        self.error_handler = ErrorHandler()
        self.retry = ExponentialBackoffRetry()
        self.breaker = CircuitBreaker()

    def register_tool(self, name, tool_def, func):
        """注册工具"""
        self.tools[name] = {
            "definition": tool_def,
            "function": func
        }

    def execute_tool(self, tool_name, params):
        """执行工具"""
        if tool_name not in self.tools:
            return {"success": False, "error": f"工具'{tool_name}'未注册"}

        tool_info = self.tools[tool_name]
        tool_def = tool_info["definition"]
        tool_func = tool_info["function"]

        # 验证参数
        validator = self.validator(tool_def)
        is_valid, errors = validator.validate(params)
        if not is_valid:
            return {"success": False, "error": "参数验证失败", "details": errors}

        # 通过熔断器和重试机制执行
        try:
            def execute_with_retry():
                return self.breaker.execute(
                    lambda: self.retry.retry(tool_func, **params)
                )
            result = execute_with_retry()
            return {"success": True, "result": result, "tool": tool_name}
        except Exception as e:
            error_response = self.error_handler.handle(e, {
                "tool": tool_name, "params": params
            })
            return {
                "success": False, "error": error_response["error"],
                "retryable": error_response.get("retryable", False),
                "suggestion": error_response.get("suggestion", "")
            }

    def handle_user_request(self, user_input):
        """处理用户请求（简化版）"""
        if "天气" in user_input:
            tool_name = "get_weather"
            if "北京" in user_input:
                params = {"city": "北京", "date": "今天"}
            elif "上海" in user_input:
                params = {"city": "上海", "date": "今天"}
            else:
                params = {"city": "北京", "date": "今天"}
        else:
            return "抱歉，我无法处理这个请求"

        result = self.execute_tool(tool_name, params)
        if result["success"]:
            weather = result["result"]
            return f"{params['city']}今天天气：{weather['condition']}，温度{weather['temperature']}°C"
        else:
            return f"获取天气信息失败：{result['error']}"

# 使用示例
executor = ToolExecutor()

def mock_weather_api(city, date):
    """模拟天气API"""
    time.sleep(0.1)
    return {"temperature": 22, "condition": "多云"}

executor.register_tool("get_weather", weather_tool, mock_weather_api)
response = executor.handle_user_request("北京今天天气怎么样？")
print(response)
```

---

## 总结

Function Calling 是 AI Agent 与外部世界交互的核心桥梁。掌握好工具定义、参数验证、错误处理和重试机制，是构建可靠 Agent 系统的关键基础。
