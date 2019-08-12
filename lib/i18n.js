const languages = [
  "ja",
];

exports.languages = () => languages;
exports.init = (lang) => init(lang);

const init = (lang) => {
  if (!languages.includes(lang)) {
    throw "unknown language: " + lang;
  }

  return require("./i18n/" + lang).init();
};
