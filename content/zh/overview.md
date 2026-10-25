# RouTok 使用指南

从选择模型到完成调用，再到核对费用，这份指南帮助你把 AI 接入日常工作和自己的应用。

## 选择你的起点

| 我想做什么 | 从这里开始 | 完成后可以 |
| --- | --- | --- |
| 先体验 AI | [在线测试](/docs/playground) | 在网页中选择模型并获得回复 |
| 接入聊天软件 | [创建密钥](/docs/keys) → [客户端接入](/docs/clients) | 在常用软件中使用本站模型 |
| 开发自己的应用 | [首次调用](/docs/quickstart) → [SDK 示例](/docs/sdk) | 发起请求并读取结果 |
| 了解费用 | [钱包与套餐](/docs/wallet) → [计费说明](/docs/costs) | 看懂余额、预算和调用费用 |
| 解决调用问题 | [错误排查](/docs/troubleshooting) | 根据现象定位下一步 |

尚未注册？先完成[注册与登录](/docs/account)。已经有账号的用户可以直接打开[控制台](/dashboard)。

## 接入前准备三个值

- **API 地址**：在[API 密钥页面](/keys)打开“API 地址”，复制本站提供的接入地址。
- **API 密钥**：为当前应用创建的模型调用凭据。
- **模型 ID**：从[模型广场](/pricing)选择，或用该密钥查询模型列表。

网站登录密码、个人访问令牌 PAT 和上游服务商的密钥不能替代本站模型 API 密钥。详细区别见[核心概念](/docs/concepts)。

## 如何使用本指南

操作入口以当前账号可见页面为准。支付方式、套餐和模型能力由本站实际配置决定；遇到缺少入口或权限提示时，可通过[站内支持](/docs/support)确认。

代码中的 `https://gateway.example.com`、`your-enabled-model` 和示例 ID 均为占位符，使用前需要替换。示例响应用于解释结构，不代表本站承诺开放的模型、价格或服务结果。

## 文档版本与适用范围

本轮内容核验日期为 **2026-10-21**，依据 New API 源码提交 [058c8231b](https://github.com/QuantumNous/new-api/tree/058c8231b68c51ee02abee15befcd720fee9f4a2)。接口路径和页面入口已按该版本核对；示例未连接真实上游进行全量验证。模型兼容性请结合[协议说明](/docs/protocols)和实际调用结果判断。

## New API 文档与项目归属

New API 是由 QuantumNous 维护的开源 AI 网关。RouTok 使用该项目提供的平台能力。项目资料：[官方文档](https://docs.newapi.ai/zh/docs)、[源码](https://github.com/QuantumNous/new-api)、[发布记录](https://github.com/QuantumNous/new-api/releases)。实际可用服务和价格以 RouTok 页面为准。
