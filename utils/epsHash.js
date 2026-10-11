const crypto = require("crypto");

/**
 * EPS x-hash generator
 * 1. Encode hash key using UTF-8
 * 2. Create HMAC-SHA512 with the encoded key
 * 3. Compute hash over `data`
 * 4. Return base64
 */
const generateEpsHash = (data, hashKey = process.env.EPS_HASH_KEY) => {
  const key = Buffer.from(hashKey, "utf8");
  return crypto.createHmac("sha512", key).update(data, "utf8").digest("base64");
};

module.exports = { generateEpsHash };