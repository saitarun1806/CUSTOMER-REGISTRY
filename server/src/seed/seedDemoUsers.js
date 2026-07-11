// One-time script to create demo accounts (customer + agent) for testing/demo purposes.
// The admin account is NOT created here — it is auto-provisioned on first login using
// the ADMIN_EMAIL / ADMIN_PASSWORD values from your .env file (see authController.js).
//
// Usage:
//   npm run seed
//
// Safe to re-run: it skips any demo account that already exists.

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const DEMO_ACCOUNTS = [
  {
    fullName: "Demo Customer",
    email: "customer@demo.com",
    password: "Customer@123",
    role: "customer",
  },
  {
    fullName: "Demo Agent",
    email: "agent@demo.com",
    password: "Agent@123",
    role: "agent",
  },
];

const seed = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set in your .env file.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected. Seeding demo accounts...");

  for (const account of DEMO_ACCOUNTS) {
    const existing = await User.findOne({ email: account.email });
    if (existing) {
      console.log(`Skipped (already exists): ${account.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(account.password, 10);
    await User.create({
      fullName: account.fullName,
      email: account.email,
      password: hashedPassword,
      role: account.role,
    });
    console.log(`Created ${account.role}: ${account.email}`);
  }

  console.log("Done.");
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
