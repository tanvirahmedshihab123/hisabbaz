// const axios = require("axios");
// const crypto = require("crypto");
// const Payment = require("../models/Payment");
// const { generateEpsHash } = require("../utils/epsHash");
// const { getClientIp } = require("../utils/visitorParser");

// const EPS_BASE = process.env.EPS_BASE_URL;

// /* ══════════════════════════════════════════════════════
//    1. Get EPS Token (API 01)
//    ══════════════════════════════════════════════════════ */
// const getEpsToken = async () => {
//   const xHash = generateEpsHash(process.env.EPS_USERNAME);

//   const { data } = await axios.post(
//     `${EPS_BASE}/v1/Auth/GetToken`,
//     {
//       userName: process.env.EPS_USERNAME,
//       password: process.env.EPS_PASSWORD,
//     },
//     {
//       headers: { "x-hash": xHash, "Content-Type": "application/json" },
//     }
//   );

//   if (!data?.token) throw new Error("Failed to get EPS token");
//   return data.token;
// };

// /* ══════════════════════════════════════════════════════
//    2. Initialize Payment (API 02)
//    POST /api/payments/initialize
//    ══════════════════════════════════════════════════════ */
// const initializePayment = async (req, res, next) => {
//   try {
//     const {
//       planId,
//       planName,
//       billingCycle,
//       amount,
//       customerName,
//       customerEmail,
//       customerPhone,
//       customerAddress,
//       customerCity,
//       customerCountry = "BD",
//       productName,
//       productCategory = "Subscription",
//     } = req.body;

//     if (!planId || !billingCycle || !amount || !customerName || !customerEmail)
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields" });

//     // Unique IDs
//     const merchantTransactionId =
//       Date.now().toString() + Math.floor(Math.random() * 10000);
//     const customerOrderId = `HB-${Date.now()}`;

//     // Get token
//     const token = await getEpsToken();

//     // x-hash for Initialize is generated from merchantTransactionId
//     const xHash = generateEpsHash(merchantTransactionId);

//     const body = {
//       storeId: process.env.EPS_STORE_ID,
//       merchantTransactionId,
//       CustomerOrderId: customerOrderId,
//       transactionTypeId: 1, // 1=Web, 2=Android, 3=iOS — set to 10 per sample
//       financialEntityId: 0,
//       transitionStatusId: 0,
//       totalAmount: Number(amount),
//       ipAddress: getClientIp(req),
//       version: "1",
//       successUrl: `${process.env.FRONTEND_URL}/payment/success`,
//       failUrl: `${process.env.FRONTEND_URL}/payment/failed`,
//       cancelUrl: `${process.env.FRONTEND_URL}/payment/cancelled`,
//       customerName,
//       customerEmail,
//       customerAddress: customerAddress || "N/A",
//       customerAddress2: "",
//       customerCity: customerCity || "Dhaka",
//       customerState: customerCity || "Dhaka",
//       customerPostcode: "1000",
//       customerCountry,
//       customerPhone: customerPhone || "0000000000",
//       shipmentName: customerName,
//       shipmentAddress: customerAddress || "N/A",
//       shipmentAddress2: "",
//       shipmentCity: customerCity || "Dhaka",
//       shipmentState: customerCity || "Dhaka",
//       shipmentPostcode: "1000",
//       shipmentCountry: customerCountry,
//       valueA: "",
//       valueB: "",
//       valueC: "",
//       valueD: "",
//       shippingMethod: "NO",
//       noOfItem: "1",
//       productName: productName || planName,
//       productProfile: "general",
//       productCategory,
//       ProductList: [
//         {
//           ProductName: productName || planName,
//           NoOfItem: "1",
//           ProductProfile: "general",
//           ProductCategory: productCategory,
//           ProductPrice: String(amount),
//         },
//       ],
//     };

//     const { data } = await axios.post(
//       `${EPS_BASE}/v1/EPSEngine/InitializeEPS`,
//       body,
//       {
//         headers: {
//           "x-hash": xHash,
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     // Persist payment record
//     const payment = await Payment.create({
//       user: req.user?._id,
//       planId,
//       planName,
//       billingCycle,
//       amount,
//       merchantTransactionId,
//       customerOrderId,
//       storeId: process.env.EPS_STORE_ID,
//       customerName,
//       customerEmail,
//       customerPhone,
//       customerAddress,
//       customerCity,
//       customerCountry,
//       gatewayResponse: data,
//       status: "pending",
//     });

