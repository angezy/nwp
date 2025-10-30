// ip-middleware.js
function getClientIp(req) {
  // اگر پشت پراکسی هستید (Nginx/Cloudflare)، X-Forwarded-For مهم است
  const xff = req.headers['x-forwarded-for'];
  let ip = Array.isArray(xff) ? xff[0] : (xff ? xff.split(',')[0] : null);

  // در غیر این صورت از سوکت استفاده کن
  if (!ip) {
    ip =
      req.socket?.remoteAddress ||
      req.connection?.remoteAddress ||
      req.ip || // اگر trust proxy فعال باشد مفید است
      null;
  }

  // IPv6 mapped IPv4 را تمیز کن: ::ffff:127.0.0.1 -> 127.0.0.1
  if (ip && ip.startsWith('::ffff:')) ip = ip.substring(7);
  if (ip === '::1') ip = '127.0.0.1';

  return ip;
}

function ipMiddleware(req, res, next) {
  req.clientIp = getClientIp(req);
  next();
}

module.exports = { ipMiddleware, getClientIp };
