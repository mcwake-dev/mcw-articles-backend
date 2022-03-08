const express = require("express");

const apiRouter = express.Router();
const commentsRouter = require("./comments.router");

apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
