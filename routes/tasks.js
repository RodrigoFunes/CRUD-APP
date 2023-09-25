const express = require("express");
const router = express.Router();
const Task = require("../models/task");

// Getting all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting for ID
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

// Creating task
router.post("/", async (req, res) => {
  const task = new Task({
    name: req.body.name,
    discription: req.body.discription,
    status: req.body.status,
  });
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating task
router.patch("/:id", getTask, async (req, res) => {
  if (req.body.name != null) {
    res.task.name = req.body.name;
  }
  if (req.body.discription != null) {
    res.task.discription = req.body.discription;
  }
  if (req.body.status != null) {
    res.task.status = req.body.status;
  }
  try {
    const updatedTask = await res.task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting task
router.delete("/:id", getTask, async (req, res) => {
  try {
    await res.task.deleteOne();
    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Pending tasks
router.get("/status", async (req, res) => {
  try {
    const tasksPendientes = await Task.find({ status: "Pendiente" });
    res.json(tasksPendientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Transcurred days

////
async function getTask(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "No se pudo encontrar tarea" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.task = task;
  next();
}

module.exports = router;
