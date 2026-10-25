# 音频、向量与重排序

这些接口各自需要支持相应任务的模型。先在模型广场确认能力，再使用[首次调用](/docs/quickstart#准备接入信息)中的地址与密钥。下列 curl 命令用于 Bash。

## 语音合成

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/audio/speech" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"your-tts-model","input":"Hello!","voice":"your-supported-voice"}' \
  --output speech.bin
```

替换模型和声音名称。根据请求格式和响应 Content-Type 选择文件扩展名；播放前确认 HTTP 成功，避免将错误正文当作音频。

## 语音识别与翻译

```bash
curl --fail-with-body "$NEW_API_BASE_URL/v1/audio/transcriptions" \
  -H "Authorization: Bearer $NEW_API_KEY" \
  -F 'model=your-transcription-model' \
  -F 'file=@audio.wav'
```

默认 JSON 格式的常见响应：

```json
{"text":"Hello!"}
```

将 audio.wav 替换为本地文件。文件格式、大小、时长和语言范围以目标模型为准。翻译接口为 `POST /v1/audio/translations`，需另外确认模型支持。

## 生成向量

向 `POST /v1/embeddings` 发送：

```json
{
  "model": "your-embedding-model",
  "input": ["A document to index", "A search query"]
}
```

从 `data[].embedding` 读取向量，用每项的 index 对应输入顺序。以下仅展示结构，三个数不代表真实模型维度：

```json
{
  "object": "list",
  "data": [
    { "object": "embedding", "index": 0, "embedding": [0.1, -0.2, 0.3] },
    { "object": "embedding", "index": 1, "embedding": [0.2, -0.1, 0.4] }
  ]
}
```

建库和查询应使用兼容的模型与维度。更换模型后，通常需要重新生成文档向量和索引。

## 重排序

向 `POST /v1/rerank` 发送：

```json
{
  "model": "your-rerank-model",
  "query": "AI gateway",
  "documents": [
    "A gateway manages model access",
    "A gardening guide"
  ]
}
```

按响应中的文档索引和评分读取排序结果。文档对象及结果字段可能存在提供商差异，应先用两条短文档确认结构，再接入检索流程。
