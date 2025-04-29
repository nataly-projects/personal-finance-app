const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true 
    },
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date}
});

module.exports = mongoose.model('Task', TaskSchema);