# 模型 API 参考

本页说明常用接口的请求与响应结构。所有路径相对于本站 API 根地址；完整接入步骤见[首次调用](/docs/quickstart)。

## 通用约定

| 项目 | 约定 |
| --- | --- |
| 鉴权 | Authorization: Bearer 本站模型API密钥 |
| JSON 请求 | Content-Type: application/json |
| 文件上传 | 使用 multipart，由客户端生成 boundary |
| 模型名称 | 使用本站提供的模型 ID |
| 流式响应 | 按所选协议解析 SSE 事件 |
| WebSocket | 使用支持升级连接的客户端 |

以下 JSON 为最小结构示例，模型名和 ID 均需替换。可选字段是否受支持，取决于模型、渠道和协议转换路径。

## 模型列表

`GET /v1/models`

```json
{
  "object": "list",
  "data": [
    { "id": "your-enabled-model", "object": "model" }
  ]
}
```

使用 `data[].id` 发起调用。`GET /v1/models/{model}` 可查询单个模型；附加字段与协议模式有关。列表可见性不保证当前生成请求一定成功。

## Chat Completions

`POST /v1/chat/completions`

| 字段 | 类型 | 要求 |
| --- | --- | --- |
| model | string | 必填，本站模型 ID |
| messages | array | 必填，消息序列 |
| messages[].role | string | 例如 user、assistant；工具消息按工具协议填写 |
| messages[].content | string／内容数组 | 按消息角色、模态和模型要求填写 |
| stream | boolean | 可选，true 启用流式 |
| tools | array | 可选，需模型支持 |
| response_format | object | 可选，需模型支持相应输出格式 |
| max_tokens／max_completion_tokens | integer | 可选输出上限，按模型选择，不要任意同时设置 |

最小请求：

```json
{
  "model": "your-enabled-model",
  "messages": [{ "role": "user", "content": "Hello!" }]
}
```

响应的核心字段：

```json
{
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Hello!" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 10, "completion_tokens": 3, "total_tokens": 13 }
}
```

读取 `choices[].message`，并检查 finish_reason。工具调用可能返回 tool_calls；达到输出上限时内容可能不完整。流式改为读取 `choices[].delta`，详见[流式响应](/docs/streaming)、[工具调用](/docs/tools)和[结构化输出](/docs/structured-output)。

## Responses

`POST /v1/responses`

```json
{"model":"your-enabled-model","input":"Hello!"}
```

input 可为字符串或协议支持的内容项。简化响应：

```json
{
  "id": "resp_example",
  "object": "response",
  "status": "completed",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [{ "type": "output_text", "text": "Hello!" }]
    }
  ]
}
```

遍历 output 中的 message 及 output_text 内容项，不要按 Chat 的 choices 解析。SDK 可能提供 output_text 便利属性。格式约束使用 text.format，流式使用命名事件。

`background: true` 和 `GET /v1/responses/{response_id}` 仅在支持该模式的任务插件路径下适用；普通 relay 返回的响应 ID 不保证可由本站检索。保留原始返回 ID，并使用对应协议的查询入口。

## Anthropic Messages

`POST /v1/messages`

```json
{
  "model": "your-messages-model",
  "max_tokens": 256,
  "messages": [{ "role": "user", "content": "Hello!" }]
}
```

max_tokens 为正整数输出上限，需符合模型及网关限制。兼容 Anthropic 客户端时，使用本站密钥填写 x-api-key，并按客户端协议发送 anthropic-version；直接 HTTP 调用也可使用本站支持的 Bearer 鉴权。

简化响应：

```json
{
  "id": "msg_example",
  "type": "message",
  "role": "assistant",
  "content": [{ "type": "text", "text": "Hello!" }],
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 10, "output_tokens": 3 }
}
```

按 content 块类型处理文本、工具等结果。`/v1/messages/count_tokens` 当前未启用。

## Gemini

`POST /v1beta/models/{model}:generateContent`

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Hello!" }] }
  ]
}
```

模型名位于路径中。简化响应：

```json
{
  "candidates": [
    {
      "content": { "role": "model", "parts": [{ "text": "Hello!" }] },
      "finishReason": "STOP"
    }
  ]
}
```

读取 candidates 中的 content.parts，按类型处理。流式 action 为 streamGenerateContent，SSE 客户端通常使用 ?alt=sse。

鉴权可使用本站支持的 Bearer 或兼容客户端的 x-goog-api-key。优先使用请求头，避免密钥进入 URL 日志。countTokens 当前未实现。

## 媒体与任务

| 方法与路径 | 用途 | 示例 |
| --- | --- | --- |
| POST /v1/images/generations | 图片生成 | [生成图片](/docs/images) |
| POST /v1/images/edits | 图片编辑 | [编辑图片](/docs/images#编辑图片) |
| POST /v1/audio/speech | 语音合成，通常返回二进制 | [音频接口](/docs/audio-embeddings) |
| POST /v1/audio/transcriptions | 语音识别 | [音频接口](/docs/audio-embeddings) |
| POST /v1/audio/translations | 音频翻译，需模型支持 | [音频接口](/docs/audio-embeddings) |
| POST /v1/embeddings | 生成向量 | [向量示例](/docs/audio-embeddings#生成向量) |
| POST /v1/rerank | 文档重排序 | [重排序示例](/docs/audio-embeddings#重排序) |
| POST /v1/videos | 兼容插件的视频任务提交 | [完整任务流程](/docs/tasks) |
| GET /v1/videos/{taskId} | 查询视频任务 | [任务状态](/docs/tasks#第二步-查询状态) |
| GET /v1/videos/{taskId}/content | 获取视频内容 | [下载结果](/docs/tasks#第三步-下载结果) |
| POST /v1/tasks/{pluginKey} | 通用提交，请求体由插件定义 | [任务说明](/docs/tasks) |
| GET /v1/tasks/{taskId} | 查询自己的任务 | [通用查询](/docs/tasks#通用任务查询) |
| GET /v1/tasks/{taskId}/artifacts | 查询结果文件列表 | [结果文件](/docs/tasks#其他任务与结果文件) |

## 错误响应

错误可能由网关、上游或代理返回。OpenAI 兼容错误通常具有 error 对象，例如：

```json
{
  "error": {
    "message": "Example error message",
    "type": "invalid_request_error",
    "code": "example_code"
  }
}
```

以上为结构示意，不是固定错误文案。Messages、Gemini 和插件接口可能使用各自格式；message、type、code 也不保证全部存在。

保留 HTTP 状态、协议错误字段和实际返回的请求标识。HTML 错误页通常需要进一步检查代理或接入地址。具体处理见[调用失败排查](/docs/troubleshooting)。

## 能力边界与补充资料

文件管理、微调、图片 variations 和模型删除等占位接口不属于可用能力。上游完整字段应参考对应服务商官方协议，同时核对本站模型与渠道支持范围。

[New API 官方 API 文档](https://docs.newapi.ai/zh/docs/api)提供项目层面的补充参考，RouTok 服务范围以本站为准。
