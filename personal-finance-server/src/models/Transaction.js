const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ["income", "expense"], 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now() 
  }
});

transactionSchema.index({ userId: 1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ date: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
