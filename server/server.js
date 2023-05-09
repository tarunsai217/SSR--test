import path from "path";
import fs from "fs";
import express from "express";
import ReactDomServer from "react-dom/server";
import App from "../src/App";
import React from "react";

const PORT = 8080;
const app = express();

const router = express.Router();

app.use("/build", express.static("build"));

app.use((req, res, next) => {
  if (/\.js|\.css|\.png/.test(req.path)) {
    res.redirect("build" + req.path);
  } else {
    next();
  }
});

app.get("*", (req, res) => {
  const context = {};
  const app = ReactDomServer.renderToString(<App />);

  const indexFile = path.resolve("./build/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("oops ! error");
    }
    return res.send(
      data.replace('<div id="root"></div>', `<div id="root">${app}</div>`)
    );
  });
});

router.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "10d" })
);

app.use(router);

app.listen(PORT, () => {
  console.log(`Port is running ${PORT}`);
});
