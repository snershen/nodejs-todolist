import http from "http";
import { v4 as uuidv4 } from "uuid";
import { successHandler } from "./successHandler.js";
import { errorHandler } from "./errorHandler.js";
import { baseHeaders } from "./headers.js";
const todos = [];

const requestListener = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/todos" && req.method === "GET") {
    successHandler(baseHeaders, res, todos);
    return;
  }

  if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          successHandler(baseHeaders, res, todos);
        } else {
          errorHandler(baseHeaders, res, "title 欄位必填");
        }
      } catch (error) {
        errorHandler(res);
      }
    });
    return;
  }

  if (req.url === "/todos" && req.method === "DELETE") {
    if (todos.length > 0) {
      todos.length = 0;
      successHandler(baseHeaders, res, todos);
    } else {
      errorHandler(baseHeaders, res, "資料已清空");
    }
    return;
  }

  if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((el) => el.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      successHandler(baseHeaders, res, todos);
    } else {
      errorHandler(baseHeaders, res, "查無此 id");
    }
    return;
  }

  if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const id = req.url.split("/").pop();
        const index = todos.findIndex((el) => el.id === id);
        const title = JSON.parse(body).title;
        if (title !== undefined && index !== -1 && title.trim() !== "") {
          todos[index].title = title;
          successHandler(baseHeaders, res, todos);
        } else if (index === -1) {
          errorHandler(baseHeaders, res, "查無此 id");
        } else if (title.trim() === "") {
          errorHandler(baseHeaders, res, "title 欄位必填");
        } else {
          errorHandler(baseHeaders, res);
        }
      } catch (error) {
        errorHandler(baseHeaders, res);
      }
    });
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(200, baseHeaders);
    res.end();
    return;
  }

  res.writeHead(404, baseHeaders);
  res.write(
    JSON.stringify({
      status: "false",
      message: "找不到此路由",
    })
  );
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3005);
