# 协议与兼容性

New API 提供多种客户端协议，RelayKit 负责部分文本协议之间的转换。选择协议时，应同时确认客户端、模型和渠道的支持范围。

## 接口地址对照

下列路径相对于 API 根地址，例如 `https://gateway.example.com`。

| 能力 | HTTP 路径 | 说明 |
| --- | --- | --- |
| 模型列表 | GET /v1/models | 查询当前密钥可见的模型 |
| Chat Completions | POST /v1/chat/completions | 常见聊天客户端与 OpenAI SDK 接口 |
| Responses | POST /v1/responses | 使用 input 和 output，流式事件与 Chat 不同 |
| Anthropic Messages | POST /v1/messages | 使用 Messages 内容块 |
| Gemini | POST /v1beta/models/{model}:generateContent | 模型 ID 位于路径中 |
| Gemini 流式 | POST /v1beta/models/{model}:streamGenerateContent | SSE 客户端通常追加 ?alt=sse |
| Realtime | GET /v1/realtime | WebSocket 升级 |
| Responses WebSocket | GET /v1/responses | 与 HTTP POST 不同的交互方式 |

OpenAI SDK 的基础地址通常包含 `/v1`；Anthropic SDK 通常填写根地址，再由 SDK 拼接 `/v1/messages`。Gemini 客户端还需要核对 API 版本配置。

## 兼容性如何确认

| 能力 | 建议验证的结果 |
| --- | --- |
| 基础聊天 | 完整返回文本，结束状态可识别 |
| 流式 | 增量显示、正常结束、中断可以区分 |
| 工具调用 | 参数完整，多轮结果能够正确回传 |
| JSON Schema | 约束被接受，拒答与截断可处理 |
| 多模态 | 输入格式、大小和内容可被模型识别 |
| 推理与缓存 | 字段被接受，用量分类可以解释 |
| 后台任务 | 返回任务标识，能够查询终态和获取结果 |
| WebSocket | 鉴权、升级和协议事件均通过 |

一次聊天成功，不能替代这些能力的单独验证。跨协议转换可能丢失上游特有字段；管理员的映射和参数覆盖也可能影响实际请求。

## 当前未开放的标准接口

当前源码中，`/v1/files`、`/v1/fine-tunes`、`/v1/images/variations` 和模型删除属于占位接口。Anthropic `count_tokens` 路由未启用，Gemini `countTokens` 未实现。

后台 Responses 的创建和检索依赖支持该模式的任务插件路径；普通 relay 请求不能据此推断支持后台检索。

## 上线前保留一份验证记录

记录平台版本、模型 ID、分组、协议、客户端／SDK 版本、已验证能力和日期。升级后优先复测实际使用的能力。本文版本依据见[文档范围](/docs/overview#文档版本与适用范围)。

字段与响应示例见[API 参考](/docs/api-reference)。
