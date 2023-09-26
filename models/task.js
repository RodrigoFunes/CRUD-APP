const mongoose = require("mongoose");

const taskSchema = mongoose.model("TaskSchema", {
  name: {
    type: String,
    required: true,
  },

  description: {
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

module.exports = taskSchema;
