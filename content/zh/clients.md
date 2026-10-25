# 连接聊天软件与应用

准备 **API 地址、模型 API 密钥、模型 ID**，即可配置支持自定义接口的软件。建议先完成一次[在线测试](/docs/playground)，再验证客户端连接。

## 准备三个配置值

| 客户端字段 | 填写内容 | 获取位置 |
| --- | --- | --- |
| API Key／Token | 本站签发的完整模型密钥 | [API 密钥](/keys) |
| Base URL／API 地址 | 与客户端协议匹配的接入地址 | 密钥页面的 **API 地址** |
| Model／模型 ID | 完整模型标识 | [模型广场](/pricing)或模型列表 API |

服务商名称可填写“RouTok”。Provider／接口类型应选择模型支持的协议，例如 OpenAI 兼容。

## 地址是否需要 /v1

以根地址 `https://gateway.example.com` 为例：

| 客户端要求 | 应填写 |
| --- | --- |
| OpenAI SDK 的 base_url／baseURL | `https://gateway.example.com/v1` |
| 自动添加 /v1 的服务商模板 | `https://gateway.example.com` |
| 明确要求完整 Chat Completions 地址 | `https://gateway.example.com/v1/chat/completions` |

示例域名需要替换。若本站提供独立 API 域名，请使用 **API 地址** 中的值，而非直接复制控制台网址。

## Cherry Studio

1. 打开设置中的模型服务商页面，选择或创建兼容服务商。
2. 使用内置 **New API** 模板时，按模板提示填写本站根地址。
3. 填入模型 API 密钥并启用服务商。
4. 获取模型列表，或手动添加从本站复制的模型 ID。
5. 新建会话并选择该服务商的模型，发送一条短消息。

OpenAI 模板和不同客户端版本的补路径规则可能不同，以字段提示为准。配置入口可参考 [Cherry Studio 官方说明](https://cherryai.com.cn/docs/zh-cn/pre-basic/settings/providers/)。

## Dify 与工作流应用

由工作区管理员添加支持自定义地址的模型服务商，再在工作流节点中选择对应模型。聊天、向量和重排序节点分别需要支持该任务的模型。配置入口见 [Dify 官方说明](https://docs.dify.ai/en/cloud/use-dify/workspace/model-providers)。

## 确认连接成功

完成一条消息，收到回复，并在 RouTok [用量日志](/usage-logs)找到对应记录。客户端的“连接成功”提示有时只验证密钥或模型列表，仍需实际生成一次内容。

| 现象 | 检查方法 |
| --- | --- |
| 401 | 核对完整密钥及有效期，确认未填写密码或 PAT |
| 404 | 检查是否重复添加 /v1，或误填完整接口路径 |
| 模型不存在 | 使用模型 ID，避免填写展示名称 |
| 网页正常，软件失败 | 核对密钥的分组和模型限制 |

其他情况见[错误排查](/docs/troubleshooting)。
