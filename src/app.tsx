// This serves is the main component of the UI application. You can create
// sub-components and import them here, as well as importing stylesheets
// and other assets here too.

import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [filter, setFilter] = useState<string>("all");

  async function addTodo() {
    if (inputValue !== "") {
      const res = await fetch(`/api/todos/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputValue,
        }),
      }).then((res) => res.json());

      if (res.success) {
        setInputValue("");
        setTodos(res.todos);
      }
    } else {
      alert("Please enter a todo!");
    }
  }

  async function isCompleted(id: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
    }).then((res) => res.json());
    if (res.success) {
      setTodos(res.todos);
    }
  }

  async function fetchTodos() {
    const res = await fetch(`/api/todos`).then((res) => res.json());
    setTodos(res);
    console.log(res);
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (res.success) {
      setTodos(res.todos);
    }
  }

  const filterTodos = () => {
    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    } else if (filter === "incomplete") {
      return todos.filter((todo) => !todo.completed);
    } else {
      return todos;
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen py-12">
      <h1 className="text-3xl font-bold ">Todo</h1>

      <div className="flex flex-row items-center mt-4 w-[20%] space-x-4 ">
        <button
          onClick={() => setFilter("all")}
          type="button"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          all
        </button>
        <button
          onClick={() => setFilter("completed")}
          className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Completed
        </button>
        <button
          onClick={() => setFilter("incomplete")}
          className="rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Incomplete
        </button>
      </div>
      <div className="w-1/4 mt-8">
        <input
          type="text"
          value={inputValue}
          placeholder="New Todo"
          className="block w-full  rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
      </div>

      <div className="mt-4 w-2/4 flex flex-col space-y-4">
        {filterTodos().map((todo, index) => (
          <div key={index} className="flex flex-row items-center space-x-4 ">
            <span
              onClick={() => isCompleted(todo.id)}
              className={classNames(
                "bg-gray-200 rounded-md p-2 w-full flex flex-row justify-between text-sm hover:bg-gray-300 hover:cursor-pointer ",
                todo.completed ? "line-through" : ""
              )}
            >
              {todo.text}
            </span>
            <div className="flex-1">
              <button onClick={() => deleteTodo(todo.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mt-2 hover:text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
