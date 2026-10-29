/* Docs page strings (zh-CN, zh-Hant). English lives in docs.html. */
window.CF_I18N = window.CF_I18N || {};
window.CF_I18N['zh-CN'] = Object.assign(window.CF_I18N['zh-CN'] || {}, {
  'meta.title': '文档 · CodeFlux',
  'meta.desc': 'CodeFlux 使用文档：安装方法，通过地址、模型 ID 和 API 密钥接入本地或远程模型，协议格式，厂商配置参考，项目使用、MCP、隐私与故障排查。',
  'dc.h1': 'CodeFlux <span class="grad-text">使用文档</span>',
  'dc.lead': '从安装 CodeFlux、接入本地或远程模型，到用好这位智能体，你需要的内容都在这里。',
  'dc.ver': '适用于 CodeFlux v0.1.1',
  'sd.title': '本页目录',
  'sd.g1': '快速入门', 'sd.g2': '模型', 'sd.g3': '使用 CodeFlux', 'sd.g4': '参考',
  'sd.overview': '概述', 'sd.quickstart': '快速开始', 'sd.install': '安装', 'sd.verify': '校验安装包',
  'sd.models': '接入模型', 'sd.fields': '配置项说明', 'sd.protocols': '协议格式', 'sd.remote': '远程厂商 API', 'sd.local': '本地模型', 'sd.vendors': '厂商配置参考', 'sd.switching': '管理与切换',
  'sd.use': '日常使用', 'sd.workspace': '项目与会话', 'sd.tasks': '下达任务', 'sd.commands': '命令与引用', 'sd.review': '审阅改动',
  'sd.advanced': '进阶', 'sd.agents': '多智能体模式',
  'sd.privacy': '隐私与安全', 'sd.trouble': '故障排查', 'sd.support': '获取帮助',

  'dc.overview.h': '概述',
  'dc.overview.b': `
          <p>CodeFlux 是一款<strong>本地化的智能体工具</strong>。它以桌面应用的形式运行在你的电脑上，直接在你的项目文件夹中工作，借助大语言模型理解需求、规划步骤、修改文件、运行命令并检查结果。</p>
          <p>用哪个模型，完全由你决定。CodeFlux 既可以使用<strong>部署在你本机或内网的模型</strong>，也可以使用<strong>云端模型厂商的 API</strong>，并且已经适配国内外主流厂商。使用时只需填写厂商的地址、模型 ID 和密钥，再选择该厂商使用的协议格式即可。</p>
          <div class="doc-cards">
            <div><b>本地优先</b><span>应用、项目索引和会话记录都保存在你的电脑上。</span></div>
            <div><b>不绑定模型</b><span>支持本地模型与 50+ 家厂商，随时切换。</span></div>
            <div><b>安装即用</b><span>安装、添加模型、打开项目。无需搭建服务器或容器。</span></div>
          </div>
          <h3 id="concepts">核心概念</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>术语</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td>服务商（Provider）</td><td>模型的来源：可以是云端厂商（如 DeepSeek、OpenAI），也可以是本地运行时（如 Ollama）。每个服务商包含地址、协议，通常还有密钥。</td></tr>
              <tr><td>模型 ID</td><td>模型在该服务商处的准确标识，例如 <code>deepseek-chat</code>。</td></tr>
              <tr><td>协议格式</td><td>与服务商通信所使用的接口规范。大多数厂商使用 OpenAI 兼容格式。</td></tr>
              <tr><td>项目 / 工作区</td><td>允许智能体读取和修改的本地文件夹。</td></tr>
              <tr><td>会话</td><td>一条对话与任务线索。可以同时打开多个会话并行推进。</td></tr>
            </tbody>
          </table></div>
        `,

  'dc.quickstart.h': '快速开始',
  'dc.quickstart.b': `
          <p>从下载到完成第一个任务，只需三步。</p>
          <ol class="doc-steps">
            <li><b>安装 CodeFlux</b>
              <p>在<a href="index.html#download">下载区域</a>选择适合你系统的安装包并安装。各平台的注意事项见<a href="#install">安装</a>。</p></li>
            <li><b>添加模型</b>
              <p>打开模型设置，添加一个服务商，选择协议，然后填写 <strong>Base URL（地址）</strong>、<strong>模型 ID</strong> 和 <strong>API 密钥</strong>。如果使用本地模型，把地址指向你的本地服务即可。详见<a href="#models">接入模型</a>。</p></li>
            <li><b>打开项目并开始</b>
              <p>选择一个项目文件夹，然后用自然语言描述需求，例如：<em>「在订单模块新增一个导出 Excel 的接口，支持日期筛选，并编写单元测试。」</em></p></li>
          </ol>
          <div class="callout tip"><p>不确定先用哪个模型？任何提供 OpenAI 兼容 API 的厂商都很适合初次尝试。可在<a href="#vendors">厂商配置参考</a>中找到现成可用的地址。</p></div>
        `,

  'dc.install.h': '安装',
  'dc.install.b': `
          <p>CodeFlux 提供 Windows、macOS 和 Linux 版本，所有安装包均发布在 <a href="https://github.com/ContessaIntelligence/codeflux/releases/tag/v0.1.1" target="_blank" rel="noopener">GitHub 发布页</a>。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>平台</th><th>架构</th><th>安装包</th></tr></thead>
            <tbody>
              <tr><td>Windows 10 / 11</td><td>x64</td><td>安装版 <code>.exe</code> · 便携版 <code>.zip</code></td></tr>
              <tr><td>macOS</td><td>Apple 芯片（arm64）</td><td><code>.app.tar</code></td></tr>
              <tr><td>Linux</td><td>x86_64</td><td>AppImage · <code>.deb</code> · <code>.rpm</code></td></tr>
            </tbody>
          </table></div>
          <div class="callout warn"><p>当前版本<strong>尚未进行代码签名</strong>，首次打开时系统可能会弹出警告。下方说明了如何继续。后续版本会提供已签名的安装包。</p></div>

          <h3 id="install-win">Windows</h3>
          <ol>
            <li>下载 <code>CodeFlux-win-x64.exe</code> 并运行。</li>
            <li>如果 Windows 提示「Windows 已保护你的电脑」，点击<strong>更多信息</strong>，再点击<strong>仍要运行</strong>。</li>
            <li>按提示完成安装，然后从开始菜单启动 CodeFlux。</li>
          </ol>
          <p>不想安装？可下载 <code>CodeFlux-windows-x64-portable.zip</code>，解压到任意文件夹后运行其中的应用即可。</p>

          <h3 id="install-mac">macOS</h3>
          <ol>
            <li>下载 <code>CodeFlux-mac-arm64.app.tar</code> 并解压（双击即可，或执行下面的命令）。</li>
            <li>将 <code>CodeFlux.app</code> 移动到「应用程序」文件夹。</li>
            <li>由于应用尚未签名，需要先移除一次隔离标记，然后再打开。</li>
          </ol>
<pre data-lang="bash"><code>tar -xf CodeFlux-mac-arm64.app.tar
xattr -cr CodeFlux.app</code></pre>
          <p>此版本仅支持 Apple 芯片（M 系列）的 Mac。</p>

          <h3 id="install-linux">Linux</h3>
          <p>根据你的发行版选择对应的安装包。</p>
<pre data-lang="bash"><code># AppImage（适用于各发行版）
chmod +x CodeFlux-linux-x86_64.AppImage
./CodeFlux-linux-x86_64.AppImage

# Debian / Ubuntu
sudo apt install ./CodeFlux-linux-amd64.deb

# Fedora / RHEL
sudo dnf install ./CodeFlux-linux-x86_64.rpm</code></pre>
          <div class="callout"><p>如果 AppImage 在较新的 Ubuntu 上无法启动，请先安装 FUSE 2 支持：<code>sudo apt install libfuse2</code>（Ubuntu 24.04 上为 <code>libfuse2t64</code>）。</p></div>

          <h3 id="install-verify">校验安装包</h3>
          <p>每个版本都附带 <code>SHA256SUMS.txt</code> 文件。请将下载文件的校验值与该文件中对应的那一行进行比对。</p>
<pre data-lang="shell"><code># Windows (PowerShell)
Get-FileHash .\CodeFlux-win-x64.exe -Algorithm SHA256

# macOS
shasum -a 256 CodeFlux-mac-arm64.app.tar

# Linux
sha256sum -c SHA256SUMS.txt --ignore-missing</code></pre>
        `,

  'dc.models.h': '接入模型',
  'dc.models.b': `
          <p>CodeFlux 本身不内置模型，而是由你接入想使用的模型。每一次接入就是一个<strong>服务商</strong>，由协议、地址、密钥和一个或多个模型 ID 组成。你可以添加任意多个服务商，本地与远程可以混合使用。</p>
          <div class="callout"><p>应用中的菜单名称和字段标签在不同版本之间可能略有差异，但下文的概念和取值保持不变。</p></div>

          <h3 id="model-fields">配置项说明</h3>
          <dl class="field-list">
            <div><dt>名称<small>可选</small></dt><dd>便于自己识别的标签，例如「DeepSeek」或「办公室 GPU 服务器」。</dd></div>
            <div><dt>协议<small>API 格式</small></dt><dd>服务商使用的接口规范，详见<a href="#protocols">协议格式</a>。</dd></div>
            <div><dt>Base URL<small>API 地址</small></dt><dd>服务商的 API 地址，以其官方文档为准，通常以 <code>/v1</code> 结尾。不要再追加 <code>/chat/completions</code> 之类的接口路径。</dd></div>
            <div><dt>API 密钥<small>机密信息</small></dt><dd>厂商签发的凭证。本地运行时通常不校验密钥；如果该字段不能留空，随意填写一个占位值即可，例如 <code>local</code>。</dd></div>
            <div><dt>模型 ID<small>准确名称</small></dt><dd>模型在该服务商处的标识，请从厂商的模型列表中原样复制，例如 <code>deepseek-chat</code> 或 <code>qwen-plus</code>。</dd></div>
          </dl>

          <h3 id="protocols">协议格式</h3>
          <p>不同厂商通过不同的接口格式提供模型。CodeFlux 支持多种协议格式，只要选对服务商所使用的那一种，模型就能正常工作。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>格式</th><th>常见使用方</th><th>Base URL 示例</th></tr></thead>
            <tbody>
              <tr><td>OpenAI 兼容</td><td>OpenAI、DeepSeek、通义千问、Kimi、智谱 GLM、豆包、Ollama、LM Studio、vLLM，以及大多数网关与中转服务</td><td><code>https://api.deepseek.com/v1</code></td></tr>
              <tr><td>Anthropic</td><td>Claude，以及提供 Anthropic 风格接口的服务</td><td><code>https://api.anthropic.com</code></td></tr>
              <tr><td>Google Gemini</td><td>Gemini API</td><td><code>https://generativelanguage.googleapis.com</code></td></tr>
            </tbody>
          </table></div>
          <div class="callout tip"><p><strong>经验法则：</strong>阅读厂商的 API 文档，选择它所描述的格式。如果厂商同时提供多种格式，OpenAI 兼容格式的支持最广泛，是稳妥的默认选择。</p></div>

          <h3 id="remote">远程厂商 API</h3>
          <ol class="doc-steps">
            <li><b>获取凭证</b>
              <p>在厂商控制台创建 API 密钥。请确认账户有可用额度或余额，并且已开通你要使用的模型。</p></li>
            <li><b>添加服务商</b>
              <p>在 CodeFlux 中添加服务商，选择协议，然后粘贴 Base URL 和 API 密钥。</p></li>
            <li><b>添加模型 ID</b>
              <p>填写准确的模型 ID。一个服务商下可以配置多个模型，例如用速度快的模型做简单修改，用能力更强的模型做规划。</p></li>
            <li><b>测试连接</b>
              <p>用新模型开启一个会话并发送一条简短的消息。如果它能正常回复，配置就完成了。</p></li>
          </ol>
          <div class="callout warn"><p>API 密钥相当于密码。请勿泄露，也不要提交到代码仓库。建议使用权限受限的密钥，并在厂商控制台设置消费上限。</p></div>

          <h3 id="local">本地模型</h3>
          <p>如果希望所有内容都留在自己的硬件上，可以用本地运行时运行模型，再让 CodeFlux 连接它。任何提供 OpenAI 兼容 API 的运行时都可以，包括 <strong>Ollama</strong>、<strong>LM Studio</strong> 和 <strong>vLLM</strong>。</p>
          <p>以 Ollama 为例：</p>
<pre data-lang="bash"><code># 1. 下载模型
ollama pull qwen2.5-coder:7b

# 2. 检查服务是否运行，模型是否在列表中
curl http://localhost:11434/v1/models</code></pre>
          <p>然后在 CodeFlux 中添加服务商，填写下列值：</p>
          <dl class="field-list">
            <div><dt>协议</dt><dd>OpenAI 兼容</dd></div>
            <div><dt>Base URL</dt><dd><code>http://localhost:11434/v1</code></dd></div>
            <div><dt>API 密钥</dt><dd>任意占位值，例如 <code>ollama</code></dd></div>
            <div><dt>模型 ID</dt><dd><code>qwen2.5-coder:7b</code>（以 <code>ollama list</code> 显示的名称为准）</dd></div>
          </dl>
          <p>部署在内网其他机器上的模型用法相同：把 <code>localhost</code> 换成那台机器的地址，并确保其服务监听了网络接口、防火墙放行了对应端口。</p>
          <div class="callout tip"><p><strong>如何选择本地模型：</strong>智能体依赖工具调用和较长的上下文。请选择支持函数 / 工具调用、上下文窗口不少于 32K tokens 的模型。参数量很小的模型聊天表现可能不错，但处理多步骤任务时往往力不从心。</p></div>

          <h3 id="vendors">厂商配置参考</h3>
          <p>下表列出常用的接入地址，帮助你快速上手。模型 ID 更新频繁，请始终以厂商当前的模型列表为准。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>厂商</th><th>协议</th><th>Base URL</th><th>模型 ID 示例</th></tr></thead>
            <tbody>
              <tr><td>OpenAI</td><td>OpenAI 兼容</td><td><code>https://api.openai.com/v1</code></td><td><code>gpt-4o</code></td></tr>
              <tr><td>Anthropic（Claude）</td><td>Anthropic</td><td><code>https://api.anthropic.com</code></td><td><code>claude-sonnet-4-5</code></td></tr>
              <tr><td>Google Gemini</td><td>Google Gemini</td><td><code>https://generativelanguage.googleapis.com</code></td><td><code>gemini-2.5-pro</code></td></tr>
              <tr><td>DeepSeek</td><td>OpenAI 兼容</td><td><code>https://api.deepseek.com/v1</code></td><td><code>deepseek-chat</code></td></tr>
              <tr><td>通义千问（阿里云）</td><td>OpenAI 兼容</td><td><code>https://dashscope.aliyuncs.com/compatible-mode/v1</code></td><td><code>qwen-plus</code></td></tr>
              <tr><td>Kimi（月之暗面）</td><td>OpenAI 兼容</td><td><code>https://api.moonshot.cn/v1</code></td><td><code>moonshot-v1-32k</code></td></tr>
              <tr><td>智谱 GLM</td><td>OpenAI 兼容</td><td><code>https://open.bigmodel.cn/api/paas/v4</code></td><td><code>glm-4-plus</code></td></tr>
              <tr><td>豆包（火山引擎）</td><td>OpenAI 兼容</td><td><code>https://ark.cn-beijing.volces.com/api/v3</code></td><td><code>ep-…</code>（你的接入点 ID）</td></tr>
              <tr><td>Ollama</td><td>OpenAI 兼容</td><td><code>http://localhost:11434/v1</code></td><td>以 <code>ollama list</code> 为准</td></tr>
              <tr><td>LM Studio</td><td>OpenAI 兼容</td><td><code>http://localhost:1234/v1</code></td><td>以 LM Studio 中显示为准</td></tr>
              <tr><td>vLLM</td><td>OpenAI 兼容</td><td><code>http://localhost:8000/v1</code></td><td>启动时 <code>--model</code> 指定的名称</td></tr>
            </tbody>
          </table></div>
          <p>未在此列出的厂商，包括各类网关、聚合平台和贵公司的内部模型服务，接入方式完全相同：使用其文档中给出的地址和协议即可。</p>

          <h3 id="switching">管理与切换</h3>
          <ul>
            <li>可以添加多个服务商和模型，并为每个会话选择使用哪一个。</li>
            <li>随时切换模型，无需离开当前项目。例如用能力强的模型做规划，用速度快、成本低的模型做日常修改。</li>
            <li>更换密钥时，编辑对应服务商并粘贴新密钥即可，已有会话会自动使用新密钥。</li>
            <li>删除不再使用的服务商，保持列表整洁。</li>
          </ul>
        `,

  'dc.use.h': '日常使用',
  'dc.use.b': `
          <h3 id="workspace">项目与会话</h3>
          <p>选择项目文件夹即可打开项目。智能体只会读取和修改该文件夹内的文件，因此始终基于你的真实代码工作。每个任务都在各自的<strong>会话</strong>中进行，会话以标签页形式展示。你可以同时运行多个会话并随时切换，互不干扰。</p>

          <h3 id="tasks">下达任务</h3>
          <p>描述你想要的结果，而不是具体的操作步骤。好的需求会说明目标、范围，以及你将如何判断完成。</p>
          <ul>
            <li><em>「修复登录超时的问题。从鉴权中间件入手，并补充一个回归测试。」</em></li>
            <li><em>「升级本项目的依赖，并确保构建依然通过。」</em></li>
          </ul>
          <p>对于较大的工作，CodeFlux 会先分析代码库并起草一份可编辑的计划，在你确认后才会开始执行。随后它会修改文件、运行命令和测试，并在过程中自行修复错误。</p>
          <div class="callout tip"><p>需要时可以附上截图、文档或报错信息。上下文越具体，所需的沟通轮次就越少。</p></div>

          <h3 id="commands">命令与引用</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>输入</th><th>作用</th></tr></thead>
            <tbody>
              <tr><td><kbd>/</kbd></td><td>打开命令列表，无需离开输入框即可执行内置操作。</td></tr>
              <tr><td><kbd>@</kbd></td><td>将项目中的文件或文件夹作为精确的上下文添加到对话中。</td></tr>
            </tbody>
          </table></div>

          <h3 id="review">审阅改动</h3>
          <p>每一处改动都以 diff 形式展示，你可以逐行查看具体修改了什么，然后选择接受、回滚或提交到 Git。由于每一步都可以撤销，即使智能体做了大量修改，你也始终掌握主动权。</p>
          <div class="callout"><p>建议在项目中使用 Git。执行大型任务前保持工作区干净，便于对比、审阅和还原。</p></div>
        `,

  'dc.advanced.h': '进阶',
  'dc.advanced.b': `
          <h3 id="mcp">MCP</h3>
          <p>模型上下文协议（MCP）让 CodeFlux 能够使用外部工具和数据源，例如 GitHub、数据库、Figma、浏览器或 Docker。每一种集成都是一个 <strong>MCP 服务</strong>，添加一次后，智能体就可以在需要时调用。</p>
          <ol>
            <li>找到你需要的 MCP 服务，记下它的启动命令或 URL。</li>
            <li>在 CodeFlux 的 MCP 设置中添加它，并填写命令、参数以及所需的环境变量（例如访问令牌）。</li>
            <li>确认该服务的工具已出现，然后让智能体使用它们。</li>
          </ol>
          <p>大多数服务的文档都会给出类似这样的配置：</p>
<pre data-lang="json"><code>{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "&lt;your-token&gt;" }
    }
  }
}</code></pre>
          <div class="callout warn"><p>MCP 服务可以读取数据并代表你执行操作。请只安装你信任的服务，并为令牌授予所需的最小权限。</p></div>

          <h3 id="agents">多智能体模式</h3>
          <p>面对复杂任务，CodeFlux 可以把工作分配给不同角色并行推进：由<strong>规划者</strong>起草方案，<strong>编码者</strong>负责实现，<strong>测试者</strong>编写并运行测试，<strong>审查者</strong>检查结果。每个角色都可以使用最适合自己的模型，因此你可以把强大的规划模型和速度快的编码模型搭配使用。</p>
        `,

  'dc.privacy.h': '隐私与安全',
  'dc.privacy.b': `
          <p>CodeFlux 的设计原则是：数据去哪里，由你决定。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>数据</th><th>存放位置</th></tr></thead>
            <tbody>
              <tr><td>项目文件、索引、会话记录</td><td>在你的电脑上，不会主动上传。</td></tr>
              <tr><td>服务商设置与 API 密钥</td><td>在你的电脑上。</td></tr>
              <tr><td>请求上下文（提示词与相关代码）</td><td>仅发送给你选择的模型服务商，且仅在你使用时发送。</td></tr>
              <tr><td>发往本地模型的请求</td><td>留在你的电脑或内网之内，可以完全离线工作。</td></tr>
            </tbody>
          </table></div>
          <h4>建议</h4>
          <ul>
            <li>处理敏感代码时，请使用本地模型或部署在企业内部的模型服务。</li>
            <li>向云端厂商发送专有代码之前，请先了解其数据政策。</li>
            <li>使用专用且权限受限的密钥，并定期轮换。</li>
            <li>把项目纳入版本控制，让每一处改动都可以审阅和还原。</li>
          </ul>
        `,

  'dc.trouble.h': '故障排查',
  'dc.trouble.b': `
          <h3 id="ts-model">模型连接</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>现象</th><th>可能原因</th><th>处理办法</th></tr></thead>
            <tbody>
              <tr><td><code>401</code> / <code>403</code></td><td>密钥错误、过期或无权限；区域或账户不对。</td><td>重新复制密钥，注意不要带空格或引号。确认密钥属于该厂商，且你的账户已开通该模型。</td></tr>
              <tr><td><code>404</code> / 「模型不存在」</td><td>Base URL 路径或模型 ID 有误。</td><td>使用厂商文档给出的地址，通常以 <code>/v1</code> 结尾，且不含 <code>/chat/completions</code>。模型 ID 请原样复制。</td></tr>
              <tr><td><code>429</code></td><td>触发限流或额度用尽。</td><td>稍后重试，到厂商控制台检查余额与限额，或切换到其他模型。</td></tr>
              <tr><td>超时 / 连接被拒绝</td><td>网络、代理或防火墙问题；本地服务未启动。</td><td>用浏览器或 <code>curl</code> 访问 Base URL。使用本地模型时，确认运行时已启动且端口正确。</td></tr>
              <tr><td>格式错误或「不支持的参数」</td><td>协议格式与服务商不匹配。</td><td>把协议切换为厂商文档所描述的那一种。不确定时可尝试 OpenAI 兼容。</td></tr>
              <tr><td>智能体能回复，但不会修改文件或调用工具</td><td>模型不支持工具调用，或上下文窗口太小。</td><td>选择支持工具 / 函数调用、上下文不少于 32K tokens 的模型。</td></tr>
            </tbody>
          </table></div>

          <h3 id="ts-install">安装与启动</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>现象</th><th>处理办法</th></tr></thead>
            <tbody>
              <tr><td>Windows：「Windows 已保护你的电脑」</td><td>该版本未签名。点击<strong>更多信息</strong>，再点击<strong>仍要运行</strong>。</td></tr>
              <tr><td>macOS：无法打开应用，或提示「已损坏」</td><td>解压后在终端执行 <code>xattr -cr CodeFlux.app</code>，然后重新打开。</td></tr>
              <tr><td>Linux：AppImage 无法启动</td><td>用 <code>chmod +x</code> 赋予执行权限；如果你的发行版需要，请安装 <code>libfuse2</code>。</td></tr>
              <tr><td>校验值不一致</td><td>重新下载文件（建议在稳定的网络下），并与同一版本的 <code>SHA256SUMS.txt</code> 比对。</td></tr>
            </tbody>
          </table></div>
        `,

  'dc.support.h': '获取帮助',
  'dc.support.b': `
          <p>仍然没能解决？联系我们时，请附上 CodeFlux 版本、操作系统、所使用的服务商和协议，以及完整的错误信息。<strong>请勿附上你的 API 密钥。</strong></p>
          <ul>
            <li>技术支持：<a href="mailto:support@routok.com">support@routok.com</a></li>
            <li>价格、团队版与企业版：<a href="mailto:sales@routok.com">sales@routok.com</a></li>
            <li>版本发布与源码：<a href="https://github.com/ContessaIntelligence/codeflux" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        `,
  'dc.foot.t': '准备好试试了吗？', 'dc.foot.s': '下载 CodeFlux，几分钟内接入你的第一个模型。',
  'ab.crumb.home': '首页', 'ab.cta.b1': '下载 CodeFlux'
});

