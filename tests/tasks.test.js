const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const taskSchema = require("../models/task");
const app = express();

mongoose.connect(
  "mongodb+srv://rodrigofunes:crudrodri@cluster0.wazegxa.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const tasksRouter = require("../routes/tasks");

app.use(express.json());
app.use("/", tasksRouter);

beforeAll(async () => {
  const task = new taskSchema({
    name: "Tarea de prueba",
    description: "Descripción de prueba",
    status: "Realizada",
  });
  await task.save();
});

afterAll(async () => {
  await taskSchema.deleteMany({});
  mongoose.connection.close();
});

describe("Rutas de la API", () => {
  it("Debería obtener todas las tareas", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("Debería obtener una tarea por ID", async () => {
    const task = await taskSchema.findOne({ name: "Tarea de prueba" });
    const response = await request(app).get(`/${task._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Tarea de prueba");
  });

  it("Debería crear una nueva tarea", async () => {
    const newTask = {
      name: "Nueva tarea de prueba",
      description: "Descripción de la nueva tarea",
      status: "Pendiente",
    };
    const response = await request(app).post("/").send(newTask);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Nueva tarea de prueba");
  });

  it("Debería actualizar una tarea existente", async () => {
    const task = await taskSchema.findOne({ name: "Tarea de prueba" });
    const updatedTask = {
      name: "Tarea actualizada",
    };
    const response = await request(app).patch(`/${task._id}`).send(updatedTask);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Tarea actualizada");
  });

  it("Debería obtener todas las tareas pendientes", async () => {
    const response = await request(app).get("/status/Pending");
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    response.body[0].forEach((task) => {
      expect(task.status).toBe("Pendiente");
    });
  });

  it("Debería obtener el número de días transcurridos desde la creación de una tarea", async () => {
    const task = await taskSchema.findOne({ taskSchema });
    const response = await request(app).get(`/${task._id}/dias-transcurridos`);
    expect(response.status).toBe(200);
    expect(response.body.transcurredDays).toBeGreaterThanOrEqual(0);
  });

  it("Debería eliminar una tarea existente", async () => {
    const task = await taskSchema.findOne({ taskSchema });
    const response = await request(app).delete(`/${task._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Tarea eliminada");
  });
});
