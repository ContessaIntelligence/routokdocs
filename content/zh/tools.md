# 完成一轮工具调用

工具调用让模型提出结构化请求，由你的应用校验参数并执行操作，再将结果交回模型。本页使用只读的天气示例，演示 Chat Completions 的完整消息结构。

## 第一步：声明工具

选择支持工具调用的模型，将以下 JSON 中的模型 ID 替换后发送到 `POST /v1/chat/completions`。鉴权方式见[首次调用](/docs/quickstart)。

```json
{
  "model": "your-tool-capable-model",
  "messages": [
    { "role": "user", "content": "What is the weather in Beijing?" }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather for a city",
        "parameters": {
          "type": "object",
          "properties": { "city": { "type": "string" } },
          "required": ["city"],
          "additionalProperties": false
        }
      }
    }
  ]
}
```

## 第二步：读取并执行工具请求

模型可能直接回答，也可能返回 `choices[0].message.tool_calls`。一次工具请求的消息示例：

```json
{
  "role": "assistant",
  "content": null,
  "tool_calls": [
    {
      "id": "call_example",
      "type": "function",
      "function": {
        "name": "get_weather",
        "arguments": "{\"city\":\"Beijing\"}"
      }
    }
  ]
}
```

`arguments` 是 JSON 字符串。先解析，再验证工具名、参数类型和业务权限。这里假设天气服务返回北京 20°C；实际应用应执行自己的工具，不能把示例数据作为真实查询结果。

## 第三步：回传结果并获取回答

保留原始 assistant 消息，用实际返回的调用 ID 关联工具结果，再次请求同一接口：

```json
{
  "model": "your-tool-capable-model",
  "messages": [
    { "role": "user", "content": "What is the weather in Beijing?" },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [
        {
          "id": "call_example",
          "type": "function",
          "function": {
            "name": "get_weather",
            "arguments": "{\"city\":\"Beijing\"}"
          }
        }
      ]
    },
    {
      "role": "tool",
      "tool_call_id": "call_example",
      "content": "{\"city\":\"Beijing\",\"temperature_c\":20}"
    }
  ]
}
```

从 `choices[0].message.content` 读取回答。本例不在第二轮提供工具定义；需要持续调用工具时，继续携带 tools，并设置总轮数和费用上限。

## 应用需要处理的情况

- 多个 tool_calls：分别执行，并回传与每个 ID 对应的结果。
- 未返回工具：按普通文字响应处理。
- 参数无效或工具失败：返回可理解的错误结果，不执行未授权操作。
- 流式工具调用：按调用索引收集名称和参数，完整校验后再执行。

工具参数属于不可信输入，不应直接拼接为 SQL、shell 命令或任意 URL。涉及写入、支付等操作时，仍需应用自己的权限与确认机制。

协议背景见 [OpenAI 工具调用文档](https://developers.openai.com/api/docs/guides/function-calling)。其他协议的消息格式及模型能力需单独验证。
