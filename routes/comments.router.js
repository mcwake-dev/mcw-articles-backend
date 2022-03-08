const express = require("express");

const router = express.Router();
const {
  create,
  read,
  update,
  remove,
} = require("../controllers/comments.controller");

router.route("/:entity_type/:entity_id").post(create).get(read);

router
  .route("/:entity_type/:entity_id/:comment_id")
  .patch(update)
  .delete(remove);

module.exports = router;
