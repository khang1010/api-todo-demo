import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { todos } from "./todo";
import { Todo } from "./todo";

const findOne = (id: string) => {
  return todos.find((todo) => {
    return todo.id === id;
  });
};

export const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Bun Elysia API Documentation",
          version: "1.0.0",
        },
      },
    })
  )
  .get("/read", () => todos)
  .get("/read/:id", ({ params: { id }, set }) => {
    let todo = findOne(id);
    if (todo) {
      return todo;
    } else {
      set.status = 404;
      return "Not found";
    }
  })
  .post(
    "/create",
    ({ body, set }) => {
      let existing = findOne(body.id);
      if (existing) {
        set.status = 400;
        return "User already exists";
      } else {
        const todo: Todo = {
          id: body.id,
          info: body.info
        }
        todos.push(todo);
        set.status = 201;
        return {
          message: "create todo successfully",
          metadata: todo,
        };
      }
    },
    {
      body: t.Object({
        id: t.String(),
        info: t.String(),
      }),
    }
  )
  .put(
    "/update",
    ({ body, set }) => {
      let existing = findOne(body.id);
      if (existing) {
        let updated = Object.assign(existing, body);
        return updated;
      } else {
        const todo: Todo = {
          id: body.id,
          info: body.info
        }
        todos.push(todo);
        set.status = 201;
        return {
          message: "Update todo successfully",
          metadata: todo,
        };
      }
    },
    {
      body: t.Object({
        id: t.String(),
        info: t.String(),
      }),
    }
  )
  .delete("/delete/:id", ({ params: { id }, set }) => {
    let existing = findOne(id);
    if (existing) {
      let index = todos.findIndex((todo) => todo.id === existing?.id);
      todos.splice(index, 1);
      return existing;
    } else {
      set.status = 404;
      return "Not found";
    }
  })
  .listen(8084);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);