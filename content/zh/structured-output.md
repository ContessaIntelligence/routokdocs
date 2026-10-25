# 获取结构化输出

当应用需要读取固定字段时，优先选择支持 JSON Schema 的模型。JSON 模式与严格 Schema 约束属于不同能力，接入前需分别确认。

## JSON 模式

将以下请求发送到 `POST /v1/chat/completions`，替换模型 ID，并在提示中明确要求 JSON：

```json
{
  "model": "your-json-capable-model",
  "messages": [
    { "role": "user", "content": "Return a JSON object with name and tags for a notebook." }
  ],
  "response_format": { "type": "json_object" }
}
```

这种模式不规定必须有哪些字段，应用仍需校验结构。

## JSON Schema

以下是完整的 Chat Completions 请求示例：

```json
{
  "model": "your-schema-capable-model",
  "messages": [
    { "role": "user", "content": "Extract the product name: a blue notebook." }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "item",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": { "name": { "type": "string" } },
        "required": ["name"],
        "additionalProperties": false
      }
    }
  }
}
```

成功时，`choices[0].message.content` 通常是一段 JSON 字符串，例如：

```json
{"name":"blue notebook"}
```

## 使用 Responses

Responses 将格式定义放在 `text.format`，不能直接复制 Chat 的顶层 response_format：

```json
{
  "model": "your-schema-capable-model",
  "input": "Extract the product name: a blue notebook.",
  "text": {
    "format": {
      "type": "json_schema",
      "name": "item",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": { "name": { "type": "string" } },
        "required": ["name"],
        "additionalProperties": false
      }
    }
  }
}
```

将请求发送到 `POST /v1/responses`。从 output 中的 output_text 内容项读取文本，或使用 SDK 提供的便利属性。

## 接收结果后

先检查完成状态，再解析 JSON、验证 Schema 和业务约束。拒答、截断、空内容或上游错误应作为独立分支处理，不能通过补括号把不完整结果当成成功。

| 接口 | 读取前检查 | 文本位置 |
| --- | --- | --- |
| Chat Completions | 检查 HTTP 状态、finish_reason 和 message.refusal；输出截断或拒答时停止解析 | choices[].message.content |
| Responses | 检查 HTTP 状态及 status；仅在 completed 时读取，并单独处理 content 中的 refusal 项 | output 中 message 的 output_text 内容项 |

即使 JSON 能解析，也要验证字段是否符合业务要求；格式正确不代表内容准确。

上游拒绝格式字段时，先确认模型能力与转换路径，避免静默删除约束后继续接受未校验结果。协议细节见 [OpenAI 结构化输出文档](https://developers.openai.com/api/docs/guides/structured-outputs)。
