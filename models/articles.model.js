const db = require("../db/connection");

exports.selectArticle = async (article_id) => {
  const results = await db.query(
    `
        SELECT articles.author, 
            articles.title, 
            articles.article_id, 
            articles.body, 
            articles.created_at
        FROM articles
        WHERE articles.article_id = $1;
    `,
    [article_id]
  );

  return results.rows[0];
};

exports.selectArticles = async (
  sort_by = "created_at",
  order = "desc",
  author = null
) => {
  const baseQuery = `
    SELECT articles.author, 
        articles.title, 
        articles.article_id, 
        articles.created_at
    FROM articles
    ${author ? "WHERE articles.author = $1" : ""}
    ORDER BY ${sort_by} ${order}, title ${order}
`;

  if (author) {
    results = await db.query(
      baseQuery,
      [author].filter((bind) => bind !== null)
    );
  } else {
    results = await db.query(baseQuery);
  }

  return results.rows;
};

exports.updateArticle = async (article_id, title, body) => {
  const results = await db.query(
    `
        UPDATE articles SET title = $1, body = $2 WHERE article_id = $3 RETURNING *;
    `,
    [title, body, article_id]
  );

  return results.rows[0];
};

exports.deleteArticle = async (article_id) => {
  const result = await db.query(
    `
      DELETE FROM articles WHERE article_id = $1;
    `,
    [article_id]
  );

  return result.rowCount === 1;
};

exports.insertArticle = async (author, title, body) => {
  const result = await db.query(
    `
    INSERT INTO articles (author, title, body) VALUES ($1, $2, $3) RETURNING *;
  `,
    [author, title, body]
  );

  return result.rows[0];
};

exports.mostRecentArticles = async () => {
  const result = await db.query(
    `SELECT * FROM articles ORDER BY created_at DESC LIMIT 3;`
  );

  return result.rows;
};
