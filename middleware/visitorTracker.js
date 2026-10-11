const axios = require("axios");
const Visitor = require("../models/Visitor");
const { parseUserAgent, isBot, getClientIp } = require("../utils/visitorParser");

/**
 * Public-info collector.
 * Saves one Visitor record per request (dedupes by IP+path within 30s).
 * Also attaches `req.visitorInfo` for use by downstream handlers.
 */
const visitorTracker = async (req, res, next) => {
  try {
    const ua = req.headers["user-agent"] || "";
    const ip = getClientIp(req);
    const parsed = parseUserAgent(ua);
    const bot = isBot(ua);

    const visitorInfo = {
      ip,
      userAgent: ua,
      ...parsed,
      isBot: bot,
      path: req.originalUrl,
      referrer: req.headers.referer || req.headers.referrer || "",
      language: req.headers["accept-language"] || "",
      metaPixelId: process.env.META_PIXEL_ID,
    };

    // Attach for controllers
    req.visitorInfo = visitorInfo;

    // Don't store static / health checks
    if (
      req.path.startsWith("/uploads") ||
      req.path === "/" ||
      req.method === "OPTIONS"
    ) {
      return next();
    }

    // Dedupe: same IP + same path in last 30 seconds
    const recent = await Visitor.findOne({
      ip,
      path: req.originalUrl,
      createdAt: { $gte: new Date(Date.now() - 30 * 1000) },
    });

    if (!recent) {
      // Geo lookup (free, no key). Fire & forget.
      axios
        .get(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,isp,lat,lon,timezone`)
        .then(({ data }) => {
          if (data.status === "success") {
            Visitor.create({
              ...visitorInfo,
              country: data.country,
              region: data.regionName,
              city: data.city,
              isp: data.isp,
              lat: data.lat,
              lon: data.lon,
              timezone: data.timezone,
            }).catch(() => {});
          } else {
            Visitor.create(visitorInfo).catch(() => {});
          }
        })
        .catch(() => {
          Visitor.create(visitorInfo).catch(() => {});
        });
    }

    next();
  } catch (err) {
    // Never break the request because tracking failed
    console.error("Visitor tracking error:", err.message);
    next();
  }
};

module.exports = visitorTracker;