window.CF_I18N['zh-Hant'] = Object.assign(window.CF_I18N['zh-Hant'] || {}, {
  'meta.title': '文件 · CodeFlux',
  'meta.desc': 'CodeFlux 使用文件：安裝方法，透過位址、模型 ID 與 API 金鑰接入本機或遠端模型，協定格式，廠商設定參考，專案使用、MCP、隱私與疑難排解。',
  'dc.h1': 'CodeFlux <span class="grad-text">使用文件</span>',
  'dc.lead': '從安裝 CodeFlux、接入本機或遠端模型，到用好這位智慧體，你需要的內容都在這裡。',
  'dc.ver': '適用於 CodeFlux v0.1.1',
  'sd.title': '本頁目錄',
  'sd.g1': '快速入門', 'sd.g2': '模型', 'sd.g3': '使用 CodeFlux', 'sd.g4': '參考',
  'sd.overview': '概述', 'sd.quickstart': '快速開始', 'sd.install': '安裝', 'sd.verify': '驗證安裝檔',
  'sd.models': '接入模型', 'sd.fields': '設定項說明', 'sd.protocols': '協定格式', 'sd.remote': '遠端廠商 API', 'sd.local': '本機模型', 'sd.vendors': '廠商設定參考', 'sd.switching': '管理與切換',
  'sd.use': '日常使用', 'sd.workspace': '專案與工作階段', 'sd.tasks': '下達任務', 'sd.commands': '指令與引用', 'sd.review': '審閱改動',
  'sd.advanced': '進階', 'sd.agents': '多智慧體模式',
  'sd.privacy': '隱私與安全', 'sd.trouble': '疑難排解', 'sd.support': '取得協助',

  'dc.overview.h': '概述',
  'dc.overview.b': `
          <p>CodeFlux 是一款<strong>本機化的智慧體工具</strong>。它以桌面應用程式的形式運行在你的電腦上，直接在你的專案資料夾中工作，借助大型語言模型理解需求、規劃步驟、修改檔案、執行指令並檢查結果。</p>
          <p>用哪個模型，完全由你決定。CodeFlux 既可以使用<strong>部署在你本機或內網的模型</strong>，也可以使用<strong>雲端模型廠商的 API</strong>，並且已經適配國內外主流廠商。使用時只需填寫廠商的位址、模型 ID 與金鑰，再選擇該廠商使用的協定格式即可。</p>
          <div class="doc-cards">
            <div><b>本機優先</b><span>應用程式、專案索引與工作階段記錄都保存在你的電腦上。</span></div>
            <div><b>不綁定模型</b><span>支援本機模型與 50+ 家廠商，隨時切換。</span></div>
            <div><b>安裝即用</b><span>安裝、新增模型、開啟專案。無須架設伺服器或容器。</span></div>
          </div>
          <h3 id="concepts">核心概念</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>術語</th><th>含義</th></tr></thead>
            <tbody>
              <tr><td>服務商（Provider）</td><td>模型的來源：可以是雲端廠商（如 DeepSeek、OpenAI），也可以是本機執行環境（如 Ollama）。每個服務商包含位址、協定，通常還有金鑰。</td></tr>
              <tr><td>模型 ID</td><td>模型在該服務商處的準確識別名稱，例如 <code>deepseek-chat</code>。</td></tr>
              <tr><td>協定格式</td><td>與服務商通訊所使用的介面規範。大多數廠商使用 OpenAI 相容格式。</td></tr>
              <tr><td>專案 / 工作區</td><td>允許智慧體讀取與修改的本機資料夾。</td></tr>
              <tr><td>工作階段</td><td>一條對話與任務線索。可以同時開啟多個工作階段並行推進。</td></tr>
            </tbody>
          </table></div>
        `,

  'dc.quickstart.h': '快速開始',
  'dc.quickstart.b': `
          <p>從下載到完成第一個任務，只需三步。</p>
          <ol class="doc-steps">
            <li><b>安裝 CodeFlux</b>
              <p>在<a href="index.html#download">下載區域</a>選擇適合你系統的安裝檔並安裝。各平台的注意事項見<a href="#install">安裝</a>。</p></li>
            <li><b>新增模型</b>
              <p>開啟模型設定，新增一個服務商，選擇協定，然後填寫 <strong>Base URL（位址）</strong>、<strong>模型 ID</strong> 與 <strong>API 金鑰</strong>。如果使用本機模型，把位址指向你的本機服務即可。詳見<a href="#models">接入模型</a>。</p></li>
            <li><b>開啟專案並開始</b>
              <p>選擇一個專案資料夾，然後用自然語言描述需求，例如：<em>「在訂單模組新增一個匯出 Excel 的介面，支援日期篩選，並撰寫單元測試。」</em></p></li>
          </ol>
          <div class="callout tip"><p>不確定先用哪個模型？任何提供 OpenAI 相容 API 的廠商都很適合初次嘗試。可在<a href="#vendors">廠商設定參考</a>中找到現成可用的位址。</p></div>
        `,

  'dc.install.h': '安裝',
  'dc.install.b': `
          <p>CodeFlux 提供 Windows、macOS 與 Linux 版本，所有安裝檔均發布在 <a href="https://github.com/ContessaIntelligence/codeflux/releases/tag/v0.1.1" target="_blank" rel="noopener">GitHub 發布頁</a>。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>平台</th><th>架構</th><th>安裝檔</th></tr></thead>
            <tbody>
              <tr><td>Windows 10 / 11</td><td>x64</td><td>安裝版 <code>.exe</code> · 可攜版 <code>.zip</code></td></tr>
              <tr><td>macOS</td><td>Apple 晶片（arm64）</td><td><code>.app.tar</code></td></tr>
              <tr><td>Linux</td><td>x86_64</td><td>AppImage · <code>.deb</code> · <code>.rpm</code></td></tr>
            </tbody>
          </table></div>
          <div class="callout warn"><p>目前版本<strong>尚未進行程式碼簽章</strong>，首次開啟時系統可能會跳出警告。下方說明了如何繼續。後續版本會提供已簽章的安裝檔。</p></div>

          <h3 id="install-win">Windows</h3>
          <ol>
            <li>下載 <code>CodeFlux-win-x64.exe</code> 並執行。</li>
            <li>如果 Windows 提示「Windows 已保護您的電腦」，點選<strong>其他資訊</strong>，再點選<strong>仍要執行</strong>。</li>
            <li>依提示完成安裝，然後從開始功能表啟動 CodeFlux。</li>
          </ol>
          <p>不想安裝？可下載 <code>CodeFlux-windows-x64-portable.zip</code>，解壓縮到任意資料夾後執行其中的應用程式即可。</p>

          <h3 id="install-mac">macOS</h3>
          <ol>
            <li>下載 <code>CodeFlux-mac-arm64.app.tar</code> 並解開（按兩下即可，或執行下面的指令）。</li>
            <li>將 <code>CodeFlux.app</code> 移動到「應用程式」資料夾。</li>
            <li>由於應用程式尚未簽章，需要先移除一次隔離標記，然後再開啟。</li>
          </ol>
<pre data-lang="bash"><code>tar -xf CodeFlux-mac-arm64.app.tar
xattr -cr CodeFlux.app</code></pre>
          <p>此版本僅支援 Apple 晶片（M 系列）的 Mac。</p>

          <h3 id="install-linux">Linux</h3>
          <p>依你的發行版選擇對應的安裝檔。</p>
<pre data-lang="bash"><code># AppImage（適用於各發行版）
chmod +x CodeFlux-linux-x86_64.AppImage
./CodeFlux-linux-x86_64.AppImage

# Debian / Ubuntu
sudo apt install ./CodeFlux-linux-amd64.deb

# Fedora / RHEL
sudo dnf install ./CodeFlux-linux-x86_64.rpm</code></pre>
          <div class="callout"><p>如果 AppImage 在較新的 Ubuntu 上無法啟動，請先安裝 FUSE 2 支援：<code>sudo apt install libfuse2</code>（Ubuntu 24.04 上為 <code>libfuse2t64</code>）。</p></div>

          <h3 id="install-verify">驗證安裝檔</h3>
          <p>每個版本都附帶 <code>SHA256SUMS.txt</code> 檔案。請將下載檔案的雜湊值與該檔案中對應的那一行進行比對。</p>
<pre data-lang="shell"><code># Windows (PowerShell)
Get-FileHash .\CodeFlux-win-x64.exe -Algorithm SHA256

# macOS
shasum -a 256 CodeFlux-mac-arm64.app.tar

# Linux
sha256sum -c SHA256SUMS.txt --ignore-missing</code></pre>
        `,

  'dc.models.h': '接入模型',
  'dc.models.b': `
          <p>CodeFlux 本身不內建模型，而是由你接入想使用的模型。每一次接入就是一個<strong>服務商</strong>，由協定、位址、金鑰與一個或多個模型 ID 組成。你可以新增任意多個服務商，本機與遠端可以混合使用。</p>
          <div class="callout"><p>應用程式中的選單名稱與欄位標籤在不同版本之間可能略有差異，但下文的概念與取值保持不變。</p></div>

          <h3 id="model-fields">設定項說明</h3>
          <dl class="field-list">
            <div><dt>名稱<small>選填</small></dt><dd>便於自己識別的標籤，例如「DeepSeek」或「辦公室 GPU 伺服器」。</dd></div>
            <div><dt>協定<small>API 格式</small></dt><dd>服務商使用的介面規範，詳見<a href="#protocols">協定格式</a>。</dd></div>
            <div><dt>Base URL<small>API 位址</small></dt><dd>服務商的 API 位址，以其官方文件為準，通常以 <code>/v1</code> 結尾。不要再附加 <code>/chat/completions</code> 之類的介面路徑。</dd></div>
            <div><dt>API 金鑰<small>機密資訊</small></dt><dd>廠商核發的憑證。本機執行環境通常不驗證金鑰；如果該欄位不能留空，隨意填寫一個預留值即可，例如 <code>local</code>。</dd></div>
            <div><dt>模型 ID<small>準確名稱</small></dt><dd>模型在該服務商處的識別名稱，請從廠商的模型清單中原樣複製，例如 <code>deepseek-chat</code> 或 <code>qwen-plus</code>。</dd></div>
          </dl>

          <h3 id="protocols">協定格式</h3>
          <p>不同廠商透過不同的介面格式提供模型。CodeFlux 支援多種協定格式，只要選對服務商所使用的那一種，模型就能正常運作。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>格式</th><th>常見使用方</th><th>Base URL 範例</th></tr></thead>
            <tbody>
              <tr><td>OpenAI 相容</td><td>OpenAI、DeepSeek、通義千問、Kimi、智譜 GLM、豆包、Ollama、LM Studio、vLLM，以及大多數閘道與轉接服務</td><td><code>https://api.deepseek.com/v1</code></td></tr>
              <tr><td>Anthropic</td><td>Claude，以及提供 Anthropic 風格介面的服務</td><td><code>https://api.anthropic.com</code></td></tr>
              <tr><td>Google Gemini</td><td>Gemini API</td><td><code>https://generativelanguage.googleapis.com</code></td></tr>
            </tbody>
          </table></div>
          <div class="callout tip"><p><strong>經驗法則：</strong>閱讀廠商的 API 文件，選擇它所描述的格式。如果廠商同時提供多種格式，OpenAI 相容格式的支援最廣泛，是穩妥的預設選擇。</p></div>

          <h3 id="remote">遠端廠商 API</h3>
          <ol class="doc-steps">
            <li><b>取得憑證</b>
              <p>在廠商控制台建立 API 金鑰。請確認帳戶有可用額度或餘額，並且已開通你要使用的模型。</p></li>
            <li><b>新增服務商</b>
              <p>在 CodeFlux 中新增服務商，選擇協定，然後貼上 Base URL 與 API 金鑰。</p></li>
            <li><b>新增模型 ID</b>
              <p>填寫準確的模型 ID。一個服務商下可以設定多個模型，例如用速度快的模型做簡單修改，用能力更強的模型做規劃。</p></li>
            <li><b>測試連線</b>
              <p>用新模型開啟一個工作階段並傳送一則簡短的訊息。如果它能正常回覆，設定就完成了。</p></li>
          </ol>
          <div class="callout warn"><p>API 金鑰相當於密碼。請勿外洩，也不要提交到程式碼儲存庫。建議使用權限受限的金鑰，並在廠商控制台設定消費上限。</p></div>

          <h3 id="local">本機模型</h3>
          <p>如果希望所有內容都留在自己的硬體上，可以用本機執行環境來運行模型，再讓 CodeFlux 連線到它。任何提供 OpenAI 相容 API 的執行環境都可以，包括 <strong>Ollama</strong>、<strong>LM Studio</strong> 與 <strong>vLLM</strong>。</p>
          <p>以 Ollama 為例：</p>
<pre data-lang="bash"><code># 1. 下載模型
ollama pull qwen2.5-coder:7b

# 2. 檢查服務是否運行，模型是否在清單中
curl http://localhost:11434/v1/models</code></pre>
          <p>然後在 CodeFlux 中新增服務商，填寫下列值：</p>
          <dl class="field-list">
            <div><dt>協定</dt><dd>OpenAI 相容</dd></div>
            <div><dt>Base URL</dt><dd><code>http://localhost:11434/v1</code></dd></div>
            <div><dt>API 金鑰</dt><dd>任意預留值，例如 <code>ollama</code></dd></div>
            <div><dt>模型 ID</dt><dd><code>qwen2.5-coder:7b</code>（以 <code>ollama list</code> 顯示的名稱為準）</dd></div>
          </dl>
          <p>部署在內網其他機器上的模型用法相同：把 <code>localhost</code> 換成那台機器的位址，並確保其服務監聽了網路介面、防火牆放行了對應連接埠。</p>
          <div class="callout tip"><p><strong>如何選擇本機模型：</strong>智慧體依賴工具呼叫與較長的上下文。請選擇支援函式 / 工具呼叫、上下文視窗不少於 32K tokens 的模型。參數量很小的模型聊天表現可能不錯，但處理多步驟任務時往往力不從心。</p></div>

          <h3 id="vendors">廠商設定參考</h3>
          <p>下表列出常用的接入位址，幫助你快速上手。模型 ID 更新頻繁，請始終以廠商目前的模型清單為準。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>廠商</th><th>協定</th><th>Base URL</th><th>模型 ID 範例</th></tr></thead>
            <tbody>
              <tr><td>OpenAI</td><td>OpenAI 相容</td><td><code>https://api.openai.com/v1</code></td><td><code>gpt-4o</code></td></tr>
              <tr><td>Anthropic（Claude）</td><td>Anthropic</td><td><code>https://api.anthropic.com</code></td><td><code>claude-sonnet-4-5</code></td></tr>
              <tr><td>Google Gemini</td><td>Google Gemini</td><td><code>https://generativelanguage.googleapis.com</code></td><td><code>gemini-2.5-pro</code></td></tr>
              <tr><td>DeepSeek</td><td>OpenAI 相容</td><td><code>https://api.deepseek.com/v1</code></td><td><code>deepseek-chat</code></td></tr>
              <tr><td>通義千問（阿里雲）</td><td>OpenAI 相容</td><td><code>https://dashscope.aliyuncs.com/compatible-mode/v1</code></td><td><code>qwen-plus</code></td></tr>
              <tr><td>Kimi（月之暗面）</td><td>OpenAI 相容</td><td><code>https://api.moonshot.cn/v1</code></td><td><code>moonshot-v1-32k</code></td></tr>
              <tr><td>智譜 GLM</td><td>OpenAI 相容</td><td><code>https://open.bigmodel.cn/api/paas/v4</code></td><td><code>glm-4-plus</code></td></tr>
              <tr><td>豆包（火山引擎）</td><td>OpenAI 相容</td><td><code>https://ark.cn-beijing.volces.com/api/v3</code></td><td><code>ep-…</code>（你的接入點 ID）</td></tr>
              <tr><td>Ollama</td><td>OpenAI 相容</td><td><code>http://localhost:11434/v1</code></td><td>以 <code>ollama list</code> 為準</td></tr>
              <tr><td>LM Studio</td><td>OpenAI 相容</td><td><code>http://localhost:1234/v1</code></td><td>以 LM Studio 中顯示為準</td></tr>
              <tr><td>vLLM</td><td>OpenAI 相容</td><td><code>http://localhost:8000/v1</code></td><td>啟動時 <code>--model</code> 指定的名稱</td></tr>
            </tbody>
          </table></div>
          <p>未在此列出的廠商，包括各類閘道、聚合平台與貴公司的內部模型服務，接入方式完全相同：使用其文件中給出的位址與協定即可。</p>

          <h3 id="switching">管理與切換</h3>
          <ul>
            <li>可以新增多個服務商與模型，並為每個工作階段選擇使用哪一個。</li>
            <li>隨時切換模型，無須離開目前專案。例如用能力強的模型做規劃，用速度快、成本低的模型做日常修改。</li>
            <li>更換金鑰時，編輯對應服務商並貼上新金鑰即可，既有工作階段會自動使用新金鑰。</li>
            <li>刪除不再使用的服務商，保持清單整潔。</li>
          </ul>
        `,

  'dc.use.h': '日常使用',
  'dc.use.b': `
          <h3 id="workspace">專案與工作階段</h3>
          <p>選擇專案資料夾即可開啟專案。智慧體只會讀取與修改該資料夾內的檔案，因此始終基於你的真實程式碼工作。每個任務都在各自的<strong>工作階段</strong>中進行，並以分頁形式呈現。你可以同時執行多個工作階段並隨時切換，互不干擾。</p>

          <h3 id="tasks">下達任務</h3>
          <p>描述你想要的結果，而不是具體的操作步驟。好的需求會說明目標、範圍，以及你將如何判斷完成。</p>
          <ul>
            <li><em>「修復登入逾時的問題。從驗證中介層著手，並補上一個迴歸測試。」</em></li>
            <li><em>「升級本專案的相依套件，並確保建置依然通過。」</em></li>
          </ul>
          <p>對於較大的工作，CodeFlux 會先分析程式庫並草擬一份可編輯的計畫，在你確認後才會開始執行。隨後它會修改檔案、執行指令與測試，並在過程中自行修復錯誤。</p>
          <div class="callout tip"><p>需要時可以附上截圖、文件或錯誤訊息。上下文越具體，所需的溝通輪次就越少。</p></div>

          <h3 id="commands">指令與引用</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>輸入</th><th>作用</th></tr></thead>
            <tbody>
              <tr><td><kbd>/</kbd></td><td>開啟指令清單，無須離開輸入框即可執行內建操作。</td></tr>
              <tr><td><kbd>@</kbd></td><td>將專案中的檔案或資料夾作為精確的上下文加入對話中。</td></tr>
            </tbody>
          </table></div>

          <h3 id="review">審閱改動</h3>
          <p>每一處改動都以 diff 形式呈現，你可以逐行查看具體修改了什麼，然後選擇接受、還原或提交到 Git。由於每一步都可以復原，即使智慧體做了大量修改，你也始終掌握主動權。</p>
          <div class="callout"><p>建議在專案中使用 Git。執行大型任務前保持工作區乾淨，便於比對、審閱與還原。</p></div>
        `,

  'dc.advanced.h': '進階',
  'dc.advanced.b': `
          <h3 id="mcp">MCP</h3>
          <p>模型上下文協定（MCP）讓 CodeFlux 能夠使用外部工具與資料來源，例如 GitHub、資料庫、Figma、瀏覽器或 Docker。每一種整合都是一個 <strong>MCP 服務</strong>，新增一次後，智慧體就可以在需要時呼叫。</p>
          <ol>
            <li>找到你需要的 MCP 服務，記下它的啟動指令或 URL。</li>
            <li>在 CodeFlux 的 MCP 設定中新增它，並填寫指令、參數以及所需的環境變數（例如存取權杖）。</li>
            <li>確認該服務的工具已出現，然後讓智慧體使用它們。</li>
          </ol>
          <p>大多數服務的文件都會給出類似這樣的設定：</p>
<pre data-lang="json"><code>{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "&lt;your-token&gt;" }
    }
  }
}</code></pre>
          <div class="callout warn"><p>MCP 服務可以讀取資料並代表你執行操作。請只安裝你信任的服務，並為權杖授予所需的最小權限。</p></div>

          <h3 id="agents">多智慧體模式</h3>
          <p>面對複雜任務，CodeFlux 可以把工作分配給不同角色並行推進：由<strong>規劃者</strong>草擬方案，<strong>編碼者</strong>負責實作，<strong>測試者</strong>撰寫並執行測試，<strong>審查者</strong>檢查結果。每個角色都可以使用最適合自己的模型，因此你可以把強大的規劃模型和速度快的編碼模型搭配使用。</p>
        `,

  'dc.privacy.h': '隱私與安全',
  'dc.privacy.b': `
          <p>CodeFlux 的設計原則是：資料去哪裡，由你決定。</p>
          <div class="table-wrap"><table>
            <thead><tr><th>資料</th><th>存放位置</th></tr></thead>
            <tbody>
              <tr><td>專案檔案、索引、工作階段記錄</td><td>在你的電腦上，不會主動上傳。</td></tr>
              <tr><td>服務商設定與 API 金鑰</td><td>在你的電腦上。</td></tr>
              <tr><td>請求上下文（提示詞與相關程式碼）</td><td>僅傳送給你選擇的模型服務商，且僅在你使用時傳送。</td></tr>
              <tr><td>送往本機模型的請求</td><td>留在你的電腦或內網之內，可以完全離線工作。</td></tr>
            </tbody>
          </table></div>
          <h4>建議</h4>
          <ul>
            <li>處理敏感程式碼時，請使用本機模型或部署在企業內部的模型服務。</li>
            <li>向雲端廠商傳送專有程式碼之前，請先了解其資料政策。</li>
            <li>使用專用且權限受限的金鑰，並定期更換。</li>
            <li>把專案納入版本控制，讓每一處改動都可以審閱與還原。</li>
          </ul>
        `,

  'dc.trouble.h': '疑難排解',
  'dc.trouble.b': `
          <h3 id="ts-model">模型連線</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>現象</th><th>可能原因</th><th>處理辦法</th></tr></thead>
            <tbody>
              <tr><td><code>401</code> / <code>403</code></td><td>金鑰錯誤、過期或無權限；區域或帳戶不對。</td><td>重新複製金鑰，注意不要帶空格或引號。確認金鑰屬於該廠商，且你的帳戶已開通該模型。</td></tr>
              <tr><td><code>404</code> / 「模型不存在」</td><td>Base URL 路徑或模型 ID 有誤。</td><td>使用廠商文件給出的位址，通常以 <code>/v1</code> 結尾，且不含 <code>/chat/completions</code>。模型 ID 請原樣複製。</td></tr>
              <tr><td><code>429</code></td><td>觸發限流或額度用盡。</td><td>稍後重試，到廠商控制台檢查餘額與限額，或切換到其他模型。</td></tr>
              <tr><td>逾時 / 連線被拒絕</td><td>網路、代理或防火牆問題；本機服務未啟動。</td><td>用瀏覽器或 <code>curl</code> 存取 Base URL。使用本機模型時，確認執行環境已啟動且連接埠正確。</td></tr>
              <tr><td>格式錯誤或「不支援的參數」</td><td>協定格式與服務商不符。</td><td>把協定切換為廠商文件所描述的那一種。不確定時可嘗試 OpenAI 相容。</td></tr>
              <tr><td>智慧體能回覆，但不會修改檔案或呼叫工具</td><td>模型不支援工具呼叫，或上下文視窗太小。</td><td>選擇支援工具 / 函式呼叫、上下文不少於 32K tokens 的模型。</td></tr>
            </tbody>
          </table></div>

          <h3 id="ts-install">安裝與啟動</h3>
          <div class="table-wrap"><table>
            <thead><tr><th>現象</th><th>處理辦法</th></tr></thead>
            <tbody>
              <tr><td>Windows：「Windows 已保護您的電腦」</td><td>該版本未簽章。點選<strong>其他資訊</strong>，再點選<strong>仍要執行</strong>。</td></tr>
              <tr><td>macOS：無法開啟應用程式，或提示「已損毀」</td><td>解開後在終端機執行 <code>xattr -cr CodeFlux.app</code>，然後重新開啟。</td></tr>
              <tr><td>Linux：AppImage 無法啟動</td><td>用 <code>chmod +x</code> 賦予執行權限；如果你的發行版需要，請安裝 <code>libfuse2</code>。</td></tr>
              <tr><td>雜湊值不一致</td><td>重新下載檔案（建議在穩定的網路下），並與同一版本的 <code>SHA256SUMS.txt</code> 比對。</td></tr>
            </tbody>
          </table></div>
        `,

  'dc.support.h': '取得協助',
  'dc.support.b': `
          <p>仍然沒能解決？聯絡我們時，請附上 CodeFlux 版本、作業系統、所使用的服務商與協定，以及完整的錯誤訊息。<strong>請勿附上你的 API 金鑰。</strong></p>
          <ul>
            <li>技術支援：<a href="mailto:support@routok.com">support@routok.com</a></li>
            <li>價格、團隊版與企業版：<a href="mailto:sales@routok.com">sales@routok.com</a></li>
            <li>版本發布與原始碼：<a href="https://github.com/ContessaIntelligence/codeflux" target="_blank" rel="noopener">GitHub</a></li>
          </ul>
        `,
  'dc.foot.t': '準備好試試了嗎？', 'dc.foot.s': '下載 CodeFlux，幾分鐘內接入你的第一個模型。',
  'ab.crumb.home': '首頁', 'ab.cta.b1': '下載 CodeFlux'
});
