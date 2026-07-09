import mongoose from "mongoose";
import bcrypt from "bcrypt";

const candidateSchema = new mongoose.Schema(
  {
    memberId: {
      type: String,
      unique: true,
      required: true,
      uppercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    fatherName: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    cnic: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dateOfBirth: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    emergencyContactName: {
      type: String,
      default: "",
      trim: true,
    },

    emergencyContactPhone: {
      type: String,
      default: "",
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },

    membershipPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MembershipPlan",
      default: null,
    },

    membershipStartDate: {
      type: Date,
    },

    membershipEndDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* Password Hashing  */
candidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

/* Compare Password Method */
candidateSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

candidateSchema.pre("validate", async function (next) {
  if (!this.isNew || this.memberId) {
    return next();
  }

  const lastCandidate = await mongoose
    .model("Candidate")
    .findOne()
    .sort({ createdAt: -1 });

  if (!lastCandidate) {
    this.memberId = "FT-000001";
    return next();
  }

  const lastNumber = parseInt(lastCandidate.memberId.split("-")[1], 10);

  this.memberId = `FT-${String(lastNumber + 1).padStart(6, "0")}`;

  next();
});

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;