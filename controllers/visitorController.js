const Visitor = require("../models/Visitor");

/* ── @route POST /api/visitors/track ──────── */
const trackVisitor = async (req, res, next) => {
  try {
    const extra = req.body || {};
    const doc = await Visitor.create({
      ...req.visitorInfo,
      screenResolution: extra.screenResolution,
      sessionId: extra.sessionId,
      pixelFired: !!extra.pixelFired,
      userId: req.user?._id,
    });
    res.json({ success: true, visitorId: doc._id });
  } catch (err) {
    next(err);
  }
};

/* ── Admin: list visitors ─────────────────── */
const getVisitors = async (req, res, next) => {
  try {
    const { page = 1, limit = 50, country, device } = req.query;
    const query = {};
    if (country) query.country = country;
    if (device) query.device = device;

    const visitors = await Visitor.find(query)
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Visitor.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      visitors,
    });
  } catch (err) {
    next(err);
  }
};

/* ── Admin: stats ─────────────────────────── */
const getVisitorStats = async (req, res, next) => {
  try {
    const total = await Visitor.countDocuments();
    const uniqueIps = await Visitor.distinct("ip");
    const byCountry = await Visitor.aggregate([
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const byDevice = await Visitor.aggregate([
      { $group: { _id: "$device", count: { $sum: 1 } } },
    ]);
    const byBrowser = await Visitor.aggregate([
      { $group: { _id: "$browser", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      stats: {
        total,
        uniqueIps: uniqueIps.length,
        byCountry,
        byDevice,
        byBrowser,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { trackVisitor, getVisitors, getVisitorStats };