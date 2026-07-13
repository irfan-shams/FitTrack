import Admin from "../models/Admin.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatched = await admin.comparePassword(password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid email or password.");
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin._id);

  const adminData = {
    id: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
    profileImage: admin.profileImage,
    lastLogin: admin.lastLogin,
  };

  res.status(200).json(
    new ApiResponse(200, "Login successful.", {
      token,
      admin: adminData,
    })
  );
});

