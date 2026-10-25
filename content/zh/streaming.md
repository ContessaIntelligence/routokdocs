# 读取流式响应

流式响应让应用逐步显示输出。建议先用同一模型完成非流式调用，再开启流式，便于区分模型配置与传输问题。

## 发起请求

先完成[环境变量设置](/docs/quickstart#准备接入信息)。以下示例用于 Bash，`-N` 关闭 curl 输出缓冲：

```bash
curl --fail-with-body -N "$NEW_API_BASE_URL/v1/chat/completions" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d "{\"model\":\"$NEW_API_MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"Hello!\"}],\"stream\":true}"
```

Chat Completions 的事件结构示例：

```text
data: {"choices":[{"index":0,"delta":{"role":"assistant","content":"Hello"},"finish_reason":null}]}

data: {"choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

以上为简化示例，各事件之间有一个空行。

## 使用 SDK 读取

在[Python SDK 示例](/docs/sdk#python)的 client 初始化之后，可以这样读取增量：

```python
stream = client.chat.completions.create(
    model=os.environ["NEW_API_MODEL"],
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True,
)
for chunk in stream:
    if chunk.choices:
        print(chunk.choices[0].delta.content or "", end="", flush=True)
print()
```

Windows 用户可使用此 SDK 示例，避免 PowerShell 的普通 JSON 读取方式缓冲整个响应。

## 解析与完成判断

Chat 流通常使用 SSE，从 `data:` 行解析 JSON，文本增量位于 `choices[].delta.content`。一次网络读取可能只包含半个事件，应使用 SDK 或完整的 SSE 解析器。

Responses、Messages 和 Gemini 使用不同的事件结构。工具调用参数也可能分片到达，需要完整收集并校验后执行。

应用应区分正常结束、输出截断、上游错误和连接中断。HTTP 已返回成功状态后，流中仍可能发生错误。

## 用量与排查

仅在渠道及上游支持时，流中才会返回用量；缺少 usage 不能解释为零费用。

若所有文字最后一次性出现，先对比命令行与客户端。若长回复中断，核对超时设置和代理链路，见[错误排查](/docs/troubleshooting)。取消连接后重新请求前，先检查日志，避免重复消耗。
