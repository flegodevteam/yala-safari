import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "admin@yalasafari.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      email: "admin@yalasafari.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("Admin user created successfully!");
    console.log("Email: admin@yalasafari.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
