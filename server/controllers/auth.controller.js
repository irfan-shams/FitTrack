import ApiResponse from "../utils/ApiResponse.js";

export const adminLogin = async (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      "Admin Login API Ready"
    )
  );
};