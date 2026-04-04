const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  key:{
    type:String
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);