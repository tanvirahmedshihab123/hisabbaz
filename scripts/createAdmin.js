require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
const User = require("../models/User");

/* ══════════════════════════════════════════════════════
   Usage:
     node scripts/createAdmin.js
   ══════════════════════════════════════════════════════ */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) =>
  new Promise((resolve) => rl.question(q, (ans) => resolve(ans.trim())));

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected\n");

    /* ── Input নিন ──────────────────────────── */
    const name = await ask("Admin Name:     ");
    const email = (await ask("Admin Email:    ")).toLowerCase();
    const phone = await ask("Admin Phone:    ");
    const password = await ask("Admin Password: ");

    if (!name || !email || !password) {
      console.error("❌ Name, email and password are required");
      process.exit(1);
    }
    if (password.length < 6) {
      console.error("❌ Password must be at least 6 characters");
      process.exit(1);
    }

    /* ── আগে থেকে আছে কিনা চেক ─────────────── */
    const exists = await User.findOne({ email });
    if (exists) {
      console.log(`\n⚠️  User with email ${email} already exists.`);
      console.log(`   Current role: ${exists.role}`);

      const promote = await ask(
        "\n   Promote this user to admin? (yes/no): "
      );
      if (promote.toLowerCase() === "yes" || promote.toLowerCase() === "y") {
        exists.role = "admin";
        await exists.save();
        console.log(`✅ ${email} is now an admin`);
      } else {
        console.log("   Skipped. No changes made.");
      }

      rl.close();
      await mongoose.disconnect();
      process.exit(0);
    }

    /* ── নতুন admin তৈরি ────────────────────── */
    // Password model-এর pre-save hook-এ hash হবে, তাই এখানে hash করব না
    const admin = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin",
      signupSource: "seed-script",
    });

    console.log("\n✅ Admin created successfully!");
    console.log("   ─────────────────────────────");
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ${admin.role}`);
    console.log(`   ID:    ${admin._id}`);
    console.log("   ─────────────────────────────");

    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    rl.close();
    process.exit(1);
  }
};

run();