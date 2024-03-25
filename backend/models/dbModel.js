import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const recordSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  location: {
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    geoLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lon: {
        type: Number,
        required: true,
      },
    },
  },
  gender: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true,
  },
  transGender: {
    type: Boolean,
    required: true,
    default: false,
  },
  interestGender: {
    type: String,
    required: true,
  },
  interests: [
    {
      type: String,
      required: false,
    },
  ],
  bio: {
    type: String,
    required: false,
    default: "",
  },
});

const citySchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  admin1: { type: String, required: true },
  lat: { type: String, required: true },
  lon: { type: String, required: true },
  pop: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

const Record = mongoose.model("Record", recordSchema);

const City = mongoose.model("City", citySchema);

export { User, Record, City };
