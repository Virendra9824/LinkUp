const DataUriParser = require("datauri/parser.js");
const path = require("path");

const getDataUrl = (file) => {
  const parser = new DataUriParser();
  const buffer = file.buffer;
  const contentType = file.mimetype;
  const dataUrl = parser.format(contentType, buffer);
  return dataUrl;
};

module.exports = getDataUrl;
