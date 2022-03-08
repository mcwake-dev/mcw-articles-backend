require("../../env/test");
const mongoose = require("mongoose");
const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");

const commentModel = require("../../models/comment.model");
const app = require("../../app");

beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.set("debug", true);
});

afterAll(async () => {
  await commentModel.deleteMany({});
  await mongoose.disconnect();
});

describe("POST /api/comments/:entity_type/:entity_id", () => {
  it("should create a new comment when passed valid comment data for an entity which does not have any comments", () =>
    request(app)
      .post("/api/comments/article/1")
      .send({
        author_id: "Test Author",
        comment_body: `This is a lovely comment`,
      })
      .expect(201)
      .then(({ body: { updated } }) => {
        expect(updated).toEqual(
          expect.objectContaining({
            __v: 1,
            _id: expect.any(String),
            entity_type: "article",
            entity_id: "1",
            comments: expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                timestamp: expect.any(String),
                author_id: "Test Author",
                comment_body: `This is a lovely comment`,
              }),
            ]),
          })
        );
      }));
  it("should create a new comment when passed valid comment data for an entity which has an existing comment", () =>
    request(app)
      .post("/api/comments/article/1")
      .send({
        author_id: "Test Author",
        comment_body: `This is a lovely comment`,
      })
      .expect(201)
      .then(({ body: { updated } }) => {
        expect(updated.comments.length).toEqual(2);
      }));
  it("should throw an error when entity type is missing", () =>
    request(app)
      .post("/api/comments/1")
      .send({
        author_id: "Test Author",
        comment_body: `This is a lovely comment`,
      })
      .expect(404));
  it("should throw an error when entity ID is missing", () =>
    request(app)
      .post("/api/comments/article")
      .send({
        author_id: "Test Author",
        comment_body: `This is a lovely comment`,
      })
      .expect(404));
  it("should throw an error when author ID is missing", () =>
    request(app)
      .post("/api/comments/article/1")
      .send({
        comment_body: `This is a lovely comment`,
      })
      .expect(400));

  it("should throw an error when comment body is missing", () =>
    request(app)
      .post("/api/comments/article/1")
      .send({
        author_id: "Test Author",
      })
      .expect(400));
});

describe("GET ./api/comments/article/1", () => {
  it("should retrieve existing comments for a valid entity type and entity ID", () =>
    request(app)
      .get("/api/comments/article/1")
      .expect(200)
      .then(({ body: { existing } }) => {
        expect(existing).toEqual(
          expect.objectContaining({
            __v: 2,
            _id: expect.any(String),
            entity_type: "article",
            entity_id: "1",
            comments: expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                timestamp: expect.any(String),
                author_id: "Test Author",
                comment_body: `This is a lovely comment`,
              }),
            ]),
          })
        );
        expect(existing.comments.length).toBe(2);
      }));
  it("should throw an error when entity type is missing", () =>
    request(app).get("/api/comments/1").expect(404));
  it("should throw an error when entity ID is missing", () =>
    request(app).get("/api/comments/article").expect(404));
  it("should throw an error when no comments existing for the given entity type and entity ID", () =>
    request(app).get("/api/comments/nothing/22").expect(404));
});

describe("PATCH /api/comments/:entity_type/:entity_id/:comment_id", () => {
  it("should update the comment body of the comment with the supplied comment_id", async () => {
    const {
      body: {
        updated: { comments },
      },
    } = await request(app).post("/api/comments/article/2").send({
      author_id: "Test Author",
      comment_body: `This is a lovely comment`,
    });
    const comment = comments[0];
    const {
      body: {
        updated: { comments: newComments },
      },
    } = await request(app)
      .patch(`/api/comments/article/2/${comment._id}`)
      .send({
        comment_body: "This is a lovely updated comment",
      });
    const updatedComment = newComments[0];

    expect(updatedComment).toEqual(
      expect.objectContaining({
        _id: comment._id,
        author_id: "Test Author",
        comment_body: `This is a lovely updated comment`,
        timestamp: expect.any(String),
      })
    );
  });
});

describe("DELETE /api/comments/:entity_type/:entity_id/:comment_id", () => {
  it("should delete a comment with the supplied comment_id", async () => {
    const {
      body: {
        updated: { comments },
      },
    } = await request(app).post("/api/comments/article/2").send({
      author_id: "Test Author",
      comment_body: `This is a lovely comment`,
    });
    const comment = comments[0];
    const {
      body: {
        updated: { comments: newComments },
      },
    } = await request(app).delete(`/api/comments/article/2/${comment._id}`);

    const oldComment = newComments.find((cm) => cm._id === comment._id);

    console.log(newComments);

    expect(oldComment).toBe(undefined);
  });
});
