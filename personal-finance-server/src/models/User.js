const mongoose = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
    },
  ],
  passwordUpdate: {
    type: verificationCodeSchema
  },
  passwordReset: {
    type: verificationCodeSchema
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
