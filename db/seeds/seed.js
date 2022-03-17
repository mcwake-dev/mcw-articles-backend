const format = require("pg-format");
const db = require("../connection");
const log = require("../../log");
const logger = log.getLogger("Seed");

const deleteAll = async () => {
  try {
    await db.query(`
      DROP TABLE IF EXISTS articles;
    `);
    logger.info("Deleted old data");
  } catch (err) {
    logger.error(err);
  }
};

const seed = async (articleData) => {
  await deleteAll();

  logger.info("Creating articles table");
  await db.query(`
    CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        body TEXT NOT NULL,
        author VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `);

  logger.info("Articles table created");

  logger.info("Seeding data");

  const articles = await db.query(
    format(
      `
          INSERT INTO articles (title, body, author, created_at) VALUES %L RETURNING *;
        `,
      articleData.map(({ title, body, author, created_at }) => [
        title,
        body,
        author,
        created_at,
      ])
    )
  );

  logger.info("Seeding data complete");
};

module.exports = seed;
