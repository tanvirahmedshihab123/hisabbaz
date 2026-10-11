const validator = require("validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { getClientIp } = require("../utils/visitorParser");

/* ── @route POST /api/auth/register ───────── */
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });

    if (password.length < 6)
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });

    const exists = await User.findOne({ email });
    if (exists)
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      lastLoginIp: getClientIp(req),
      lastLoginUserAgent: req.headers["user-agent"],
      signupSource: req.headers.referer || "direct",
      metaPixelId: process.env.META_PIXEL_ID,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── @route POST /api/auth/login ──────────── */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const match = await user.matchPassword(password);
    if (!match)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    user.lastLoginIp = getClientIp(req);
    user.lastLoginUserAgent = req.headers["user-agent"];
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── @route GET /api/auth/me ─────────────── */
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };