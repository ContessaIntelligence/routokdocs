# RouTok 文档

RouTok 的静态使用文档与图片资源，访问地址：[docs.routok.com](https://docs.routok.com)。

文档涵盖账号与控制台、API 密钥、模型接入、SDK 示例、用量与费用，以及常见问题排查。

## 目录

- `index.html`：文档首页。
- `docs/`：各篇指南的 HTML 页面。
- `assets/`：样式、浏览器脚本、搜索数据与图片。
- `tools/index.html`：工具配置速查。
- `404.html`：未找到页面的提示。
- `sitemap.xml`、`robots.txt`：搜索引擎索引配置。

## 维护与发布

直接编辑 HTML、CSS、JavaScript 或图片文件，提交后沿用现有的自动静态发布流程。仓库根目录即站点目录，无需安装依赖或执行前端构建。

本地预览可在仓库目录运行：

```sh
python -m http.server 4173
```

然后访问 `http://localhost:4173`。修改文章标题或正文时，同时更新相关目录链接和 `assets/search-data.json`；增删页面时同步调整 `sitemap.xml`。

RouTok 基于 [New API](https://github.com/QuantumNous/new-api) 提供的平台能力。New API 由 QuantumNous 维护，相关署名与 [AGPL-3.0 许可](LICENSE)予以保留。
