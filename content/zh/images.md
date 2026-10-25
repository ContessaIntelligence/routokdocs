# 图片生成与编辑

先在[模型广场](/pricing)确认图片模型、支持的接口和计费单位。图片请求可能由普通 relay 或任务插件处理，参数范围和等待方式依模型而定。

## 生成图片

先完成[环境变量设置](/docs/quickstart#准备接入信息)，将模型 ID 替换后在 Bash 中执行：

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/images/generations" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"your-image-model","prompt":"A small green house in a garden","n":1}'
```

常见响应结构示例：

```json
{
  "created": 1792540800,
  "data": [
    { "url": "https://media.example.com/generated-image.png" }
  ]
}
```

实际结果可能使用 `data[].url` 或 `data[].b64_json`。URL 结果按有效期及时下载；Base64 结果需要解码后保存。以实际返回的图片内容为准。

## 编辑图片

支持 multipart 编辑的模型可使用：

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/images/edits" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -F 'model=your-image-edit-model' \
  -F 'prompt=Change the background to a garden' \
  -F 'image=@input.png'
```

将 input.png 替换为本地文件路径。由客户端生成 multipart boundary，不要手动填写 Content-Type。多图、mask、尺寸、质量和格式只在模型支持时添加。

## 确认结果

打开生成文件，并在[用量日志](/usage-logs)核对模型与费用。某些下载地址会过期，重要结果请及时保存。

## 请求等待较长或失败

部分插件会等待上游任务完成后返回。超时不代表生成任务已停止，先查[任务状态](/docs/tasks)和日志，再决定是否重发。

生成数量、质量和尺寸可能影响费用。首次测试建议单张生成；`/v1/images/variations` 当前未实现。
