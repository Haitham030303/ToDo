const path = require("path");
const ejs = require("ejs");
const express = require("express");
const fs = require("fs");
const { send } = require("process");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/img")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.sendStatus(400);
    const obj = JSON.parse(data);
    res.render("home", { tasks: obj.tasks });
  });
});

app.get("/completed", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.sendStatus(400);
    const obj = JSON.parse(data);
    res.render("completed", { tasks: obj.completed });
  });
});

app.post("/completed/delete", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.sendStatus(400);
    const obj = JSON.parse(data);
    obj.completed = [];
    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(obj),
      (err) => {
        if (err) res.sendStatus(400);
        res.redirect("/completed");
      }
    );
  });
});

app.get("/today", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.sendStatus(400);
    const obj = JSON.parse(data);
    const todayTasks = obj.tasks.filter(
      (task) =>
        task.dueDate === new Date().toJSON().slice(0, 10).replace(/-/g, "-")
    );
    res.render("today", { tasks: todayTasks });
  });
});

app.post("/api/tasks", (req, res) => {
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.sendStatus(400);

    const obj = JSON.parse(data);

    const task = req.body.taskAdded;
    const id = obj.tasks.length + 1;
    let dueDate;

    const date = new Date();
    const current_date = new Date(new Date().setDate(new Date().getDate()))
      .toJSON()
      .slice(0, 10)
      .replace(/-/g, "-");

    if (req.body.dueDate) dueDate = req.body.dueDate;
    else dueDate = current_date;

    obj.tasks.push({ id: id, task: task, dueDate: dueDate });

    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(obj),
      (err) => {
        if (err) res.sendStatus(400);
      }
    );
  });
  res.redirect("/");
});

app.post("/api/tasks/delete/:id", (req, res) => {
  const taskId = req.body.checkbox;
  fs.readFile(path.join(__dirname, "db.json"), (err, data) => {
    if (err) res.status(400).send(err.message);

    const obj = JSON.parse(data);
    const task = obj.tasks.find((c) => c.id === parseInt(taskId));

    if (!task) res.status(404).send("Couldn't find task to delete!");

    const index = obj.tasks.indexOf(task);
    const deletedTask = obj.tasks.splice(index, 1);
    obj.completed.push(deletedTask[0]);
    fs.writeFile(
      path.join(__dirname, "db.json"),
      JSON.stringify(obj),
      (err) => {
        if (err) res.status(400).send(err.message);
        if (req.params.id === "1") res.redirect("/");
        else res.redirect("/today");
      }
    );
  });
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
