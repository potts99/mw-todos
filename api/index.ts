import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import crypto from "crypto";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

declare global {
  interface Global {
    todos: Todo[];
  }
}

const server = express();
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

global.todos = [
  {
    id: "31693794-a53b-41b8-bb39-965b94e37db5",
    text: "Create some todos...",
    completed: false,
    createdAt: "2023-04-27T16:58:40.657Z",
  },
];

server.get("/todos", (req: Request, res: Response) => {
  res.json(global.todos);
});

server.post("/todos/new", (req: Request, res: Response) => {
  const { text } = req.body;
  const stamp = Date.now();

  try {
    global.todos.push({
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      createdAt: stamp.toString(),
    });

    res.status(200).json({ todos: global.todos, success: true });
  } catch (error) {
    res.status(500).json({
      error,
      success: false,
    });
  }
});

server.put("/todos/:id", (req: Request, res: Response) => {
  const id = String(req.params.id);

  try {
    const todo = global.todos.find((todo) => todo.id === id);

    if (!todo) {
      res.status(404).json({ error: "Todo not found", success: false });
    } else {
      todo.completed = !todo.completed;

      console.log(global.todos);

      res.status(200).json({ todos: global.todos, success: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, success: false });
  }
});

server.delete("/todos/:id", (req: Request, res: Response) => {
  const todoId = String(req.params.id);

  global.todos = global.todos.filter((todo) => todo.id !== todoId);

  res.status(200).json({ todos: global.todos, success: true });
});

server.listen(8080, () => {
  console.log("Server listening at http://localhost:8080");
});
