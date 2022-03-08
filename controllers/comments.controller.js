const commentModel = require("../models/comment.model");
const log = require("../log");

exports.create = async (req, res, next) => {
  const logger = log.getLogger("Comments Controller > Create");

  try {
    logger.info("Attempting to create new comment");

    const { entity_type, entity_id } = req.params;
    const { author_id, comment_body } = req.body;
    let existing = await commentModel.findOne({ entity_type, entity_id });

    if (!existing) {
      existing = await commentModel.create({ entity_type, entity_id });
    }

    existing.comments.push({ author_id, comment_body });

    const updated = await existing.save();

    res.status(201).send({ updated });
  } catch (err) {
    const errorMessage = `Error occurred while attempting to create new comment ${err}`;

    logger.warn(errorMessage);
    next({ status: 400, msg: errorMessage });
  }
};

exports.read = async (req, res, next) => {
  const logger = log.getLogger("Comments Controller > Read");

  try {
    logger.info("Attempting to get existing comments");
    const { entity_type, entity_id } = req.params;
    const existing = await commentModel.findOne({ entity_type, entity_id });

    if (existing) {
      res.status(200).send({ existing });
    } else {
      next();
    }
  } catch (err) {
    const errorMessage = `Error occurred while attempting to get comment ${err}`;

    logger.warn(errorMessage);
    next({ status: 400, msg: errorMessage });
  }
};

exports.update = async (req, res, next) => {
  const logger = log.getLogger("Comments Controller > Update");

  try {
    logger.info("Attempting to update comment");
    const { entity_type, entity_id, comment_id } = req.params;
    const { comment_body } = req.body;
    const updatedComments = await commentModel.findOneAndUpdate(
      { entity_type, entity_id, "comments._id": comment_id },
      {
        $set: {
          "comments.$.comment_body": comment_body,
        },
      },
      { returnDocument: "after" }
    );

    if (updatedComments) {
      res.status(200).send({ updated: updatedComments });
    } else {
      next({ status: 404, msg: "Comment not found" });
    }
  } catch (err) {
    const errorMessage = `Error occurred while attempting to update comment ${err}`;

    logger.warn(errorMessage);
    next({ status: 400, msg: errorMessage });
  }
};

exports.remove = async (req, res, next) => {
  const logger = log.getLogger("Comments Controller > Remove");

  try {
    logger.info("Attempting to remove comment");
    const { entity_type, entity_id, comment_id } = req.params;
    const updatedComments = await commentModel.findOneAndUpdate(
      { entity_type, entity_id, "comments._id": comment_id },
      {
        $pull: {
          comments: { _id: comment_id },
        },
      },
      { returnDocument: "after" }
    );

    if (updatedComments) {
      res.status(200).send({ updated: updatedComments });
    } else {
      next({ status: 404, msg: "Comment not found" });
    }
  } catch (err) {
    const errorMessage = `Error occurred while attempting to update comment ${err}`;

    logger.warn(errorMessage);
    next({ status: 400, msg: errorMessage });
  }
};
