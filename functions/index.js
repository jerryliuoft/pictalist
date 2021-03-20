const functions = require("firebase-functions");
const cheerio = require("cheerio");
// const cors = require("cors")({ origin: true });
const axios = require("axios");

const isValidHttpUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return true;
};

const scrapMetatags = async (searchString) => {
  if (!isValidHttpUrl(searchString)) {
    return {};
  }
  try {
    const { data } = await axios.get(searchString);

    const $ = cheerio.load(data);
    const getMetatag = (name) =>
      $(`meta[name=${name}]`).attr("content") ||
      $(`meta[name="og:${name}"]`).attr("content") ||
      $(`meta[name="twitter:${name}"]`).attr("content") ||
      $(`meta[property=${name}]`).attr("content") ||
      $(`meta[property="og:${name}"]`).attr("content") ||
      $(`meta[property="twitter:${name}"]`).attr("content");

    return {
      url: searchString,
      name: $("title").first().text(),
      favicon: $('link[rel="shortcut icon"]').attr("href"),
      description: getMetatag("description"),
      image: getMetatag("image"),
      author: getMetatag("author"),
    };
  } catch (error) {
    return error;
  }
};

exports.scraper = functions.https.onRequest(async (request, response) => {
  const data = await scrapMetatags(request.query.url);
  response.json(data);
});
