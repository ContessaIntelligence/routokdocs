# 图片理解与多模态输入

图片理解是把图片交给视觉模型分析；生成图片请使用[图片生成接口](/docs/images)。本页展示 Chat Completions 的图片输入格式。

## 发送一张图片

选择支持视觉输入的模型，将以下 JSON 发送到 `POST /v1/chat/completions`：

```json
{
  "model": "your-vision-model",
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "Describe this image." },
        {
          "type": "image_url",
          "image_url": { "url": "https://media.example.com/example.png" }
        }
      ]
    }
  ]
}
```

模型 ID 和图片 URL 均需替换。图片应为上游能够访问、且你有权使用的 HTTPS 资源。鉴权与响应读取方式见[首次调用](/docs/quickstart)。

## 使用本地图片

模型支持时，可以将图片编码为 Data URL，填入 image_url.url。格式为 `data:image/png;base64,图片编码`，其中 MIME 类型必须与实际文件一致。

Base64 会增加请求体大小。处理较大文件前，先用一张小图片确认格式和模型能力。

## 其他媒体与文件

图片格式、分辨率、数量以及音视频长度受到模型和网关共同限制。PDF、音频、视频需要对应协议与渠道支持，不能只替换图片示例中的文件类型。

当前文件管理 API 未实现，不能把任意 file_id 当成已上传资源。需要文件输入时，请先确认该模型支持的传入方式。

## 图片无法读取

| 输入方式 | 优先检查 |
| --- | --- |
| 图片 URL | 上游能否访问、是否要求登录、是否存在失效链接或重定向 |
| Data URL | MIME 类型、Base64 编码和请求体大小 |
| 多图输入 | 模型是否支持、图片数量是否超限 |

反馈问题时使用无敏感内容的示例图片，避免公开私人图片或完整 Data URL。
