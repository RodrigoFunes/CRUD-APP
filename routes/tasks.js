const express = require("express");
const router = express.Router();
const taskSchema = require("../models/task");

// Getting all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await taskSchema.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting for ID
router.get("/:id", getTask, (req, res) => {
  res.json(res.task);
});

//Creating task
router.post("/", async (req, res) => {
  const task = new taskSchema({
    name: req.body.name,
    description: req.body.description,
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
  if (req.body.description != null) {
    res.task.description = req.body.description;
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
router.get("/status/Pending", async (req, res) => {
  try {
    const result = [];
    const task = await taskSchema.find();
    if (!task) {
      res.send("No hay tareas");
    } else {
      const pending = task.filter((x) => x.status === "Pendiente");
      result.push(pending);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Transcurred days

router.get("/:id/dias-transcurridos", async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await taskSchema.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "No se encontró la tarea" });
    }

    const currentDate = new Date();
    const creationDate = task.date;
    const timeDiff = Math.abs(currentDate - creationDate);
    const transcurredDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    res.json({ transcurredDays });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

////
async function getTask(req, res, next) {
  let task;
  try {
    task = await taskSchema.findById(req.params.id);
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
