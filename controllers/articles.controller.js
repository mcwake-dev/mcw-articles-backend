const {
  selectArticle,
  selectArticles,
  updateArticle,
  deleteArticle,
  insertArticle,
  mostRecentArticles,
} = require("../models/articles.model");
const log = require("../log");

exports.getArticle = async (req, res, next) => {
  const logger = log.getLogger("Articles Controller > getArticle");

  try {
    const { article_id } = req.params;

    logger.log(`Getting article ID: ${article_id}`);

    const article = await selectArticle(article_id);

    if (article) {
      logger.log(`Found article ID ${article_id}`);
      res.status(200).send({ article });
    } else {
      const errorMessage = "Articles: Article not found";
      logger.warn(errorMessage);
      next({ status: 404, msg: errorMessage });
    }
  } catch (err) {
    logger.error(`Error occurred while getting article: ${err}`);
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  const logger = log.getLogger("Articles Controller > getArticles");

  try {
    const { sort_by, order, topic, author } = req.query;
    const allowedSorts = ["title", "created_at", "author"];
    const allowedSortOrder = ["desc", "asc"];

    if (sort_by && !allowedSorts.includes(sort_by)) {
      next({ status: 400, msg: "Articles: Invalid sort parameter" });
    } else if (order && !allowedSortOrder.includes(order)) {
      next({ status: 400, msg: "Articles: Invalid sort order parameter" });
    } else {
      let authorExists;

      if (author) {
        authorExists = await selectUser(author);
      }

      if (authorExists || !author) {
        const articles = await selectArticles(sort_by, order, topic, author);

        res.status(200).send({ articles });
      } else {
        next({ status: 404, msg: "Articles: Author not found" });
      }
    }
  } catch (err) {
    next(err);
  }
};

exports.patchArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const { title, body } = req.body;
    const articleExists = await selectArticle(article_id);

    if (articleExists) {
      if (title && body) {
        const article = await updateArticle(article_id, title, body);

        res.status(200).send({ article });
      } else {
        next({ status: 400, msg: "Missing parameters" });
      }
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { article_id } = req.params;
    const articleDeleted = await deleteArticle(article_id);

    if (articleDeleted) {
      res.sendStatus(204);
    } else {
      next({ status: 404, msg: "Article not found" });
    }
  } catch (err) {
    next(err);
  }
};

exports.postArticle = async (req, res, next) => {
  try {
    const { author, title, body } = req.body;

    if (author && title && body) {
      const article = await insertArticle(author, title, body);

      res.status(201).send({ article });
    } else {
      next({ status: 400, msg: "Missing required parameters" });
    }
  } catch (err) {
    next(err);
  }
};

exports.mostRecent = async (req, res, next) => {
  try {
    const recentArticles = await mostRecentArticles();

    res.status(200).send({ articles: recentArticles });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
