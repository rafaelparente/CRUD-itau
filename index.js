const express = require('express');

const server = express();
server.use(express.json());

server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd('Request');
});

const users = ['kelly', 'dani', 'maycon', 'allan'];

function checkUsersInArray(req, res, next) {
  const user = users[req.params.index];
  if(!user) {
    return res.status(400).json({ error: "Index doesn't exist" });
  }
  req.user = user;

  return next();
}

function checkUsersExist(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is invalid" });
  }

  return next();
}

server.get("/users/", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUsersInArray, (req, res) => {
  return res.json(users[req.params.index]);
});

server.post("/users/", checkUsersExist, (req, res) => {
  const { name } = req.body;
  users.push(name);

  return res.status(201).json(users);
});

server.put("/users/:index", checkUsersInArray, checkUsersExist, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUsersInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json(users);
});

server.listen(3001);
