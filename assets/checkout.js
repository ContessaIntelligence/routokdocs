(function () {
  'use strict';
  // Purchase flow: checkout -> result -> receipt -> refund request, plus the sales enquiry form.
  // Accounts in CF_PAY_BYPASS (assets/config.js) are completed without a payment partner; all others use the backend.
  var page = document.body.getAttribute('data-page') || '';
  var q = new URLSearchParams(location.search);
  var BYPASS = (window.CF_PAY_BYPASS || []).map(function (e) { return String(e).toLowerCase(); });
  var METHODS = window.CF_PAY_METHODS || ['card'];
  var SUPPORT = window.CF_SUPPORT_EMAIL || 'support@routok.com';
  var SALES = window.CF_SALES_EMAIL || 'sales@routok.com';
  var STORE = 'cf-orders';
  var PRO_PLAN = window.CF_PRO_PLAN_MATCH || /codeflux.*pro/i;
  var AUTH = window.CF_AUTH;
  var DAY = 86400000;

  function $(id) { return document.getElementById(id); }
  function lang() { return document.documentElement.lang || 'en'; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function isBypass(email) { return !!email && BYPASS.indexOf(String(email).toLowerCase()) >= 0; }

  /* ---------------- text: English for data-ct elements comes from the HTML itself ---------------- */
  var D = {
    en: {
      'common.loading': 'Loading…', plan_fmt: 'CodeFlux Pro · {cycle}', comp_fmt: '{amount} · Complimentary', back_pricing: 'Back to pricing', add1: '1 month', add12: '12 months',
      paybtn: 'Pay {amount}', per1: 'Valid for 1 month', per12: 'Valid for 12 months', cycle_month: 'Monthly', cycle_year: 'Yearly',
      st_paid: 'Paid', st_pending: 'Pending', st_failed: 'Failed', st_cancelled: 'Cancelled',
      col_order: 'Order', col_plan: 'Plan', col_amount: 'Amount', col_status: 'Status', col_date: 'Date', act_receipt: 'Receipt', act_refund: 'Request refund', orders_empty: 'No orders yet.',
      err_name: 'Please enter your full name.', err_country: 'Please enter your country or region.',
      err_terms: 'Please accept the Terms of Service and Refund Policy to continue.',
      err_unavail: 'Online payment is not open yet, so we could not take this order. Please try again later or email sales@routok.com.',
      err_start: 'Could not start the payment. Please try again.', err_orderno: 'Please enter your order number.',
      already_pro: 'Your Pro plan is active until {date}. This purchase adds {period} after it.',
      elig_yes: 'This order is eligible for a full refund until {date}.',
      elig_no: 'The refund window for this order ended on {date}. It is no longer eligible under our Refund Policy, but you are welcome to contact us.',
      elig_none: 'Only paid orders can be refunded.', elig_comp: 'This order was complimentary, so there is nothing to refund.',
      rf_subject: 'Refund request: order {id}',
      rf_body: 'Order number: {id}\nPlan: {plan}\nAmount: {amount}\nPaid on: {date}\nAccount: {email}\nReason: {reason}\n\nDetails:\n{details}\n',
      sl_subject: 'CodeFlux {interest} enquiry', sl_body: 'Name: {name}\nWork email: {email}\nCompany: {company}\nTeam size: {size}\nInterested in: {interest}\n\nMessage:\n{message}\n',
      err_fill: 'Please fill in the required fields.', err_consent: 'Please tick the box to let us contact you.',
      copied: 'Copied', copy: 'Copy message', missing: 'We could not find this order. Please check the link or sign in with the account that placed it.',
      pay_card: 'Credit or debit card', pay_alipay: 'Alipay', pay_wechat: 'WeChat Pay', pay_unionpay: 'UnionPay', pay_complimentary: 'Complimentary',
      rt_ok_h: 'Payment successful', rt_ok_s: 'Thank you. Your plan is now active.', rt_comp_h: 'Order complete', rt_comp_s: 'Your plan is now active.',
      rt_fail_h: 'Payment failed', rt_fail_s: 'Your card was not charged. You can try again or use another payment method.',
      rt_cancel_h: 'Payment cancelled', rt_cancel_s: 'Nothing was charged. You can return to checkout whenever you are ready.',
      rt_pend_h: 'Confirming your payment…', rt_pend_s: 'This usually takes a few seconds. Please keep this page open.',
      rt_wait_h: 'Payment received, activating your plan', rt_wait_s: 'It is taking a little longer than usual. Your plan will appear in your account shortly.',
      rt_order: 'Order number', rt_plan: 'Plan', rt_amount: 'Amount paid', rt_date: 'Date', rt_until: 'Valid until', rt_email: 'Account',
      rt_next: 'What happens next', rt_n1: 'Sign in to the CodeFlux app with this account.', rt_n2: 'Pro features are unlocked for your account.', rt_n3: 'Your plan does not renew automatically. We remind you before it ends.',
      rt_receipt: 'View receipt', rt_account: 'Go to my account', rt_dl: 'Download CodeFlux', rt_retry: 'Try again', rt_help: 'Contact support', rt_back: 'Back to checkout',
      rc_h: 'Receipt', rc_to: 'Billed to', rc_no: 'Order number', rc_date: 'Date', rc_method: 'Payment method',
      rc_period: 'Service period', rc_desc: 'Description', rc_amt: 'Amount', rc_total: 'Total paid', rc_status: 'Status', rc_comp: 'Complimentary',
      rc_note: 'This receipt confirms your order. For a tax invoice, email sales@routok.com with your company name and tax ID.',
      rc_print: 'Print or save as PDF', rc_back: 'Back to account'
    },
    'zh-CN': {
      'common.loading': '加载中…', plan_fmt: 'CodeFlux Pro（{cycle}）', comp_fmt: '{amount}（赠送）', back_pricing: '返回价格方案', add1: '1 个月', add12: '12 个月',
      paybtn: '支付 {amount}', per1: '有效期 1 个月', per12: '有效期 12 个月', cycle_month: '按月', cycle_year: '按年',
      st_paid: '已支付', st_pending: '待支付', st_failed: '失败', st_cancelled: '已取消',
      col_order: '订单', col_plan: '套餐', col_amount: '金额', col_status: '状态', col_date: '日期', act_receipt: '收据', act_refund: '申请退款', orders_empty: '暂无订单。',
      err_name: '请填写姓名。', err_country: '请填写国家或地区。',
      err_terms: '请先同意《服务条款》和《退款政策》后继续。',
      err_unavail: '在线支付暂未开放，暂时无法完成付款。请稍后再试，或发送邮件至 sales@routok.com。',
      err_start: '无法发起支付，请重试。', err_orderno: '请填写订单号。',
      already_pro: '你的专业版有效期至 {date}，本次购买将在此基础上增加 {period}。',
      elig_yes: '该订单可在 {date} 前申请全额退款。',
      elig_no: '该订单的退款期已于 {date} 结束，按退款政策不再符合退款条件，但欢迎联系我们。',
      elig_none: '仅已支付的订单可以申请退款。', elig_comp: '该订单为赠送开通，无需退款。',
      rf_subject: '退款申请：订单 {id}',
      rf_body: '订单号：{id}\n套餐：{plan}\n金额：{amount}\n支付日期：{date}\n账号：{email}\n原因：{reason}\n\n补充说明：\n{details}\n',
      sl_subject: 'CodeFlux {interest}咨询', sl_body: '姓名：{name}\n工作邮箱：{email}\n公司：{company}\n团队规模：{size}\n感兴趣的方案：{interest}\n\n需求说明：\n{message}\n',
      err_fill: '请填写必填项。', err_consent: '请勾选同意，以便我们联系你。',
      copied: '已复制', copy: '复制内容', missing: '找不到该订单。请检查链接，或使用下单的账号登录。',
      pay_card: '信用卡或借记卡', pay_alipay: '支付宝', pay_wechat: '微信支付', pay_unionpay: '银联', pay_complimentary: '赠送',
      rt_ok_h: '支付成功', rt_ok_s: '感谢你的购买，套餐已生效。', rt_comp_h: '订单已完成', rt_comp_s: '你的套餐已生效。',
      rt_fail_h: '支付失败', rt_fail_s: '你的银行卡未被扣款。可以重试，或使用其他付款方式。',
      rt_cancel_h: '支付已取消', rt_cancel_s: '未产生任何扣款。准备好后可随时回到结算页。',
      rt_pend_h: '正在确认付款…', rt_pend_s: '通常只需几秒，请保持此页面打开。',
      rt_wait_h: '已收到付款，正在开通套餐', rt_wait_s: '比平时慢了一点，你的套餐很快会出现在账号中。',
      rt_order: '订单号', rt_plan: '套餐', rt_amount: '实付金额', rt_date: '日期', rt_until: '有效期至', rt_email: '账号',
      rt_next: '接下来', rt_n1: '用该账号登录 CodeFlux 客户端。', rt_n2: '专业版功能将为你的账号解锁。', rt_n3: '套餐不会自动续费，到期前我们会提醒你。',
      rt_receipt: '查看收据', rt_account: '前往我的账号', rt_dl: '下载 CodeFlux', rt_retry: '重试', rt_help: '联系客服', rt_back: '返回结算页',
      rc_h: '收据', rc_to: '收款对象', rc_no: '订单号', rc_date: '日期', rc_method: '付款方式',
      rc_period: '服务期限', rc_desc: '项目', rc_amt: '金额', rc_total: '实付合计', rc_status: '状态', rc_comp: '赠送',
      rc_note: '此收据用于确认你的订单。如需正式发票，请发送邮件至 sales@routok.com，并附上公司名称和税号。',
      rc_print: '打印或另存为 PDF', rc_back: '返回账号',
      /* static page text */
      'co.s1': '套餐', 'co.s2': '付款', 'co.s3': '完成', 'co.h1': '结算', 'co.proc': '正在处理你的付款…',
      'co.acct.h': '账号', 'co.acct.as': '当前登录', 'co.acct.switch': '切换账号',
      'co.per.h': '付费周期', 'co.per.m': '按月', 'co.per.y': '按年',
      'co.bill.h': '账单信息', 'co.bill.name': '姓名', 'co.bill.country': '国家或地区', 'co.bill.company': '公司名称（选填）', 'co.bill.tax': '税号（选填）',
      'co.bill.hint': '会显示在收据上。需要正式发票？付款后请发送邮件至 sales@routok.com。',
      'co.pay.h': '付款方式', 'co.pay.note': '你将在支付合作方的安全页面完成付款。',
      'co.terms': '我已阅读并同意<a href="terms.html" target="_blank" rel="noopener">《服务条款》</a>和<a href="refund.html" target="_blank" rel="noopener">《退款政策》</a>，并了解这是预付费购买，套餐不会自动续费。',
      'co.sum.h': '订单摘要', 'co.sum.sub': '小计', 'co.sum.tax': '税费', 'co.sum.taxv': '如适用，付款时计算', 'co.sum.total': '今日应付',
      'co.sum.l1': '付款后立即生效', 'co.sum.l2': '按所示周期预付费，不自动续费', 'co.sum.l3': '首次购买 7 天内可全额退款',
      'co.sec': '付款由我们的持牌支付合作方处理，CodeFlux 不会接触或保存你的银行卡信息。',
      'co.need': '需要团队版或企业版？', 'co.need.a': '联系销售',
      'rq.h': '申请退款', 'rq.sub': '告诉我们订单情况，我们会在 3 个工作日内回复。', 'rq.order': '订单', 'rq.orderno': '订单号',
      'rq.reason': '原因', 'rq.r1': '与预期不符', 'rq.r2': '缺少我需要的功能', 'rq.r3': '误购或重复扣款', 'rq.r4': '遇到技术问题', 'rq.r5': '其他',
      'rq.details': '补充说明（选填）', 'rq.btn': '生成退款申请',
      'rq.note': '这会打开你的邮件应用并填好申请内容，在邮件应用里点击发送后才会真正发出。',
      'rq.policy': '查看<a href="refund.html">退款政策</a>', 'rq.sent.h': '申请内容已准备好',
      'rq.sent.p': '如果邮件应用没有打开，请把下面的内容发送到 support@routok.com。', 'rq.back': '返回我的账号',
      'sl.h': '和我们的团队聊聊', 'sl.sub': '告诉我们你的团队情况，我们会在 2 个工作日内回复。',
      'sl.name': '姓名', 'sl.email': '工作邮箱', 'sl.company': '公司', 'sl.size': '团队规模', 'sl.interest': '感兴趣的方案',
      'sl.i1': '团队版', 'sl.i2': '企业版', 'sl.i3': '还不确定', 'sl.msg': '你的需求（选填）',
      'sl.consent': '我同意 CodeFlux 就我的咨询与我联系。详见<a href="privacy.html" target="_blank" rel="noopener">《隐私政策》</a>。',
      'sl.btn': '发送咨询', 'sl.note': '这会打开你的邮件应用并填好咨询内容，在邮件应用里点击发送后才会真正发出。',
      'sl.side.h': '你可以期待', 'sl.s1': '2 个工作日内收到回复', 'sl.s2': '按席位和需求给出报价', 'sl.s3': '书面协议与对公发票', 'sl.s4': '团队版含 5 个席位，企业版按需求定制',
      'sl.sent.h': '咨询内容已准备好', 'sl.sent.p': '如果邮件应用没有打开，请把下面的内容发送到 sales@routok.com。', 'sl.back': '返回价格方案'
    },
    'zh-Hant': {
      'common.loading': '載入中…', plan_fmt: 'CodeFlux Pro（{cycle}）', comp_fmt: '{amount}（贈送）', back_pricing: '返回價格方案', add1: '1 個月', add12: '12 個月',
      paybtn: '支付 {amount}', per1: '有效期 1 個月', per12: '有效期 12 個月', cycle_month: '按月', cycle_year: '按年',
      st_paid: '已支付', st_pending: '待支付', st_failed: '失敗', st_cancelled: '已取消',
      col_order: '訂單', col_plan: '方案', col_amount: '金額', col_status: '狀態', col_date: '日期', act_receipt: '收據', act_refund: '申請退款', orders_empty: '暫無訂單。',
      err_name: '請填寫姓名。', err_country: '請填寫國家或地區。',
      err_terms: '請先同意《服務條款》和《退款政策》後繼續。',
      err_unavail: '線上支付暫未開放，暫時無法完成付款。請稍後再試，或寄信至 sales@routok.com。',
      err_start: '無法發起支付，請重試。', err_orderno: '請填寫訂單編號。',
      already_pro: '你的專業版有效期至 {date}，本次購買將在此基礎上增加 {period}。',
      elig_yes: '該訂單可在 {date} 前申請全額退款。',
      elig_no: '該訂單的退款期已於 {date} 結束，依退款政策不再符合退款條件，但歡迎聯絡我們。',
      elig_none: '僅已支付的訂單可以申請退款。', elig_comp: '該訂單為贈送開通，無需退款。',
      rf_subject: '退款申請：訂單 {id}',
      rf_body: '訂單編號：{id}\n方案：{plan}\n金額：{amount}\n支付日期：{date}\n帳號：{email}\n原因：{reason}\n\n補充說明：\n{details}\n',
      sl_subject: 'CodeFlux {interest}諮詢', sl_body: '姓名：{name}\n工作電子郵件：{email}\n公司：{company}\n團隊規模：{size}\n感興趣的方案：{interest}\n\n需求說明：\n{message}\n',
      err_fill: '請填寫必填項。', err_consent: '請勾選同意，以便我們聯絡你。',
      copied: '已複製', copy: '複製內容', missing: '找不到該訂單。請檢查連結，或使用下單的帳號登入。',
      pay_card: '信用卡或簽帳卡', pay_alipay: '支付寶', pay_wechat: '微信支付', pay_unionpay: '銀聯', pay_complimentary: '贈送',
      rt_ok_h: '支付成功', rt_ok_s: '感謝你的購買，方案已生效。', rt_comp_h: '訂單已完成', rt_comp_s: '你的方案已生效。',
      rt_fail_h: '支付失敗', rt_fail_s: '你的銀行卡未被扣款。可以重試，或使用其他付款方式。',
      rt_cancel_h: '支付已取消', rt_cancel_s: '未產生任何扣款。準備好後可隨時回到結帳頁。',
      rt_pend_h: '正在確認付款…', rt_pend_s: '通常只需幾秒，請保持此頁面開啟。',
      rt_wait_h: '已收到付款，正在開通方案', rt_wait_s: '比平時慢了一點，你的方案很快會出現在帳號中。',
      rt_order: '訂單編號', rt_plan: '方案', rt_amount: '實付金額', rt_date: '日期', rt_until: '有效期至', rt_email: '帳號',
      rt_next: '接下來', rt_n1: '用該帳號登入 CodeFlux 用戶端。', rt_n2: '專業版功能將為你的帳號解鎖。', rt_n3: '方案不會自動續費，到期前我們會提醒你。',
      rt_receipt: '查看收據', rt_account: '前往我的帳號', rt_dl: '下載 CodeFlux', rt_retry: '重試', rt_help: '聯絡客服', rt_back: '返回結帳頁',
      rc_h: '收據', rc_to: '收款對象', rc_no: '訂單編號', rc_date: '日期', rc_method: '付款方式',
      rc_period: '服務期限', rc_desc: '項目', rc_amt: '金額', rc_total: '實付合計', rc_status: '狀態', rc_comp: '贈送',
      rc_note: '此收據用於確認你的訂單。如需正式發票，請寄信至 sales@routok.com，並附上公司名稱和稅號。',
      rc_print: '列印或另存為 PDF', rc_back: '返回帳號',
      'co.s1': '方案', 'co.s2': '付款', 'co.s3': '完成', 'co.h1': '結帳', 'co.proc': '正在處理你的付款…',
      'co.acct.h': '帳號', 'co.acct.as': '目前登入', 'co.acct.switch': '切換帳號',
      'co.per.h': '付費週期', 'co.per.m': '按月', 'co.per.y': '按年',
      'co.bill.h': '帳單資訊', 'co.bill.name': '姓名', 'co.bill.country': '國家或地區', 'co.bill.company': '公司名稱（選填）', 'co.bill.tax': '稅號（選填）',
      'co.bill.hint': '會顯示在收據上。需要正式發票？付款後請寄信至 sales@routok.com。',
      'co.pay.h': '付款方式', 'co.pay.note': '你將在支付合作夥伴的安全頁面完成付款。',
      'co.terms': '我已閱讀並同意<a href="terms.html" target="_blank" rel="noopener">《服務條款》</a>和<a href="refund.html" target="_blank" rel="noopener">《退款政策》</a>，並了解這是預付費購買，方案不會自動續費。',
      'co.sum.h': '訂單摘要', 'co.sum.sub': '小計', 'co.sum.tax': '稅費', 'co.sum.taxv': '如適用，付款時計算', 'co.sum.total': '今日應付',
      'co.sum.l1': '付款後立即生效', 'co.sum.l2': '按所示週期預付費，不自動續費', 'co.sum.l3': '首次購買 7 天內可全額退款',
      'co.sec': '付款由我們的持牌支付合作夥伴處理，CodeFlux 不會接觸或保存你的銀行卡資訊。',
      'co.need': '需要團隊版或企業版？', 'co.need.a': '聯絡銷售',
      'rq.h': '申請退款', 'rq.sub': '告訴我們訂單情況，我們會在 3 個工作日內回覆。', 'rq.order': '訂單', 'rq.orderno': '訂單編號',
      'rq.reason': '原因', 'rq.r1': '與預期不符', 'rq.r2': '缺少我需要的功能', 'rq.r3': '誤購或重複扣款', 'rq.r4': '遇到技術問題', 'rq.r5': '其他',
      'rq.details': '補充說明（選填）', 'rq.btn': '產生退款申請',
      'rq.note': '這會開啟你的郵件應用並填好申請內容，在郵件應用裡按下傳送後才會真正發出。',
      'rq.policy': '查看<a href="refund.html">退款政策</a>', 'rq.sent.h': '申請內容已準備好',
      'rq.sent.p': '如果郵件應用沒有開啟，請把下面的內容寄到 support@routok.com。', 'rq.back': '返回我的帳號',
      'sl.h': '和我們的團隊聊聊', 'sl.sub': '告訴我們你的團隊情況，我們會在 2 個工作日內回覆。',
      'sl.name': '姓名', 'sl.email': '工作電子郵件', 'sl.company': '公司', 'sl.size': '團隊規模', 'sl.interest': '感興趣的方案',
      'sl.i1': '團隊版', 'sl.i2': '企業版', 'sl.i3': '還不確定', 'sl.msg': '你的需求（選填）',
      'sl.consent': '我同意 CodeFlux 就我的諮詢與我聯絡。詳見<a href="privacy.html" target="_blank" rel="noopener">《隱私權政策》</a>。',
      'sl.btn': '發送諮詢', 'sl.note': '這會開啟你的郵件應用並填好諮詢內容，在郵件應用裡按下傳送後才會真正發出。',
      'sl.side.h': '你可以期待', 'sl.s1': '2 個工作日內收到回覆', 'sl.s2': '按席位和需求提供報價', 'sl.s3': '書面協議與對公發票', 'sl.s4': '團隊版含 5 個席位，企業版按需求客製',
      'sl.sent.h': '諮詢內容已準備好', 'sl.sent.p': '如果郵件應用沒有開啟，請把下面的內容寄到 sales@routok.com。', 'sl.back': '返回價格方案'
    }
  };
  var STATIC_EN = {}, ctEls = Array.prototype.slice.call(document.querySelectorAll('[data-ct]'));
  ctEls.forEach(function (el) { STATIC_EN[el.getAttribute('data-ct')] = el.innerHTML; });
  function t(k, v) {
    var s = (D[lang()] || {})[k];
    if (s == null) s = D.en[k];
    if (s == null) s = STATIC_EN[k];
    if (s == null) s = k;
    if (v) for (var x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  }
  function applyStatic() {
    ctEls.forEach(function (el) {
      var k = el.getAttribute('data-ct'), v = (D[lang()] || {})[k];
      if (v == null) v = STATIC_EN[k];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
  }

  /* ---------------- formatting ---------------- */
  function loc() { return lang() === 'en' ? 'en-US' : lang(); }
  function fmtMoney(amount, cur) {
    try { return new Intl.NumberFormat(loc(), { style: 'currency', currency: (cur || 'USD').toUpperCase(), currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2 }).format(amount); }
    catch (e) { return (cur || 'USD') + ' ' + Number(amount).toFixed(2); }
  }
  function fmtDate(ms) {
    if (!ms) return '—';
    var d = new Date(ms);
    return isNaN(d) ? '—' : d.toLocaleDateString(loc(), { year: 'numeric', month: 'short', day: 'numeric' });
  }
  function fmtDateTime(ms) {
    var d = new Date(ms);
    return isNaN(d) ? '—' : d.toLocaleString(loc(), { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  /* ---------------- catalogue + local order store (bypass accounts only) ---------------- */
  var CATALOG = { pro: { month: { amount: 20, months: 1 }, year: { amount: 192, months: 12 } } };
  function planTitle(cycle) { return t('plan_fmt', { cycle: t('cycle_' + cycle) }); }
  function catalogPlans() {
    return ['month', 'year'].map(function (c) {
      return { id: 'local-' + c, title: planTitle(c), subtitle: '', price_amount: CATALOG.pro[c].amount, currency: 'USD', duration_unit: c, duration_value: 1 };
    });
  }
  function readAll() { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; } }
  function writeAll(a) { try { localStorage.setItem(STORE, JSON.stringify(a)); } catch (e) {} }
  function ordersFor(email) { return readAll().filter(function (o) { return o.email === email; }).sort(function (a, b) { return b.createdAt - a.createdAt; }); }
  function getOrder(id) { return readAll().filter(function (o) { return o.id === id; })[0] || null; }
  function saveOrder(o) { var a = readAll(), i = -1; a.forEach(function (x, n) { if (x.id === o.id) i = n; }); if (i < 0) a.push(o); else a[i] = o; writeAll(a); }
  function addMonths(ms, n) { var d = new Date(ms); d.setMonth(d.getMonth() + n); return d.getTime(); }
  function activeProEnd(email) {
    var now = Date.now(), best = 0;
    ordersFor(email).forEach(function (o) { if (o.status === 'paid' && o.endsAt > now && o.endsAt > best) best = o.endsAt; });
    return best;
  }
  function newId() {
    var d = new Date(), p = function (n) { return (n < 10 ? '0' : '') + n; }, cs = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', r = '', b = crypto.getRandomValues(new Uint8Array(6));
    for (var i = 0; i < b.length; i++) r += cs.charAt(b[i] % cs.length);
    return 'CF-' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + r;
  }
  function paidAmount(o) { return o.complimentary ? 0 : o.amount; }
  // Refund policy: 7 days after the first purchase, 3 days after a renewal. Complimentary orders have nothing to refund.
  function refundInfo(o) {
    var paid = ordersFor(o.email).filter(function (x) { return x.status === 'paid'; }).sort(function (a, b) { return a.paidAt - b.paidAt; });
    var first = paid.length > 0 && paid[0].id === o.id, days = first ? 7 : 3, deadline = (o.paidAt || 0) + days * DAY;
    return { eligible: o.status === 'paid' && !o.complimentary && Date.now() <= deadline, deadline: deadline, days: days };
  }
  window.CF_CO = { isBypass: isBypass, t: t, fmtMoney: fmtMoney, fmtDate: fmtDate, ordersFor: ordersFor, getOrder: getOrder, activeProEnd: activeProEnd, catalogPlans: catalogPlans, refundInfo: refundInfo, planTitle: planTitle, paidAmount: paidAmount };

  /* ---------------- helpers ---------------- */
  function requireUser() {
    return AUTH.me().then(function (u) {
      if (!u) {
        var here = location.pathname.split('/').pop() + location.search;
        location.replace('login.html?next=' + encodeURIComponent(here));
        return new Promise(function () {}); // stop this page while the browser navigates
      }
      return u;
    });
  }
  function show(el, kind, text) { if (!el) return; el.className = 'msg-box show ' + kind; el.textContent = text; }
  function hide(el) { if (el) { el.className = 'msg-box'; el.textContent = ''; } }
  function rerender(fn) { fn(); new MutationObserver(function () { applyStatic(); fn(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] }); }
  function mailto(to, subject, body) { return 'mailto:' + to + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body); }
  function copyText(text, btn) {
    function done() { var old = btn.textContent; btn.textContent = t('copied'); setTimeout(function () { btn.textContent = old; }, 1500); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else { var a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); done(); } catch (e) {} document.body.removeChild(a); }
  }
  function monthsOf(p) { return p.duration_unit === 'year' ? 12 * p.duration_value : p.duration_unit === 'month' ? p.duration_value : 1; }

  /* ================= CHECKOUT ================= */
  function initCheckout() {
    requireUser().then(function (u) {
      var byp = isBypass(u.email), cycle = q.get('cycle') === 'month' ? 'month' : 'year', live = null, method = METHODS[0] || 'card';
      $('coEmail').textContent = u.email;
      $('coSwitch').addEventListener('click', function () {
        var here = 'checkout.html?plan=pro&cycle=' + cycle;
        AUTH.logout().then(function () { location.replace('login.html?next=' + encodeURIComponent(here)); });
      });
      // regular accounts read the real plans from the backend; they only exist once payments are opened
      var plansP = byp
        ? Promise.resolve()
        : AUTH.authed('/subscription/plans').then(function (n) {
            var list = n.ok && Array.isArray(n.data) ? n.data.map(function (x) { return x.plan; }).filter(function (p) { return p && PRO_PLAN.test(p.title || ''); }) : [];
            live = {}; list.forEach(function (p) { live[monthsOf(p) >= 12 ? 'year' : 'month'] = p; });
          });
      plansP.then(function () {
        // Prices always come from the published price list so the page reads like any other checkout.
        // A backend plan (when payments are open) takes over the price and is what actually gets charged.
        function info(c) {
          var p = !byp && live && live[c];
          if (p) return { amount: p.price_amount, currency: p.currency, plan: p };
          return { amount: CATALOG.pro[c].amount, currency: 'USD', plan: null };
        }
        function render() {
          var i = info(cycle);
          ['month', 'year'].forEach(function (c) {
            var x = info(c);
            $(c === 'month' ? 'coPm' : 'coPy').textContent = fmtMoney(x.amount, x.currency);
            $(c === 'month' ? 'coPmS' : 'coPyS').textContent = t(c === 'month' ? 'per1' : 'per12');
            document.querySelector('input[name="cycle"][value="' + c + '"]').checked = c === cycle;
          });
          $('sumTitle').textContent = planTitle(cycle);
          $('sumPeriod').textContent = t(cycle === 'month' ? 'per1' : 'per12');
          $('sumSub').textContent = fmtMoney(i.amount, i.currency);
          $('sumTotal').textContent = fmtMoney(i.amount, i.currency);
          $('coPay').textContent = t('paybtn', { amount: fmtMoney(i.amount, i.currency) });
          var end = byp ? activeProEnd(u.email) : 0;
          if (end) show($('coNotice'), 'info', t('already_pro', { date: fmtDate(end), period: t(cycle === 'month' ? 'add1' : 'add12') }));
          else hide($('coNotice'));
          $('coMethods').innerHTML = METHODS.map(function (m) {
            return '<label class="method"><input type="radio" name="method" value="' + esc(m) + '"' + (m === method ? ' checked' : '') + '><span>' + esc(t('pay_' + m)) + '</span></label>';
          }).join('');
        }
        rerender(render);
        $('coCycle').addEventListener('change', function (e) {
          if (e.target.name !== 'cycle') return;
          cycle = e.target.value; hide($('coMsg'));
          try { history.replaceState(null, '', 'checkout.html?plan=pro&cycle=' + cycle); } catch (x) {}
          render();
        });
        $('coMethods').addEventListener('change', function (e) { if (e.target.name === 'method') method = e.target.value; });
        $('coLoading').hidden = true; $('coMain').hidden = false;

        $('coPay').addEventListener('click', function () {
          var box = $('coMsg'), btn = this, name = $('coName').value.trim(), country = $('coCountry').value.trim(), i = info(cycle);
          hide(box);
          if (!name) { $('coName').focus(); return show(box, 'err', t('err_name')); }
          if (!country) { $('coCountry').focus(); return show(box, 'err', t('err_country')); }
          if (!$('coTerms').checked) return show(box, 'err', t('err_terms'));
          // Regular accounts need a real backend plan to pay for. Until payments are open there is none, so say so clearly.
          if (!byp && !(i.plan && (i.plan.stripe_price_id || i.plan.creem_product_id))) return show(box, 'err', t('err_unavail'));
          btn.disabled = true; btn.setAttribute('aria-busy', 'true');

          if (byp) { // internal account: complete the order straight away, nothing is charged
            $('coProc').hidden = false;
            var now = Date.now(), start = Math.max(now, activeProEnd(u.email));
            var o = { id: newId(), email: u.email, plan: 'pro', cycle: cycle, amount: i.amount, currency: i.currency, status: 'paid', complimentary: true, method: 'complimentary',
              createdAt: now, paidAt: now, startsAt: start, endsAt: addMonths(start, CATALOG.pro[cycle].months),
              billing: { name: name, country: country, company: $('coCompany').value.trim(), taxId: $('coTax').value.trim() } };
            saveOrder(o);
            return setTimeout(function () { location.href = 'checkout-result.html?order=' + encodeURIComponent(o.id); }, 1600);
          }
          // regular account: ask the backend for a hosted payment link and hand over to the payment partner
          var p = i.plan, path = p.stripe_price_id ? '/subscription/stripe/pay' : '/subscription/creem/pay';
          AUTH.authed(path, { method: 'POST', body: { plan_id: p.id } }).then(function (n) {
            var url = n.ok && n.data && (n.data.pay_link || n.data.checkout_url);
            if (url) return (location.href = url);
            btn.disabled = false; btn.removeAttribute('aria-busy');
            show(box, 'err', n.msg && n.msg !== 'success' ? n.msg : t('err_start'));
          });
        });
      });
    });
  }

  /* ================= RESULT ================= */
  function initResult() {
    var body = $('rtBody'), live = { sub: null, title: '' }, current = null, kind = 'pending';
    function row(k, v) { return '<div><dt>' + esc(t(k)) + '</dt><dd>' + v + '</dd></div>'; }
    function paint() {
      var o = current, h = '';
      if (kind === 'missing') {
        h = '<h1>' + esc(t('rt_fail_h')) + '</h1><p class="auth-sub">' + esc(t('missing')) + '</p><div class="rt-actions"><a class="btn btn-primary" href="pricing.html">' + esc(t('back_pricing')) + '</a></div>';
      } else if (kind === 'pending' || kind === 'waiting') {
        h = '<div class="rt-icon pend"></div><h1>' + esc(t(kind === 'pending' ? 'rt_pend_h' : 'rt_wait_h')) + '</h1><p class="auth-sub">' + esc(t(kind === 'pending' ? 'rt_pend_s' : 'rt_wait_s')) + '</p>' +
          (kind === 'waiting' ? '<div class="rt-actions"><a class="btn btn-primary" href="account.html">' + esc(t('rt_account')) + '</a></div>' : '');
      } else if (kind === 'failed' || kind === 'cancelled') {
        h = '<div class="rt-icon bad"></div><h1>' + esc(t(kind === 'failed' ? 'rt_fail_h' : 'rt_cancel_h')) + '</h1><p class="auth-sub">' + esc(t(kind === 'failed' ? 'rt_fail_s' : 'rt_cancel_s')) + '</p>' +
          '<div class="rt-actions"><a class="btn btn-primary" href="checkout.html?plan=pro&cycle=' + esc(o ? o.cycle : 'year') + '">' + esc(t(kind === 'failed' ? 'rt_retry' : 'rt_back')) + '</a><a class="btn btn-ghost" href="mailto:' + esc(SUPPORT) + '">' + esc(t('rt_help')) + '</a></div>';
      } else {
        var title = o ? planTitle(o.cycle) : live.title, until = o ? fmtDate(o.endsAt) : fmtDate(live.sub.end_time * 1000);
        var amount = o ? esc(o.complimentary ? t('comp_fmt', { amount: fmtMoney(paidAmount(o), o.currency) }) : fmtMoney(paidAmount(o), o.currency)) : '';
        h = '<div class="rt-icon ok"></div><h1>' + esc(t(o && o.complimentary ? 'rt_comp_h' : 'rt_ok_h')) + '</h1><p class="auth-sub">' + esc(t(o && o.complimentary ? 'rt_comp_s' : 'rt_ok_s')) + '</p><dl class="kv rt-kv">' +
          (o ? row('rt_order', esc(o.id)) : '') + row('rt_plan', esc(title)) + (o ? row('rt_amount', amount) + row('rt_date', esc(fmtDateTime(o.paidAt))) : '') + row('rt_until', esc(until)) + row('rt_email', esc(o ? o.email : (live.email || ''))) + '</dl>' +
          '<div class="rt-next"><b>' + esc(t('rt_next')) + '</b><ol><li>' + esc(t('rt_n1')) + '</li><li>' + esc(t('rt_n2')) + '</li><li>' + esc(t('rt_n3')) + '</li></ol></div>' +
          '<div class="rt-actions">' + (o ? '<a class="btn btn-primary" href="receipt.html?order=' + encodeURIComponent(o.id) + '">' + esc(t('rt_receipt')) + '</a>' : '') +
          '<a class="btn ' + (o ? 'btn-ghost' : 'btn-primary') + '" href="account.html">' + esc(t('rt_account')) + '</a><a class="btn btn-ghost" href="index.html#download">' + esc(t('rt_dl')) + '</a></div>';
      }
      body.innerHTML = h;
    }
    rerender(paint);
    requireUser().then(function (u) {
      var id = q.get('order');
      if (id) {
        var o = getOrder(id);
        if (!o || o.email !== u.email) { kind = 'missing'; return paint(); }
        current = o; kind = o.status === 'paid' ? 'paid' : o.status === 'failed' ? 'failed' : o.status === 'cancelled' ? 'cancelled' : 'pending';
        return paint();
      }
      // The payment partner sends people back here without an order id, so look for the freshly activated plan.
      live.email = u.email; paint();
      var tries = 0;
      (function poll() {
        Promise.all([AUTH.authed('/subscription/self'), AUTH.authed('/subscription/plans')]).then(function (r) {
          var subs = r[0].ok && r[0].data && r[0].data.subscriptions || [], plans = r[1].ok && Array.isArray(r[1].data) ? r[1].data.map(function (x) { return x.plan; }) : [];
          var now = Date.now() / 1000, hit = null;
          subs.forEach(function (s) {
            var x = s.subscription, p = x && plans.filter(function (z) { return z && z.id === x.plan_id; })[0];
            if (x && p && PRO_PLAN.test(p.title || '') && x.status === 'active' && x.end_time > now && x.start_time > now - 1800 && (!hit || x.start_time > hit.sub.start_time)) hit = { sub: x, title: p.title };
          });
          if (hit) { live.sub = hit.sub; live.title = hit.title; kind = 'paid'; return paint(); }
          if (++tries >= 10) { kind = 'waiting'; return paint(); }
          setTimeout(poll, 3000);
        });
      })();
    });
  }

  /* ================= RECEIPT ================= */
  function initReceipt() {
    var body = $('rcBody'), o = null;
    function line(k, v) { return '<tr><th>' + esc(t(k)) + '</th><td>' + v + '</td></tr>'; }
    function paint() {
      if (!o) { body.innerHTML = '<p class="auth-sub">' + esc(t('missing')) + '</p>'; return; }
      var method = o.complimentary ? t('pay_complimentary') : t('pay_' + (o.method || 'card')), b = o.billing || {};
      body.innerHTML = '<div class="receipt-paper"><div class="rp-head"><div><b class="rp-title">' + esc(t('rc_h')) + '</b><div class="rp-sub">CodeFlux</div></div><div class="rp-co"><b>Contessa Intelligence Tech Limited</b><br>知繹智聯科技有限公司<br>' + esc(SUPPORT) + '</div></div>' +
        '<table class="rp-meta">' + line('rc_no', esc(o.id)) + line('rc_date', esc(fmtDateTime(o.paidAt))) +
        line('rc_to', esc(b.name || '') + (b.company ? '<br>' + esc(b.company) : '') + '<br>' + esc(o.email) + (b.country ? '<br>' + esc(b.country) : '') + (b.taxId ? '<br>' + esc(b.taxId) : '')) +
        line('rc_method', esc(method)) + line('rc_status', esc(t('st_paid'))) + '</table>' +
        '<table class="rp-items"><thead><tr><th>' + esc(t('rc_desc')) + '</th><th>' + esc(t('rc_period')) + '</th><th>' + esc(t('rc_amt')) + '</th></tr></thead><tbody>' +
        '<tr><td>' + esc(planTitle(o.cycle)) + '</td><td>' + esc(fmtDate(o.startsAt) + ' – ' + fmtDate(o.endsAt)) + '</td><td>' + esc(fmtMoney(o.amount, o.currency)) + '</td></tr>' +
        (o.complimentary ? '<tr><td colspan="2">' + esc(t('rc_comp')) + '</td><td>−' + esc(fmtMoney(o.amount, o.currency)) + '</td></tr>' : '') + '</tbody>' +
        '<tfoot><tr><td colspan="2">' + esc(t('rc_total')) + '</td><td>' + esc(fmtMoney(paidAmount(o), o.currency)) + '</td></tr></tfoot></table>' +
        '<p class="rp-note">' + esc(t('rc_note')) + '</p></div>' +
        '<div class="rp-actions no-print"><button type="button" class="btn btn-primary" id="rcPrint">' + esc(t('rc_print')) + '</button><a class="btn btn-ghost" href="account.html">' + esc(t('rc_back')) + '</a></div>';
      $('rcPrint').addEventListener('click', function () { window.print(); });
    }
    rerender(paint);
    requireUser().then(function (u) {
      var x = getOrder(q.get('order'));
      o = x && x.email === u.email && x.status === 'paid' ? x : null;
      paint();
    });
  }

  /* ================= REFUND REQUEST (opens a prepared email) ================= */
  function initRefund() {
    var o = null, info = null, hasId = !!q.get('order');
    function paint() {
      if (!hasId) { $('rqOrderRow').hidden = true; $('rqNoWrap').hidden = false; hide($('rqElig')); return; }
      if (!o) { $('rqBox').hidden = true; return show($('rqElig'), 'err', t('missing')); }
      $('rqOrder').textContent = o.id + ' · ' + planTitle(o.cycle) + ' · ' + fmtMoney(paidAmount(o), o.currency);
      if (o.status !== 'paid') { $('rqForm').hidden = true; return show($('rqElig'), 'info', t('elig_none')); }
      if (o.complimentary) { $('rqForm').hidden = true; return show($('rqElig'), 'info', t('elig_comp')); }
      show($('rqElig'), info.eligible ? 'ok' : 'info', t(info.eligible ? 'elig_yes' : 'elig_no', { date: fmtDate(info.deadline) }));
    }
    rerender(paint);
    requireUser().then(function (u) {
      var x = hasId ? getOrder(q.get('order')) : null;
      o = x && x.email === u.email ? x : null;
      info = o ? refundInfo(o) : null;
      $('rqUser').value = u.email;
      paint();
    });
    $('rqForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var id = o ? o.id : $('rqNo').value.trim();
      if (!id) { $('rqNo').focus(); return show($('rqElig'), 'err', t('err_orderno')); }
      var reasonEl = $('rqReason'), reason = reasonEl.options[reasonEl.selectedIndex].text, subject = t('rf_subject', { id: id });
      var body = t('rf_body', { id: id, plan: o ? planTitle(o.cycle) : '-', amount: o ? fmtMoney(paidAmount(o), o.currency) : '-', date: o ? fmtDate(o.paidAt) : '-', email: $('rqUser').value, reason: reason, details: $('rqDetails').value.trim() || '-' });
      $('rqForm').hidden = true; $('rqSent').hidden = false; $('rqText').value = subject + '\n\n' + body;
      location.href = mailto(SUPPORT, subject, body);
    });
    $('rqCopy').addEventListener('click', function () { copyText($('rqText').value, this); });
  }

  /* ================= SALES ENQUIRY (opens a prepared email) ================= */
  function initSales() {
    var want = q.get('interest');
    if (want === 'team' || want === 'enterprise') $('slInterest').value = want;
    AUTH.me().then(function (u) { if (u && u.email && !$('slEmail').value) $('slEmail').value = u.email; });
    $('slForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var f = { name: $('slName').value.trim(), email: $('slEmail').value.trim(), company: $('slCompany').value.trim() };
      if (!f.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email) || !f.company) return show($('slMsg'), 'err', t('err_fill'));
      if (!$('slConsent').checked) return show($('slMsg'), 'err', t('err_consent'));
      hide($('slMsg'));
      var sel = $('slInterest'), size = $('slSize'), interest = sel.options[sel.selectedIndex].text;
      var subject = t('sl_subject', { interest: interest }) + ' - ' + f.company;
      var body = t('sl_body', { name: f.name, email: f.email, company: f.company, size: size.options[size.selectedIndex].text, interest: interest, message: $('slMessage').value.trim() || '-' });
      $('slForm').hidden = true; $('slSent').hidden = false; $('slText').value = subject + '\n\n' + body;
      location.href = mailto(SALES, subject, body);
    });
    $('slCopy').addEventListener('click', function () { copyText($('slText').value, this); });
  }

  /* ---------------- dispatch ---------------- */
  applyStatic();
  new MutationObserver(applyStatic).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  if (page === 'checkout') initCheckout();
  else if (page === 'result') initResult();
  else if (page === 'receipt') initReceipt();
  else if (page === 'refund') initRefund();
  else if (page === 'sales') initSales();
})();
