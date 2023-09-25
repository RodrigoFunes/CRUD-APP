const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  discription: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
