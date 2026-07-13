import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

dotenv.config();

await connectDB();

const createAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({
      email: "admin@fittrack.com",
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists.");
      process.exit();
    }

    await Admin.create({
      fullName: "Super Admin",
      email: "admin@fittrack.com",
      password: "Admin@123",
      phone: "03001234567",
    });

    console.log("🎉 Super Admin created successfully.");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();