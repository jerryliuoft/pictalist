const functions = require("firebase-functions");
const cheerio = require("cheerio");
//TODO remove cors because the host name should be same for cloud function and my website
const cors = require("cors")({ origin: true });
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

exports.scraper = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // your function body here - use the provided req and res from cors
    const data = await scrapMetatags(request.query.url);
    response.json(data);
  });
});

exports.searcher = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    const data = await axios.get('https://www.google.ca/complete/search', {params: {
      q: request.query.search,
      // cp: 14,
      client: 'gws-wiz',
      xssi: 't',
      gs_ri: 'gws-wiz',
      hl: 'en-CA',
      // authuser: 0,
      // psi: '9PppYJn5B9HysQWZ9paYCw.1617558357108',
      // dpr: 1.5
    }});
    response.json(data.data);
  });
});

