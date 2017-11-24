const path = require('path');
const s = require('underscore.string');

const helpers = {};

helpers.dir = function() {

  return path.basename(process.cwd());
};

helpers.name = function() {

  return s(helpers.dir()).humanize().titleize().value();
};

helpers.nameToSlug = function(name) {

  return s(name).slugify().value();
};


module.exports = helpers;
