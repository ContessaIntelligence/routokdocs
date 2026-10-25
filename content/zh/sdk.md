# Python 与 JavaScript SDK

使用 OpenAI SDK 可以完成本站兼容接口的请求和响应处理。先完成[首次调用](/docs/quickstart)，在同一个终端保留 `NEW_API_BASE_URL`、`NEW_API_KEY` 和 `NEW_API_MODEL`。

本页的 `NEW_API_BASE_URL` 始终为 **不含 /v1 的 API 根地址**，程序会追加版本路径。示例固定依赖版本，便于复现；升级 SDK 后请重新验证实际使用的能力。

## Python

创建虚拟环境并安装依赖：

::: code-group
```bash [macOS / Linux]
python -m venv .venv
. .venv/bin/activate
python -m pip install openai==3.35.1
```

```powershell [Windows PowerShell]
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install openai==3.35.1
```
:::

将以下内容保存为 `demo.py`：

```python
import os
from urllib.parse import urlsplit
from openai import OpenAI

base_url = os.environ["NEW_API_BASE_URL"].rstrip("/")
origin = urlsplit(base_url)
if (origin.scheme not in ("http", "https") or not origin.netloc
        or origin.path or origin.query or origin.fragment
        or origin.username or origin.password):
    raise ValueError("NEW_API_BASE_URL must be an API origin without /v1")

client = OpenAI(
    base_url=base_url + "/v1",
    api_key=os.environ["NEW_API_KEY"],
    timeout=60.0,
    max_retries=0,
)
response = client.chat.completions.create(
    model=os.environ["NEW_API_MODEL"],
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)
```

macOS／Linux 在已激活的虚拟环境中运行 `python demo.py`；Windows 运行 `.\.venv\Scripts\python.exe demo.py`，无需修改 PowerShell 执行策略。

## JavaScript

在应用目录安装固定版本：

```bash
bun add --exact openai@7.39.0
```

将以下内容保存为 `demo.mjs`：

```javascript
import OpenAI from 'openai'

const { NEW_API_BASE_URL, NEW_API_KEY, NEW_API_MODEL } = process.env
if (!NEW_API_BASE_URL || !NEW_API_KEY || !NEW_API_MODEL) {
  throw new Error('Set NEW_API_BASE_URL, NEW_API_KEY and NEW_API_MODEL first')
}
const origin = new URL(NEW_API_BASE_URL)
if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/'
    || origin.search || origin.hash || origin.username || origin.password) {
  throw new Error('NEW_API_BASE_URL must be an API origin without /v1')
}

const client = new OpenAI({
  baseURL: origin.origin + '/v1',
  apiKey: NEW_API_KEY,
  timeout: 60_000,
  maxRetries: 0,
})
const response = await client.chat.completions.create({
  model: NEW_API_MODEL,
  messages: [{ role: 'user', content: 'Hello!' }],
})
console.log(response.choices[0].message.content)
```

运行 `bun demo.mjs`。该示例也适合 TypeScript 服务端项目，使用 Node.js 时可通过 `node demo.mjs` 运行。

## 确认结果与处理错误

终端输出回复，并且本站用量日志出现对应记录，即完成 SDK 接入。

| 问题 | 检查方向 |
| --- | --- |
| 找不到 openai 模块 | 安装依赖与执行程序是否使用同一环境或目录 |
| 缺少环境变量 | 是否在设置变量的同一终端运行 |
| 地址校验失败或 404 | 根地址不要包含 /v1 或完整接口路径 |
| 请求超时 | 查看日志后再决定是否重试 |

示例关闭自动重试，便于观察原始错误。生产应用可以对可恢复错误采用有上限的退避，同时评估 SDK、应用和网关的重试叠加。

## 用于实际应用

密钥保存在服务端或可信客户端中。网页前端和移动端资源不能安全保存长期密钥，浏览器业务请求应通过自己的服务端进行受控转发。

本页示例在 Python 3.12、Node.js 24／Bun 1.4 环境中进行本地模拟响应验证，不能替代真实模型的兼容性测试。流式用法见[流式响应](/docs/streaming)，其他协议见[API 参考](/docs/api-reference)。

本地验证覆盖请求路径、鉴权头、模型与消息参数、回复读取，以及服务端错误不自动重试、根地址误含 `/v1` 时阻止发送。这里使用模拟服务，不会产生真实模型调用费用。

SDK 用法可参考 [OpenAI Python 文档](https://developers.openai.com/api/reference/python)和 [JavaScript 文档](https://developers.openai.com/api/reference/typescript)。上游文档描述的完整能力不代表本站全部开放。