//     // EPS returns a redirect URL (usually `RedirectUrl` or `redirectUrl`)
//     const redirectUrl =
//       data?.RedirectUrl ||
//       data?.redirectUrl ||
//       data?.RedirectURL ||
//       data?.Data?.RedirectUrl ||
//       null;

//     res.json({
//       success: true,
//       merchantTransactionId,
//       paymentId: payment._id,
//       redirectUrl,
//       raw: data,
//     });
//   } catch (err) {
//     console.error("Initialize error:", err.response?.data || err.message);
//     res.status(err.response?.status || 500).json({
//       success: false,
//       message: "Payment initialization failed",
//       details: err.response?.data || err.message,
//     });
//   }
// };

// /* ══════════════════════════════════════════════════════
//    3. Verify Transaction
//    GET /api/payments/verify/:merchantTransactionId
//    ══════════════════════════════════════════════════════ */
// const verifyPayment = async (req, res, next) => {
//   try {
//     const { merchantTransactionId } = req.params;

//     const payment = await Payment.findOne({ merchantTransactionId });
//     if (!payment)
//       return res
//         .status(404)
//         .json({ success: false, message: "Payment record not found" });

//     const token = await getEpsToken();
//     const xHash = generateEpsHash(merchantTransactionId);

//     const { data } = await axios.get(
//       `${EPS_BASE}/v1/EPSEngine/CheckMerchantTransactionStatus`,
//       {
//         params: { merchantTransactionId },
//         headers: {
//           "x-hash": xHash,
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     // Update DB
//     payment.gatewayResponse = data;
//     payment.epsTransactionId =
//       data?.EpsTransactionId || data?.epsTransactionId;
//     const status = (data?.Status || data?.status || "").toLowerCase();
//     if (status === "success") {
//       payment.status = "success";
//       payment.paidAt = new Date();
//     } else if (status === "failed") {
//       payment.status = "failed";
//     } else if (status === "cancelled" || status === "canceled") {
//       payment.status = "cancelled";
//     }
//     await payment.save();

//     res.json({ success: true, payment, epsResponse: data });
//   } catch (err) {
//     console.error("Verify error:", err.response?.data || err.message);
//     next(err);
//   }
// };

// /* ══════════════════════════════════════════════════════
//    4. EPS Callback (optional — if you set a server callback URL)
//    POST /api/payments/callback
//    ══════════════════════════════════════════════════════ */
// const epsCallback = async (req, res) => {
//   try {
//     const payload = req.body;
//     console.log("📩 EPS Callback:", payload);

//     const mtx =
//       payload.merchantTransactionId || payload.MerchantTransactionId;
//     if (mtx) {
//       const payment = await Payment.findOne({
//         merchantTransactionId: mtx,
//       });
//       if (payment) {
//         payment.gatewayResponse = payload;
//         const status = (payload.Status || "").toLowerCase();
//         if (status === "success") {
//           payment.status = "success";
//           payment.paidAt = new Date();
//         } else if (status === "failed") payment.status = "failed";
//         else if (status.includes("cancel")) payment.status = "cancelled";
//         await payment.save();
//       }
//     }
//     res.json({ success: true });
//   } catch (err) {
//     console.error("Callback error:", err.message);
//     res.json({ success: false });
//   }
// };

// /* ── List payments (admin) ─────────────────── */
// const getAllPayments = async (req, res, next) => {
//   try {
//     const { status, page = 1, limit = 20 } = req.query;
//     const query = {};
//     if (status) query.status = status;

//     const payments = await Payment.find(query)
//       .populate("user", "name email")
//       .sort("-createdAt")
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     const total = await Payment.countDocuments(query);
//     res.json({
//       success: true,
//       total,
//       page: Number(page),
//       pages: Math.ceil(total / limit),
//       payments,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = {
//   initializePayment,
//   verifyPayment,
//   epsCallback,
//   getAllPayments,
// };


const axios = require("axios");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const { generateEpsHash } = require("../utils/epsHash");
const { getClientIp } = require("../utils/visitorParser");

const EPS_BASE = process.env.EPS_BASE_URL;

/* ══════════════════════════════════════════════════════
   1. Get EPS Token (API 01)
   ══════════════════════════════════════════════════════ */
