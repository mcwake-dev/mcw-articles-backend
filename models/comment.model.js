const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  timestamp: { type: Date, required: true, default: Date.now },
  author_id: { type: String, required: true },
  comment_body: { type: String, required: true },
});

const commentsSchema = new Schema({
  entity_type: { type: String, required: true },
  entity_id: { type: String, required: true },
  comments: [commentSchema],
});

commentsSchema.index({ entity_type: 1, entity_id: 1 }, { unique: true });

const Comment = mongoose.model("Comment", commentsSchema);

module.exports = Comment;
