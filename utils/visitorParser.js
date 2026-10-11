const UAParser = require("ua-parser-js");

const parseUserAgent = (ua = "") => {
  const parser = new UAParser(ua);
  const r = parser.getResult();
  return {
    browser: r.browser?.name,
    browserVersion: r.browser?.version,
    os: r.os?.name,
    osVersion: r.os?.version,
    device: r.device?.type || "desktop",
    deviceVendor: r.device?.vendor,
    deviceModel: r.device?.model,
  };
};

const isBot = (ua = "") =>
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit/i.test(ua);

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    req.headers["x-real-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    "0.0.0.0"
  );
};

module.exports = { parseUserAgent, isBot, getClientIp };