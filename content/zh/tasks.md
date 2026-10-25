# 提交生成任务并获取结果

图片和视频生成可能采用异步任务：提交后获得任务 ID，再查询状态并下载结果。请保存本站返回的 ID，后续查询应使用同一账号的有效密钥。

## 示例适用范围

以下流程针对项目 **Sora 插件 1.1.0** 提供的 OpenAI Video 协议。需要本站已开放相应模型和渠道；模型 ID、时长及尺寸以实际配置为准。本例的 4 秒、720×1280 参数仅用于演示该插件路径。

先按[首次调用](/docs/quickstart#准备接入信息)设置环境变量。下面使用 Bash；Windows 用户可通过 Python 或 HTTP 客户端发送同样的请求。

## 第一步：提交一次任务

将 `your-video-model` 替换为本站提供的对应模型 ID：

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/videos" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"your-video-model","prompt":"A small green house in a garden, static camera","seconds":"4","size":"720x1280"}'
```

成功提交的简化响应示例：

```json
{
  "id": "task_example",
  "object": "video",
  "model": "your-video-model",
  "status": "queued",
  "progress": 0,
  "created_at": 1792540800
}
```

保存实际返回的 `id`。提交成功表示任务已创建，尚不代表生成完成。

## 第二步：查询状态

```bash
export NEW_API_TASK_ID='replace-with-returned-task-id'
curl --fail-with-body "$NEW_API_BASE_URL/v1/videos/$NEW_API_TASK_ID" \
  -H "Authorization: Bearer $NEW_API_KEY"
```

此接口使用 `queued`、`in_progress`、`completed`、`failed` 等状态。建议每隔数秒查询，并在应用中设置总等待上限；到达等待上限后保留 ID，稍后继续查询。

## 第三步：下载结果

状态为 `completed` 后，调用内容接口：

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/videos/$NEW_API_TASK_ID/content" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  --output result.mp4
```

确认 HTTP 成功、返回类型及文件内容后再使用。使用 `--fail-with-body` 时，错误正文也可能保存到文件中，应先处理非零退出码。

## 通用任务查询

对本站签发的网关任务 ID，也可以使用：

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/tasks/$NEW_API_TASK_ID" \
  -H "Authorization: Bearer $NEW_API_KEY"
```

通用接口与 Video 接口的状态名称不同：

| 通用任务状态 | 含义 |
| --- | --- |
| NOT_START／SUBMITTED／QUEUED | 未开始、已提交或等待处理 |
| IN_PROGRESS | 处理中 |
| SUCCESS | 已完成 |
| FAILURE | 已失败，查看 fail_reason |
| UNKNOWN | 暂时无法识别状态 |

简化响应示例：

```json
{
  "task_id": "task_example",
  "platform": "sora",
  "status": "SUCCESS",
  "progress": "100%",
  "fail_reason": "",
  "created_at": 1792540800,
  "finished_at": 1792540860
}
```

`created_at` 和 `finished_at` 为 Unix 秒级时间戳；未完成时 finished_at 可能为 0。不要将上游私有 ID、Responses ID 和网关任务 ID 混用。

## 其他任务与结果文件

通用提交入口为 `POST /v1/tasks/{pluginKey}`，请求体由插件定义，不能直接套用任意厂商参数。

支持结果文件的任务可调用 `GET /v1/tasks/{taskId}/artifacts`，从 `artifacts[].content_url` 获取文件地址。地址可能带有效期，应妥善保存并及时下载。列表为空时，按该模型的协议说明获取结果。

部分同步图片结果仅在原请求中返回，之后未必可以重新获取。超时或关闭网页不等于取消任务；先查状态与[费用记录](/docs/logs)，再决定是否重新提交。
