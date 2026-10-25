# routokdocs

static docs and images — [RouTok 文档](https://docs.routok.com)。

文档来自 `ContessaIntelligence/routokapi` 的 `022756a50ee75692ddcf62d0fd531c38f8a48364`，内容依据 New API 源码版本 `058c8231b68c51ee02abee15befcd720fee9f4a2` 核验。New API 由 QuantumNous 维护；保留原始来源、署名和 AGPL-3.0 许可。

## 静态部署

沿用现有服务器同步本仓库 `main` 分支、以仓库根目录提供静态文件的方式。`index.html`、`docs/*/index.html` 和 `assets/` 都已提交；服务器不需要执行构建，不需要 Go、React、Node、API 代理或 SPA 回退规则。站内链接使用显式 `index.html`，直接打开和刷新均由静态服务处理。原首页保存在 `tools/index.html`。

自动同步服务由现有服务器管理，本仓库没有新增部署凭据或工作流。服务器只需允许公开静态文件；不应开放 `.git/` 和 `node_modules/`。

## 编辑与校验

本地需要 Bun，预览及完整示例语法校验需要 Python 3；Windows 的 PowerShell 示例校验使用 PowerShell 7。

```sh
bun install --frozen-lockfile
bun run build
bun run check
bun run test
bun run docs:examples
bun run preview
```

打开 `http://127.0.0.1:4173/`。编辑后必须重新构建，并将源码与生成的静态文件一起提交和推送。

- `content/zh/*.md`：30 篇指南及首页数据；正文和示例保留原文。
- `content/catalog.json`：目录、章节和顺序。
- `content/site.config.json`：平台域名、文档域名、核验日期及来源版本。平台页面链接在构建时转换为 `https://routok.com/...`。
- `content/zh/public/images/`：原始图片；构建时复制到 `assets/images/`。
- `scripts/content.mjs`：迁移并解耦的原始内容解析及校验脚本。
- `scripts/build.mjs`：生成独立 HTML、目录、搜索索引、站点地图和图片。
- `assets/search.mjs`：保留原中文分词、同义词及搜索排序实现；搜索索引只在使用搜索时加载。
- `assets/site.*`：独立文档界面，不加载主站代码或管理 API。

新增文章：`bun run docs:new -- my-guide "我的指南" help`，编辑后运行上述校验。删除文章时同步修复目录和引用，并根据 `generated-files.json` 删除该文章的旧 HTML 后重新构建。

`check` 检查生成内容是否最新；测试检查全站静态链接、锚点、图片、平台跳转、搜索和代码复制。示例校验仅检查语法，不请求真实 API；不会自动更新内容核验日期。

## 与主站解耦

旧的 React 阅读器使用 `CopyButton`、`CodeBlockFrame`、`Tabs`、`Markdown`、`PublicLayout`，这些组件依赖主站 React 运行时和样式。为满足直接托管 HTML 的要求，新阅读器在构建时生成 HTML，使用原生可折叠代码组，复用原内容解析和搜索逻辑；页面无 JavaScript 时正文、导航、图片、代码组仍可使用。

主站回到原版本后，可在已有后台的文档链接设置中填入 `https://docs.routok.com`，无需修改主站代码或重新集成文档。
