# 完成第一次 API 调用

本页带你查询可用模型并获得一次文本回复。需要已登录的 RouTok 账号、可用额度，以及支持 Chat Completions 的模型。

## 准备接入信息

在[API 密钥](/keys)页面创建密钥，并从 **API 地址** 复制接入地址。下面的 `NEW_API_BASE_URL` 表示 **API 根地址，不含末尾的 /v1**。

选择与你终端对应的写法，替换示例域名和密钥。环境变量仅对当前终端有效。

::: code-group
```bash [macOS / Linux]
export NEW_API_BASE_URL='https://gateway.example.com'
export NEW_API_KEY='replace-with-your-new-api-key'
```

```powershell [Windows PowerShell]
$env:NEW_API_BASE_URL = 'https://gateway.example.com'
$env:NEW_API_KEY = 'replace-with-your-new-api-key'
```
:::

不要将包含真实密钥的命令、截图或终端历史发送给他人。共享设备使用结束后关闭终端，并按需要清理历史记录。

## 第一步：查询可用模型

::: code-group
```bash [macOS / Linux]
curl --fail-with-body "$NEW_API_BASE_URL/v1/models" \
  -H "Authorization: Bearer $NEW_API_KEY"
```

```powershell [Windows PowerShell]
$headers = @{ Authorization = "Bearer $env:NEW_API_KEY" }
$models = Invoke-RestMethod "$env:NEW_API_BASE_URL/v1/models" -Headers $headers
$models.data | Select-Object id
```
:::

JSON 响应结构示例：

```json
{
  "object": "list",
  "data": [
    { "id": "your-enabled-model", "object": "model" }
  ]
}
```

从实际返回的 `id` 中选择一个支持聊天的模型。列表可见不代表该模型支持所有接口，可在[模型广场](/pricing)核对能力。

## 第二步：发送消息

将 `your-enabled-model` 换成上一步选中的模型 ID。

::: code-group
```bash [macOS / Linux]
export NEW_API_MODEL='your-enabled-model'
curl --fail-with-body "$NEW_API_BASE_URL/v1/chat/completions" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "{\"model\":\"$NEW_API_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}]}"
```

```powershell [Windows PowerShell]
$env:NEW_API_MODEL = 'your-enabled-model'
$body = @{
  model = $env:NEW_API_MODEL
  messages = @(@{ role = 'user'; content = 'Hello!' })
} | ConvertTo-Json -Depth 10
$result = Invoke-RestMethod "$env:NEW_API_BASE_URL/v1/chat/completions" `
  -Method Post -Headers $headers -ContentType 'application/json' -Body $body
$result.choices[0].message.content
```
:::

非流式成功响应通常包含以下结构，实际文字和用量会不同：

```json
{
  "id": "chatcmpl-example",
  "object": "chat.completion",
  "model": "your-enabled-model",
  "choices": [
    {
      "index": 0,
      "message": { "role": "assistant", "content": "Hello! How can I help?" },
      "finish_reason": "stop"
    }
  ],
  "usage": { "prompt_tokens": 10, "completion_tokens": 8, "total_tokens": 18 }
}
```

## 确认调用成功

读取 `choices[0].message.content`，再到[用量日志](/usage-logs)核对时间、模型和费用。完成这一步后，即可使用同一组配置继续[SDK 接入](/docs/sdk)。

| 结果 | 下一步 |
| --- | --- |
| 401 | 检查模型密钥是否完整且有效 |
| 404 | 检查 API 根地址是否重复包含 /v1 |
| 模型列表为空 | 检查密钥模型限制和分组 |
| 没有可用渠道 | 确认模型与分组后联系支持 |
| 额度不足 | 核对账户、密钥和套餐状态 |

完整排查路径见[调用失败排查](/docs/troubleshooting)。