const getEpsToken = async () => {
  const xHash = generateEpsHash(process.env.EPS_USERNAME);

  console.log("\n🔑 ══════════ GET EPS TOKEN ══════════");
  console.log("URL:      ", `${EPS_BASE}/v1/Auth/GetToken`);
  console.log("Username: ", process.env.EPS_USERNAME);
  console.log("x-hash:   ", xHash);

  try {
    const { data } = await axios.post(
      `${EPS_BASE}/v1/Auth/GetToken`,
      {
        userName: process.env.EPS_USERNAME,
        password: process.env.EPS_PASSWORD,
      },
      {
        headers: { "x-hash": xHash, "Content-Type": "application/json" },
      }
    );

    console.log("Response: ", JSON.stringify(data, null, 2));

    if (!data?.token) {
      console.error("❌ No token in response");
      throw new Error("Failed to get EPS token: " + (data?.errorMessage || "unknown"));
    }

    console.log("✅ Token acquired");
    console.log("🔑 ══════════════════════════════════\n");
    return data.token;
  } catch (err) {
    console.error("❌ GetToken failed:");
    console.error("Status: ", err.response?.status);
    console.error("Data:   ", JSON.stringify(err.response?.data, null, 2));
    console.error("Message:", err.message);
    console.error("🔑 ══════════════════════════════════\n");
    throw err;
  }
};

/* ══════════════════════════════════════════════════════
   2. Initialize Payment (API 02)
   POST /api/payments/initialize
   ══════════════════════════════════════════════════════ */
