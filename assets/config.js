/* Payment configuration.
 *
 * Accounts listed in CF_PAY_BYPASS skip the payment partner: their orders are completed immediately
 * and recorded in this browser only, as complimentary (nothing is charged and no entitlement is granted
 * on the server). Every other account goes through the real backend, so it is blocked normally
 * until the payment channel is connected.
 * Remove the entry (or empty the list) once the payment channel is live and reviewed. */
window.CF_PAY_BYPASS = ['admin@routok.com'];
window.CF_PAY_METHODS = ['card'];          // any of: 'card', 'alipay', 'wechat', 'unionpay'
window.CF_SUPPORT_EMAIL = 'support@routok.com';
window.CF_SALES_EMAIL = 'sales@routok.com';