const initializePayment = async (req, res, next) => {
  try {
    const {
      planId,
      planName,
      billingCycle,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerCountry = "BD",
      productName,
      productCategory = "Subscription",
    } = req.body;

    if (!planId || !billingCycle || !amount || !customerName || !customerEmail) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Unique IDs
    const merchantTransactionId =
      Date.now().toString() + Math.floor(Math.random() * 10000);
    const customerOrderId = `HB-${Date.now()}`;

    // Get EPS token
    const token = await getEpsToken();

    // x-hash for Initialize = HMAC-SHA512(hashKey, merchantTransactionId)
    const xHash = generateEpsHash(merchantTransactionId);

    const body = {
      merchantId: process.env.EPS_MERCHANT_ID,
      storeId: process.env.EPS_STORE_ID,
      merchantTransactionId,
      CustomerOrderId: customerOrderId,
      transactionTypeId: 1, // 1=Web, 2=Android, 3=iOS
      financialEntityId: 0,
      transitionStatusId: 0,
      totalAmount: Number(amount),
      ipAddress: getClientIp(req),
      version: "1",
      successUrl: `${process.env.FRONTEND_URL}/payment/success`,
      failUrl: `${process.env.FRONTEND_URL}/payment/failed`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancelled`,
      customerName,
      customerEmail,
      customerAddress: customerAddress || "N/A",
      customerAddress2: "",
      customerCity: customerCity || "Dhaka",
      customerState: customerCity || "Dhaka",
      customerPostcode: "1000",
      customerCountry,
      customerPhone: customerPhone || "0000000000",
      shipmentName: customerName,
      shipmentAddress: customerAddress || "N/A",
      shipmentAddress2: "",
      shipmentCity: customerCity || "Dhaka",
      shipmentState: customerCity || "Dhaka",
      shipmentPostcode: "1000",
      shipmentCountry: customerCountry,
      valueA: "",
      valueB: "",
      valueC: "",
      valueD: "",
      shippingMethod: "NO",
      noOfItem: "1",
      productName: productName || planName,
      productProfile: "general",
      productCategory,
      ProductList: [
        {
          ProductName: productName || planName,
          NoOfItem: "1",
          ProductProfile: "general",
          ProductCategory: productCategory,
          ProductPrice: String(amount),
        },
      ],
    };

    console.log("\n💳 ══════════ INITIALIZE EPS ══════════");
    console.log("URL:     ", `${EPS_BASE}/v1/EPSEngine/InitializeEPS`);
    console.log("x-hash:  ", xHash);
    console.log("Token:   ", token.slice(0, 60) + "...");
    console.log("Body:\n", JSON.stringify(body, null, 2));
    console.log("💳 ══════════════════════════════════\n");

    const { data } = await axios.post(
      `${EPS_BASE}/v1/EPSEngine/InitializeEPS`,
      body,
      {
        headers: {
          "x-hash": xHash,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("\n✅ ══════════ EPS RESPONSE ══════════");
    console.log(JSON.stringify(data, null, 2));
    console.log("✅ ══════════════════════════════════\n");

    // Persist payment record
    const payment = await Payment.create({
      user: req.user?._id,
      planId,
      planName,
      billingCycle,
      amount,
      merchantTransactionId,
      customerOrderId,
      storeId: process.env.EPS_STORE_ID,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      customerCity,
      customerCountry,
      gatewayResponse: data,
      status: "pending",
    });

    // EPS may return the redirect URL under different keys
    const redirectUrl =
      data?.RedirectUrl ||
      data?.redirectUrl ||
      data?.RedirectURL ||
      data?.Data?.RedirectUrl ||
      data?.Data?.redirectUrl ||
      null;

    if (!redirectUrl) {
      console.error("⚠️  No redirect URL in EPS response!");
      console.error("Full response:", JSON.stringify(data, null, 2));
    }

    res.json({
      success: true,
      merchantTransactionId,
      paymentId: payment._id,
      redirectUrl,
      raw: data,
    });
  } catch (err) {
    console.error("\n❌ ══════════ INITIALIZE ERROR ══════════");
    console.error("Status: ", err.response?.status);
    console.error("Data:   ", JSON.stringify(err.response?.data, null, 2));
    console.error("Message:", err.message);
    console.error("❌ ═════════════════════════════════════\n");

    res.status(err.response?.status || 500).json({
      success: false,
      message:
        err.response?.data?.errorMessage ||
        err.response?.data?.message ||
        "Payment initialization failed",
      details: err.response?.data || err.message,
    });
  }
};

/* ══════════════════════════════════════════════════════
   3. Verify Transaction
   GET /api/payments/verify/:merchantTransactionId
   ══════════════════════════════════════════════════════ */
const verifyPayment = async (req, res, next) => {
  try {
    const { merchantTransactionId } = req.params;

    const payment = await Payment.findOne({ merchantTransactionId });
    if (!payment) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found" });
    }

    const token = await getEpsToken();
    const xHash = generateEpsHash(merchantTransactionId);

    console.log("\n🔍 ══════════ VERIFY PAYMENT ══════════");
    console.log("merchantTransactionId:", merchantTransactionId);
    console.log("x-hash:", xHash);

    const { data } = await axios.get(
      `${EPS_BASE}/v1/EPSEngine/CheckMerchantTransactionStatus`,
      {
        params: { merchantTransactionId },
        headers: {
          "x-hash": xHash,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Response:", JSON.stringify(data, null, 2));
    console.log("🔍 ══════════════════════════════════\n");

    // Update DB
    payment.gatewayResponse = data;
    payment.epsTransactionId =
      data?.EpsTransactionId || data?.epsTransactionId;

    const status = (data?.Status || data?.status || "").toLowerCase();
    if (status === "success") {
      payment.status = "success";
      payment.paidAt = new Date();
    } else if (status === "failed") {
      payment.status = "failed";
    } else if (status === "cancelled" || status === "canceled") {
      payment.status = "cancelled";
    }
    await payment.save();

    res.json({ success: true, payment, epsResponse: data });
  } catch (err) {
    console.error("Verify error:", err.response?.data || err.message);
    next(err);
  }
};

/* ══════════════════════════════════════════════════════
   4. EPS Callback (optional)
   POST /api/payments/callback
   ══════════════════════════════════════════════════════ */
const epsCallback = async (req, res) => {
  try {
    const payload = req.body;
    console.log("📩 EPS Callback:", payload);

    const mtx =
      payload.merchantTransactionId || payload.MerchantTransactionId;
    if (mtx) {
      const payment = await Payment.findOne({
        merchantTransactionId: mtx,
      });
      if (payment) {
        payment.gatewayResponse = payload;
        const status = (payload.Status || "").toLowerCase();
        if (status === "success") {
          payment.status = "success";
          payment.paidAt = new Date();
        } else if (status === "failed") payment.status = "failed";
        else if (status.includes("cancel")) payment.status = "cancelled";
        await payment.save();
      }
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Callback error:", err.message);
    res.json({ success: false });
  }
};

/* ── List payments (admin) ─────────────────── */
const getAllPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate("user", "name email")
      .sort("-createdAt")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(query);
    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      payments,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  epsCallback,
  getAllPayments,
};